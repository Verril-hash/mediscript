const CACHE = 'mediscript-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(['/', '/index.html', '/logo.jpeg', '/manifest.json'])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', (e) => {
  // Network-first for API calls, cache-first for static assets
  if (e.request.url.includes('/api/')) {
    return; // let API calls go through normally
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
