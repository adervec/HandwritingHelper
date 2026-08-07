/* Handwriting Helper service worker — offline-first app shell.
   ponytail: no build step here, so bump VERSION by hand when index.html changes;
   the changed file content is what tells the browser a new version exists. */
const VERSION = "10";
const CACHE = "hwh-cache-" + VERSION;
const SHELL = ["./", "./guide.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-512-maskable.png", "./apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()) // never fail the install over one missing asset
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("hwh-cache-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return; // leave Google APIs and the OCR CDN alone

  if (req.mode === "navigate") {
    // network-first for the app document: freshest app when online, cached shell when offline
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put("./", copy)).catch(() => {}); return res; })
        .catch(() => caches.match("./").then((h) => h || caches.match(req)))
    );
    return;
  }

  // cache-first for same-origin static assets (icons, manifest, …)
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      }
      return res;
    }))
  );
});
