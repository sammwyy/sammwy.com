(() => {
  if (!window.fetch || !window.DOMParser || !history.pushState) return;

  const cache = new Map();
  const SKIP = /^\/(api|assets|sfx|_astro)\/|\.[a-z0-9]{2,5}$/i;

  const internal = (a) => {
    if (!a || a.target || a.hasAttribute("download") || a.dataset.native !== undefined) return null;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || SKIP.test(url.pathname)) return null;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return null;
    return url;
  };

  const get = (url) => {
    const key = url.pathname + url.search;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.t < 15000) return hit.p;
    const p = fetch(key, { headers: { "X-Nav": "1" } }).then((r) => {
      if (!r.ok && r.status !== 404) throw new Error(String(r.status));
      return r.text();
    });
    cache.set(key, { t: Date.now(), p });
    p.catch(() => cache.delete(key));
    return p;
  };

  const syncStyles = (doc) => {
    const want = [...doc.head.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href);
    const have = [...document.head.querySelectorAll('link[rel="stylesheet"]')];
    const loads = want
      .filter((href) => !have.some((l) => l.href === href))
      .map((href) => new Promise((done) => {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = href;
        l.onload = l.onerror = done;
        document.head.appendChild(l);
      }));
    return Promise.all(loads).then(() => have.forEach((l) => !want.includes(l.href) && l.remove()));
  };

  const runScripts = (root) => {
    root.querySelectorAll("script").forEach((old) => {
      const s = document.createElement("script");
      for (const { name, value } of old.attributes) s.setAttribute(name, value);
      if (old.src) s.async = false;
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  };

  const swap = (doc) => {
    document.title = doc.title;
    for (const sel of ['meta[name="description"]', 'link[rel="canonical"]']) {
      const from = doc.head.querySelector(sel);
      const to = document.head.querySelector(sel);
      if (from && to) to.replaceWith(from.cloneNode(true));
    }
    document.body.className = doc.body.className;
    document.body.replaceChildren(...doc.body.childNodes);
    runScripts(document.body);
  };

  const scrollTo = (url, y) => {
    const el = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (el) el.scrollIntoView();
    else window.scrollTo(0, y || 0);
  };

  let busy = 0;

  const go = async (url, { push = true, y = 0, sound = "open" } = {}) => {
    const id = ++busy;
    document.documentElement.classList.add("nav-loading");
    try {
      const html = await get(url);
      if (id !== busy) return;
      const doc = new DOMParser().parseFromString(html, "text/html");
      await syncStyles(doc);
      if (push) {
        history.replaceState({ ...(history.state || {}), y: window.scrollY }, "");
        history.pushState({ y: 0 }, "", url.pathname + url.search + url.hash);
      }
      const apply = () => {
        if (window.sfx) window.sfx.quiet(600);
        swap(doc);
        scrollTo(url, y);
      };
      if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        await document.startViewTransition(apply).updateCallbackDone;
      } else apply();
      if (window.sfx) window.sfx.play(sound, 0.8);
    } catch {
      location.href = url.href;
    } finally {
      if (id === busy) document.documentElement.classList.remove("nav-loading");
    }
  };

  addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest("a[href]");
    const url = internal(a);
    if (!url) return;
    e.preventDefault();
    go(url);
  });

  addEventListener("pointerover", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    const url = internal(a);
    if (url) get(url).catch(() => {});
  }, { passive: true });

  addEventListener("popstate", (e) => go(new URL(location.href), { push: false, y: (e.state && e.state.y) || 0, sound: "close" }));

  history.scrollRestoration = "manual";
  history.replaceState({ ...(history.state || {}), y: window.scrollY }, "");
})();
