const CACHE_NAME = '7cajas-v1';
const ASSETS = [
  '/7cajas-web/',
  '/7cajas-web/index.html',
  '/7cajas-web/css/style.css',
  '/7cajas-web/js/main.js',
  '/7cajas-web/images/logo.png',
  '/7cajas-web/images/logo2.png',
  '/7cajas-web/images/logo-seda.png',
  '/7cajas-web/images/logo-lot.png',
  '/7cajas-web/images/slide1.jpg',
  '/7cajas-web/images/slide2.jpg',
  '/7cajas-web/images/slide3.jpg',
  '/7cajas-web/images/slide4.jpg',
  '/7cajas-web/images/mapa-puntos.png',
  '/7cajas-web/images/distribucion1.png',
  '/7cajas-web/images/distribucion2.jpg',
  '/7cajas-web/images/distribucion3.jpg',
  '/7cajas-web/images/distribucion4.jpg'
];

// Install - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
