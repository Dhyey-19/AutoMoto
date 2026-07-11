// Dummy Service Worker to satisfy leftover browser cache requests on localhost:3000
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      // Unregister this service worker to clean it up from the browser
      self.registration.unregister();
    })
  );
});

self.addEventListener('fetch', () => {
  // No-op fetch handler to satisfy fetch assertions
});
