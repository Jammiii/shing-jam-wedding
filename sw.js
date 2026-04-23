const CACHE_NAME = 'wedding-rsvp-sj';

const urlsToCache = [
  '/', // IMPORTANT (your start_url)

  // main files
  '/frontend/index.html',
  '/frontend/styles.css',
  '/frontend/script.js',

  // images (adjust if needed)
  '/frontend/images/ONE.jpg',
  '/frontend/images/icon-192.png',
  '/frontend/images/icon-512.png'
];

// INSTALL - cache files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// ACTIVATE - remove old cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cache) {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// FETCH - cache first, then network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});