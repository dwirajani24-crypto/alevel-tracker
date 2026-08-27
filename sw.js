/* =========================================================================
   Service Worker — A-Level Topic Tracker
   Caches the app shell so it opens offline once it's been visited once
   (e.g. after being installed via "Add to Home Screen"). Progress data
   itself lives in localStorage on the device, not in this cache.
   ========================================================================= */

// Bump this version string whenever you change index.html/manifest/icons
// so returning visitors pick up the new files instead of a stale cache.
const CACHE_VERSION = 'alevel-tracker-v1';

const APP_SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
];

// --- Install: pre-cache the app shell -------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL_FILES))
  );
  self.skipWaiting();
});

// --- Activate: clean up any old cache versions ----------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// --- Fetch: cache-first for app-shell files, network-first fallback ------
self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests; let everything else (e.g. the
  // Tailwind CDN script, Google Fonts) pass straight through to the network.
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (!isSameOrigin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Cache a copy of newly-fetched same-origin files for next time.
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          // Offline and not cached: fall back to the cached app shell page
          // for navigations so the app still opens.
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
