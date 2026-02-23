use axum::{
    body::Body,
    extract::State,
    http::{header, Request, StatusCode},
    response::{IntoResponse, Response},
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
    layout: RwLock<Option<String>>,
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

    let layout_file = base_dir.join(".layout.html");
    let initial_layout = if layout_file.exists() {
        fs::read_to_string(&layout_file).await.ok()
    } else {
        None
    };

    let state = Arc::new(AppState {
        base_dir: base_dir.clone(),
        cache: RwLock::new(HashMap::new()),
        visits: AtomicUsize::new(initial_visits),
        last_saved_visits: AtomicUsize::new(initial_visits),
        visited_ips: RwLock::new(HashSet::new()),
        trusted_proxy: args.trusted_proxy,
        custom_strings: RwLock::new(custom_strings),
        layout: RwLock::new(initial_layout),
    });

    // Initial preloading of all files into RAM
    preload_files(&state).await;

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

    // Background task to reload .layout.html every 10 seconds
    let state_layout = state.clone();
    let layout_file_clone = layout_file.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(10));
        loop {
            interval.tick().await;
            if let Ok(content) = fs::read_to_string(&layout_file_clone).await {
                let mut layout = state_layout.layout.write().await;
                let changed = layout.as_ref() != Some(&content);
                if changed {
                    *layout = Some(content);
                    // Reload all files to apply new layout
                    preload_files(&state_layout).await;
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

async fn preload_files(state: &Arc<AppState>) {
    let mut stack = vec![state.base_dir.clone()];
    let mut new_cache = HashMap::new();

    while let Some(dir) = stack.pop() {
        if let Ok(mut entries) = fs::read_dir(&dir).await {
            while let Ok(Some(entry)) = entries.next_entry().await {
                let path = entry.path();
                if path.is_dir() {
                    stack.push(path);
                } else if path.is_file() {
                    let rel_path = path.strip_prefix(&state.base_dir).unwrap().to_string_lossy().to_string();
                    let file_path = rel_path.replace("\\", "/");
                    
                    if file_path.split('/').any(|s| s.starts_with('.')) && !file_path.ends_with(".layout.html") && !file_path.ends_with(".gallery-template.html") {
                        continue;
                    }

                    if let Ok(data) = fs::read(&path).await {
                        let mut arc_data = Arc::new(data);
                        let mime_type = from_path(&path).first_or_octet_stream();
                        let is_html = mime_type.type_() == mime_guess::mime::TEXT && mime_type.subtype() == mime_guess::mime::HTML;

                        if is_html {
                            let is_template = file_path.split('/').any(|s| s.starts_with('.'));
                            if !is_template {
                                if let Ok(text) = String::from_utf8(arc_data.as_ref().clone()) {
                                    let layout = state.layout.read().await;
                                    if let Some(layout_text) = layout.as_ref() {
                                        let assembled = layout_text.replace("{{outlet}}", &text);
                                        arc_data = Arc::new(assembled.into_bytes());
                                    }
                                }
                            }
                        }

                        new_cache.insert(file_path, arc_data);
                    }
                }
            }
        }
    }

    let mut cache = state.cache.write().await;
    *cache = new_cache;
}

async fn handle_request(
    State(state): State<Arc<AppState>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    req: Request<Body>,
) -> Response {
    let path = req.uri().path().to_string();
    
    // IP logging and visit counting
    let mut client_ip = addr.ip().to_string();
    if state.trusted_proxy {
        if let Some(cf_ip) = req.headers().get("CF-Connecting-IP") {
            if let Ok(ip_str) = cf_ip.to_str() { client_ip = ip_str.to_string(); }
        }
    }
    let mut hasher = DefaultHasher::new();
    client_ip.hash(&mut hasher);
    let ip_hash = hasher.finish();
    let mut ips = state.visited_ips.write().await;
    if ips.insert(ip_hash) {
        state.visits.fetch_add(1, Ordering::SeqCst);
    }

    let mut file_path = path.trim_start_matches('/').to_string();

    // Handle root path and directory requests for index.html
    if file_path.is_empty() || file_path.ends_with('/') {
        file_path = format!("{}index.html", file_path);
    }

    // Clean URL logic: if /gallery is requested, try gallery.html
    {
        let cache = state.cache.read().await;
        if !cache.contains_key(&file_path) {
            if !file_path.contains('.') {
                let html_path = format!("{}.html", file_path);
                if cache.contains_key(&html_path) {
                    file_path = html_path;
                }
            }
        }
    }

    // Do not serve any files starting with `.`
    if file_path.split('/').any(|segment| segment.starts_with('.')) {
        return (StatusCode::FORBIDDEN, "Forbidden").into_response();
    }

    let cache = state.cache.read().await;
    let content = match cache.get(&file_path) {
        Some(c) => c,
        None => {
            return (StatusCode::NOT_FOUND, "Not Found").into_response();
        }
    };

    let mime_type = from_path(&file_path).first_or_octet_stream();
    let is_html = mime_type.type_() == mime_guess::mime::TEXT && mime_type.subtype() == mime_guess::mime::HTML;

    let mut response_body = content.as_ref().clone();

    // Hydration replacing logic for HTML
    if is_html {
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

            // Gallery logic
            if text.contains("{{gallery}}") || text.contains("{{gallery:count}}") {
                let template_key = "gallery/.gallery-template.html";
                
                if let Some(template_data) = cache.get(template_key) {
                    if let Ok(template) = String::from_utf8(template_data.as_ref().clone()) {
                        let mut gallery_items = Vec::new();
                        let mut count = 0;
                        
                        let mut sorted_keys: Vec<_> = cache.keys().collect();
                        sorted_keys.sort();

                        for key in sorted_keys {
                            if key.starts_with("gallery/") && !key.contains("/.") {
                                let ext = key.split('.').last().unwrap_or("").to_lowercase();
                                if ["jpg", "jpeg", "png", "webp", "gif"].contains(&ext.as_str()) {
                                    count += 1;
                                    let filename = key.split('/').last().unwrap_or(key);
                                    let mut item = template.clone();
                                    item = item.replace("{filepath}", &format!("/{}", key));
                                    item = item.replace("{filename}", filename);
                                    gallery_items.push(item);
                                }
                            }
                        }
                        
                        text = text.replace("{{gallery}}", &gallery_items.join("\n"));
                        text = text.replace("{{gallery:count}}", &count.to_string());
                    }
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
