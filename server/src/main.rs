use axum::{
    body::Body,
    extract::{ConnectInfo, State},
    http::{header, HeaderMap, Request, StatusCode},
    response::{IntoResponse, Response},
    Router,
};
use bytes::Bytes;
use clap::Parser;
use mime_guess::from_path;
use std::{
    collections::{hash_map::DefaultHasher, HashMap, HashSet},
    hash::{Hash, Hasher},
    net::{IpAddr, SocketAddr},
    path::PathBuf,
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc,
    },
    time::{Duration, Instant},
};
use tokio::{
    fs,
    sync::{mpsc, RwLock},
};

const ANALYTICS_QUEUE_SIZE: usize = 16_384;
const COUNTER: &[u8] = b"{{visits:counter}}";

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    #[arg(short, long, default_value = ".")]
    path: PathBuf,
    #[arg(long, default_value_t = 9550)]
    port: u16,
    #[arg(long, default_value_t = false)]
    trusted_proxy: bool,
}

#[derive(Clone)]
struct CachedFile {
    body: Bytes,
    mime: String,
    etag: String,
    cache_control: &'static str,
    has_visit_counter: bool,
}
type Cache = HashMap<String, CachedFile>;
struct AppState {
    base_dir: PathBuf,
    cache: RwLock<Arc<Cache>>,
    visits: AtomicUsize,
    last_saved_visits: AtomicUsize,
    analytics_tx: mpsc::Sender<u64>,
    trusted_proxy: bool,
}

#[tokio::main]
async fn main() {
    let args = Args::parse();
    let base_dir = args.path.canonicalize().unwrap_or(args.path);
    let visits_file = base_dir.join(".visits");
    let initial_visits = read_visits(&visits_file).await;
    let (analytics_tx, analytics_rx) = mpsc::channel(ANALYTICS_QUEUE_SIZE);
    let state = Arc::new(AppState {
        base_dir: base_dir.clone(),
        cache: RwLock::new(Arc::new(Cache::new())),
        visits: AtomicUsize::new(initial_visits),
        last_saved_visits: AtomicUsize::new(initial_visits),
        analytics_tx,
        trusted_proxy: args.trusted_proxy,
    });
    if let Err(error) = reload_cache(&state).await {
        eprintln!("Initial cache load failed: {error}");
    }
    spawn_analytics_worker(analytics_rx, state.clone());
    spawn_visits_writer(state.clone(), visits_file);
    spawn_template_reloader(state.clone());
    let app = Router::new().fallback(handle_request).with_state(state);
    let bind_addr = SocketAddr::from(([0, 0, 0, 0], args.port));
    println!(
        "Server running on http://{} serving {:?}",
        bind_addr, base_dir
    );
    let listener = tokio::net::TcpListener::bind(bind_addr).await.unwrap();
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .unwrap();
}

async fn read_visits(path: &std::path::Path) -> usize {
    fs::read_to_string(path)
        .await
        .ok()
        .and_then(|s| s.trim().parse().ok())
        .unwrap_or(0)
}
fn spawn_analytics_worker(mut rx: mpsc::Receiver<u64>, state: Arc<AppState>) {
    tokio::spawn(async move {
        let mut seen = HashSet::new();
        let mut clear_at = Instant::now() + Duration::from_secs(3600);
        loop {
            tokio::select! {
                event = rx.recv() => match event { Some(ip) => if seen.insert(ip) { state.visits.fetch_add(1, Ordering::Relaxed); }, None => break },
                _ = tokio::time::sleep_until(tokio::time::Instant::from_std(clear_at)) => { seen.clear(); clear_at = Instant::now() + Duration::from_secs(3600); }
            }
        }
    });
}
fn spawn_visits_writer(state: Arc<AppState>, visits_file: PathBuf) {
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(10));
        loop {
            interval.tick().await;
            let current = state.visits.load(Ordering::Relaxed);
            if current != state.last_saved_visits.load(Ordering::Relaxed) {
                match fs::write(&visits_file, current.to_string()).await {
                    Ok(()) => state.last_saved_visits.store(current, Ordering::Relaxed),
                    Err(error) => eprintln!("Failed to write .visits: {error}"),
                }
            }
        }
    });
}
fn spawn_template_reloader(state: Arc<AppState>) {
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(10));
        let mut fingerprint = template_fingerprint(&state.base_dir).await;
        loop {
            interval.tick().await;
            let next = template_fingerprint(&state.base_dir).await;
            if next != fingerprint {
                fingerprint = next;
                if let Err(error) = reload_cache(&state).await {
                    eprintln!("Cache reload failed: {error}");
                }
            }
        }
    });
}
async fn template_fingerprint(base: &std::path::Path) -> u64 {
    let mut h = DefaultHasher::new();
    for name in [".custom", ".layout.html", "gallery/.gallery-template.html"] {
        if let Ok(data) = fs::read(base.join(name)).await {
            data.hash(&mut h);
        }
    }
    h.finish()
}

async fn reload_cache(state: &Arc<AppState>) -> Result<(), std::io::Error> {
    let layout = fs::read_to_string(state.base_dir.join(".layout.html"))
        .await
        .ok();
    let custom = fs::read_to_string(state.base_dir.join(".custom"))
        .await
        .ok()
        .and_then(|text| serde_json::from_str(&text).ok())
        .unwrap_or_default();
    let cache = build_cache(&state.base_dir, layout.as_deref(), &custom).await?;
    *state.cache.write().await = Arc::new(cache);
    Ok(())
}
async fn build_cache(
    base: &std::path::Path,
    layout: Option<&str>,
    custom: &HashMap<String, String>,
) -> Result<Cache, std::io::Error> {
    let mut stack = vec![base.to_path_buf()];
    let mut source = HashMap::<String, Bytes>::new();
    while let Some(dir) = stack.pop() {
        let mut entries = match fs::read_dir(&dir).await {
            Ok(entries) => entries,
            Err(_) => continue,
        };
        while let Some(entry) = entries.next_entry().await? {
            let path = entry.path();
            if path.is_dir() {
                stack.push(path);
                continue;
            }
            if !path.is_file() {
                continue;
            }
            let key = path
                .strip_prefix(base)
                .unwrap()
                .to_string_lossy()
                .replace('\\', "/");
            if contains_dotfile(&key)
                && key != ".layout.html"
                && key != ".custom"
                && key != "gallery/.gallery-template.html"
            {
                continue;
            }
            if let Ok(data) = fs::read(path).await {
                source.insert(key, Bytes::from(data));
            }
        }
    }
    let (gallery, gallery_count) = precompute_gallery(&source);
    let mut cache = Cache::new();
    for (key, raw) in &source {
        if contains_dotfile(key) {
            continue;
        }
        let mime = from_path(key).first_or_octet_stream().to_string();
        let is_html = mime == "text/html";
        let body = if is_html {
            render_html(raw, layout, custom, &gallery, gallery_count)
        } else {
            raw.clone()
        };
        let mut h = DefaultHasher::new();
        body.hash(&mut h);
        cache.insert(
            key.clone(),
            CachedFile {
                etag: format!("\"{:x}-{:x}\"", body.len(), h.finish()),
                cache_control: if is_html {
                    "no-cache"
                } else if is_fingerprinted(key) {
                    "public, max-age=31536000, immutable"
                } else {
                    "public, max-age=86400"
                },
                has_visit_counter: is_html && body.windows(COUNTER.len()).any(|w| w == COUNTER),
                body,
                mime,
            },
        );
    }
    Ok(cache)
}
fn render_html(
    raw: &Bytes,
    layout: Option<&str>,
    custom: &HashMap<String, String>,
    gallery: &str,
    gallery_count: usize,
) -> Bytes {
    let Ok(mut page) = std::str::from_utf8(raw).map(str::to_owned) else {
        return raw.clone();
    };
    if let Some(layout) = layout {
        page = layout.replace("{{outlet}}", &page);
    }
    page = page
        .replace("{{gallery}}", gallery)
        .replace("{{gallery:count}}", &gallery_count.to_string());
    for (key, value) in custom {
        page = page.replace(&format!("{{{{custom:{key}}}}}"), value);
    }
    Bytes::from(page)
}
fn precompute_gallery(source: &HashMap<String, Bytes>) -> (String, usize) {
    let Some(template) = source
        .get("gallery/.gallery-template.html")
        .and_then(|b| std::str::from_utf8(b).ok())
    else {
        return (String::new(), 0);
    };
    let mut keys: Vec<_> = source
        .keys()
        .filter(|key| key.starts_with("gallery/") && !contains_dotfile(key) && is_image(key))
        .collect();
    keys.sort_unstable();
    let count = keys.len();
    (
        keys.into_iter()
            .map(|key| {
                template
                    .replace("{filepath}", &format!("/{key}"))
                    .replace("{filename}", key.rsplit('/').next().unwrap_or(key))
            })
            .collect::<Vec<_>>()
            .join("\n"),
        count,
    )
}
fn is_image(path: &str) -> bool {
    matches!(
        path.rsplit('.')
            .next()
            .unwrap_or("")
            .to_ascii_lowercase()
            .as_str(),
        "jpg" | "jpeg" | "png" | "webp" | "gif"
    )
}
fn contains_dotfile(path: &str) -> bool {
    path.split('/').any(|part| part.starts_with('.'))
}
fn is_fingerprinted(path: &str) -> bool {
    path.rsplit('/')
        .next()
        .and_then(|name| name.split('.').nth_back(1))
        .is_some_and(|part| part.len() >= 8 && part.bytes().all(|b| b.is_ascii_hexdigit()))
}
fn resolve_path(path: &str, cache: &Cache) -> Result<String, StatusCode> {
    let mut key = path.trim_start_matches('/').to_owned();
    if key.is_empty() || key.ends_with('/') {
        key.push_str("index.html");
    }
    if contains_dotfile(&key) || key.split('/').any(|part| part == "..") {
        return Err(StatusCode::FORBIDDEN);
    }
    if !cache.contains_key(&key) && !key.contains('.') {
        let html = format!("{key}.html");
        if cache.contains_key(&html) {
            key = html;
        }
    }
    Ok(key)
}
fn extract_client_ip(headers: &HeaderMap, addr: SocketAddr, trusted_proxy: bool) -> IpAddr {
    if trusted_proxy {
        if let Some(ip) = headers
            .get("CF-Connecting-IP")
            .and_then(|v| v.to_str().ok())
            .and_then(|v| v.parse().ok())
        {
            return ip;
        }
    }
    addr.ip()
}

async fn handle_request(
    State(state): State<Arc<AppState>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    req: Request<Body>,
) -> Response {
    let ip = extract_client_ip(req.headers(), addr, state.trusted_proxy);
    let mut h = DefaultHasher::new();
    ip.hash(&mut h);
    let _ = state.analytics_tx.try_send(h.finish());
    let cache = state.cache.read().await.clone();
    let key = match resolve_path(req.uri().path(), &cache) {
        Ok(key) => key,
        Err(_) => return (StatusCode::FORBIDDEN, "Forbidden").into_response(),
    };
    let Some(file) = cache.get(&key).cloned() else {
        return (StatusCode::NOT_FOUND, "Not Found").into_response();
    };
    if !file.has_visit_counter
        && req
            .headers()
            .get(header::IF_NONE_MATCH)
            .and_then(|v| v.to_str().ok())
            .is_some_and(|tag| tag == file.etag)
    {
        return Response::builder()
            .status(StatusCode::NOT_MODIFIED)
            .header(header::ETAG, file.etag)
            .header(header::CACHE_CONTROL, file.cache_control)
            .body(Body::empty())
            .unwrap();
    }
    let body = if file.has_visit_counter {
        Bytes::from(String::from_utf8_lossy(&file.body).replace(
            "{{visits:counter}}",
            &format!("{:06}", state.visits.load(Ordering::Relaxed)),
        ))
    } else {
        file.body.clone()
    };
    let mut builder = Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, file.mime)
        .header(header::CACHE_CONTROL, file.cache_control)
        .header(header::CONTENT_LENGTH, body.len());
    if !file.has_visit_counter {
        builder = builder.header(header::ETAG, file.etag);
    }
    if req.method() == axum::http::Method::HEAD {
        builder.body(Body::empty()).unwrap()
    } else {
        builder.body(Body::from(body)).unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::HeaderValue;
    fn cache(keys: &[&str]) -> Cache {
        keys.iter()
            .map(|key| {
                (
                    (*key).to_owned(),
                    CachedFile {
                        body: Bytes::from_static(b"ok"),
                        mime: "text/plain".into(),
                        etag: "\"x\"".into(),
                        cache_control: "public",
                        has_visit_counter: false,
                    },
                )
            })
            .collect()
    }
    #[test]
    fn clean_urls_resolve() {
        assert_eq!(
            resolve_path("/gallery", &cache(&["gallery.html"])).unwrap(),
            "gallery.html"
        );
        assert_eq!(
            resolve_path("/", &cache(&["index.html"])).unwrap(),
            "index.html"
        );
    }
    #[test]
    fn dotfiles_are_rejected() {
        assert_eq!(
            resolve_path("/.visits", &Cache::new()),
            Err(StatusCode::FORBIDDEN)
        );
        assert_eq!(
            resolve_path("/assets/.secret", &Cache::new()),
            Err(StatusCode::FORBIDDEN)
        );
    }
    #[test]
    fn trusted_proxy_is_explicit() {
        let mut h = HeaderMap::new();
        h.insert("CF-Connecting-IP", HeaderValue::from_static("1.2.3.4"));
        let addr: SocketAddr = "10.0.0.1:1234".parse().unwrap();
        assert_eq!(extract_client_ip(&h, addr, false).to_string(), "10.0.0.1");
        assert_eq!(extract_client_ip(&h, addr, true).to_string(), "1.2.3.4");
    }
    #[tokio::test]
    async fn saturated_analytics_does_not_block_serving() {
        let (tx, _rx) = mpsc::channel(1);
        tx.try_send(1).unwrap();
        let state = Arc::new(AppState {
            base_dir: PathBuf::new(),
            cache: RwLock::new(Arc::new(cache(&["index.html"]))),
            visits: AtomicUsize::new(0),
            last_saved_visits: AtomicUsize::new(0),
            analytics_tx: tx,
            trusted_proxy: false,
        });
        let req = Request::builder().uri("/").body(Body::empty()).unwrap();
        let response = tokio::time::timeout(
            Duration::from_millis(50),
            handle_request(
                State(state),
                ConnectInfo("127.0.0.1:1".parse().unwrap()),
                req,
            ),
        )
        .await
        .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
    }
    #[tokio::test]
    async fn cached_static_response_has_length_and_etag() {
        let (tx, _) = mpsc::channel(1);
        let state = Arc::new(AppState {
            base_dir: PathBuf::new(),
            cache: RwLock::new(Arc::new(cache(&["index.html"]))),
            visits: AtomicUsize::new(0),
            last_saved_visits: AtomicUsize::new(0),
            analytics_tx: tx,
            trusted_proxy: false,
        });
        let req = Request::builder().uri("/").body(Body::empty()).unwrap();
        let response = handle_request(
            State(state),
            ConnectInfo("127.0.0.1:1".parse().unwrap()),
            req,
        )
        .await;
        assert_eq!(response.headers()[header::CONTENT_LENGTH], "2");
        assert_eq!(response.headers()[header::ETAG], "\"x\"");
    }
    #[tokio::test]
    async fn head_keeps_metadata_without_a_payload() {
        let (tx, _) = mpsc::channel(1);
        let state = Arc::new(AppState {
            base_dir: PathBuf::new(),
            cache: RwLock::new(Arc::new(cache(&["index.html"]))),
            visits: AtomicUsize::new(0),
            last_saved_visits: AtomicUsize::new(0),
            analytics_tx: tx,
            trusted_proxy: false,
        });
        let req = Request::builder()
            .method("HEAD")
            .uri("/")
            .body(Body::empty())
            .unwrap();
        let response = handle_request(
            State(state),
            ConnectInfo("127.0.0.1:1".parse().unwrap()),
            req,
        )
        .await;
        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(response.headers()[header::CONTENT_LENGTH], "2");
    }
}
