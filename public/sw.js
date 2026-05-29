// OT Journey — Service Worker
// Caches app shell + assets on install so all 200+ disciples can use the
// app with zero connectivity after first load.

const CACHE_NAME = "nt90-v2";

// App shell files Vite will emit — adjust if your build output differs
const PRECACHE = [
  "/",
  "/index.html",
  // Vite hashes these; the fetch handler below caches them on first request
];

// ── Install: pre-cache the app shell ──────────────────────────────
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
});

// ── Activate: delete old caches ───────────────────────────────────
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for same-origin assets, network-first for API ─
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept Anthropic API calls — they need live network
  if (url.hostname === "api.anthropic.com") return;

  // Never intercept BibleGateway / external links
  if (url.hostname !== self.location.hostname) return;

  // Cache-first strategy for same-origin requests
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        // Cache successful GET responses (JS, CSS, fonts, images, HTML)
        if (request.method === "GET" && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Fallback to index.html for navigation requests (SPA routing)
        if (request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
