self.addEventListener('install', (event) => {
  console.log('[SW] Installeret');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Aktiveret');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
