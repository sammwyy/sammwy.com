use axum::{
    body::Body,
    extract::{Path, State},
    http::{header, Request, StatusCode},
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use clap::Parser;
use mime_guess::from_path;
use serde_json;
use std::{
    collections::{HashMap, HashSet},
    hash::{DefaultHasher, Hash, Hasher},
    net::SocketAddr,
    path::PathBuf,
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc,
    },
    time::Duration,
};
use axum::extract::ConnectInfo;
use tokio::{fs, sync::RwLock};

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Path to the directory to serve
    #[arg(short, long, default_value = ".")]
    path: PathBuf,

    /// Port to listen on
    #[arg(long, default_value_t = 8080)]
    port: u16,

    /// Trust proxy headers for IP (e.g. CF-Connecting-IP)
    #[arg(long, default_value_t = false)]
    trusted_proxy: bool,
}

struct AppState {
    base_dir: PathBuf,
    cache: RwLock<HashMap<String, Arc<Vec<u8>>>>,
    visits: AtomicUsize,
    last_saved_visits: AtomicUsize,
    visited_ips: RwLock<HashSet<u64>>,
    trusted_proxy: bool,
    custom_strings: RwLock<HashMap<String, String>>,
}

#[tokio::main]
async fn main() {
    let args = Args::parse();
    let base_dir = args.path.canonicalize().unwrap_or(args.path);

    let visits_file = base_dir.join(".visits");
    let initial_visits = if visits_file.exists() {
        let content = fs::read_to_string(&visits_file).await.unwrap_or_default();
        content.trim().parse::<usize>().unwrap_or(0)
    } else {
        0
    };
    
    let custom_file = base_dir.join(".custom");
    let custom_strings = if custom_file.exists() {
        let content = fs::read_to_string(&custom_file).await.unwrap_or_default();
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        HashMap::new()
    };

    let state = Arc::new(AppState {
        base_dir: base_dir.clone(),
        cache: RwLock::new(HashMap::new()),
        visits: AtomicUsize::new(initial_visits),
        last_saved_visits: AtomicUsize::new(initial_visits),
        visited_ips: RwLock::new(HashSet::new()),
        trusted_proxy: args.trusted_proxy,
        custom_strings: RwLock::new(custom_strings),
    });

    // Background task to save .visits every 10 seconds if mutated
    let state_clone = state.clone();
    let visits_file_clone = visits_file.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(10));
        loop {
            interval.tick().await;
            let current_visits = state_clone.visits.load(Ordering::SeqCst);
            let last_saved = state_clone.last_saved_visits.load(Ordering::SeqCst);
            
            if current_visits != last_saved {
                if let Err(e) = fs::write(&visits_file_clone, current_visits.to_string()).await {
                    eprintln!("Failed to write .visits file: {}", e);
                } else {
                    state_clone.last_saved_visits.store(current_visits, Ordering::SeqCst);
                }
            }
        }
    });

    // Background task to clear IP set every 1 hour
    let state_ips = state.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(3600));
        loop {
            interval.tick().await;
            let mut ips = state_ips.visited_ips.write().await;
            ips.clear();
        }
    });

    // Background task to reload .custom every 10 seconds
    let state_custom = state.clone();
    let custom_file_clone = custom_file.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(10));
        loop {
            interval.tick().await;
            if let Ok(content) = fs::read_to_string(&custom_file_clone).await {
                if let Ok(new_strings) = serde_json::from_str::<HashMap<String, String>>(&content) {
                    let mut strings = state_custom.custom_strings.write().await;
                    *strings = new_strings;
                }
            }
        }
    });

    let app = Router::new()
        .fallback(handle_request)
        .with_state(state);

    let bind_addr = SocketAddr::from(([0, 0, 0, 0], args.port));
    println!("Server running on http://{} serving {:?}", bind_addr, base_dir);
    
    let listener = tokio::net::TcpListener::bind(bind_addr).await.unwrap();
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>()).await.unwrap();
}

async fn handle_request(
    State(state): State<Arc<AppState>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    req: Request<Body>,
) -> Response {
    let mut path = req.uri().path().to_string();
    
    // Check if it's the index, and update visits counter
    if path == "/" || path == "/index.html" {
        path = "/index.html".to_string();
        
        let mut client_ip = addr.ip().to_string();
        if state.trusted_proxy {
            if let Some(cf_ip) = req.headers().get("CF-Connecting-IP") {
                if let Ok(ip_str) = cf_ip.to_str() {
                    client_ip = ip_str.to_string();
                }
            } else if let Some(xff) = req.headers().get("X-Forwarded-For") {
                if let Ok(ip_str) = xff.to_str() {
                    if let Some(first_ip) = ip_str.split(',').next() {
                        client_ip = first_ip.trim().to_string();
                    }
                }
            }
        }
        
        let mut hasher = DefaultHasher::new();
        client_ip.hash(&mut hasher);
        let ip_hash = hasher.finish();

        let mut ips = state.visited_ips.write().await;
        if ips.insert(ip_hash) {
            state.visits.fetch_add(1, Ordering::SeqCst);
        }
    } else if path.ends_with('/') {
        path.push_str("index.html");
    }

    // Do not serve any files starting with `.`
    if path.split('/').any(|segment| segment.starts_with('.')) {
        return (StatusCode::FORBIDDEN, "Forbidden").into_response();
    }

    let file_path = path.trim_start_matches('/');
    let full_path = state.base_dir.join(file_path);

    // Prevent directory traversal
    if !full_path.starts_with(&state.base_dir) {
        return (StatusCode::FORBIDDEN, "Forbidden").into_response();
    }

    let file_content = {
        let cache = state.cache.read().await;
        cache.get(file_path).cloned()
    };

    let content = match file_content {
        Some(c) => c,
        None => {
            // Not in RAM cache, read from HDD
            match fs::read(&full_path).await {
                Ok(data) => {
                    let arc_data = Arc::new(data);
                    let mut cache = state.cache.write().await;
                    cache.insert(file_path.to_string(), arc_data.clone());
                    arc_data
                }
                Err(_) => {
                    return (StatusCode::NOT_FOUND, "Not Found").into_response();
                }
            }
        }
    };

    let mime_type = from_path(&full_path).first_or_octet_stream();
    let mut response_body = content.as_ref().clone();

    // Hydration replacing logic for HTML
    if mime_type.type_() == mime_guess::mime::TEXT && mime_type.subtype() == mime_guess::mime::HTML {
        if let Ok(mut text) = String::from_utf8(response_body.clone()) {
            let visits = state.visits.load(Ordering::SeqCst);
            
            // Replaces the placeholder with a zero-padded counter (6 digits) and the raw digit
            let formatted_visits = format!("{:06}", visits);
            text = text.replace("{{visits:counter}}", &formatted_visits);

            // Replaces custom placeholders
            {
                let strings = state.custom_strings.read().await;
                for (key, value) in strings.iter() {
                    text = text.replace(&format!("{{{{custom:{}}}}}", key), value);
                }
            }
            
            response_body = text.into_bytes();
        }
    }

    (
        StatusCode::OK,
        [(header::CONTENT_TYPE, mime_type.as_ref())],
        response_body,
    ).into_response()
}
