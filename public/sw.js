const CACHE_NAME = 'netpub-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
];

// Installer le Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activer le Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      return self.clients.claim();
    })
  );
});

// Intercepter les requêtes
self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;
  
  // Ignorer les requêtes WebSocket, Chrome extensions, et autres schémas non http(s)
  if (!requestUrl.startsWith('http')) {
    return fetch(event.request);
  }
  
  // Ignorer les requêtes WebSocket
  if (event.request.headers.get('Upgrade') === 'websocket' || 
      requestUrl.startsWith('ws://') || 
      requestUrl.startsWith('wss://')) {
    return;
  }
  
  // Ne pas mettre en cache les requêtes API
  if (requestUrl.includes('/api/') || requestUrl.includes('/graphql') || requestUrl.includes('/csrf-token') || requestUrl.includes('/health')) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la réponse mise en cache si elle existe
        if (response) {
          return response;
        }
        
        // Sinon, effectuer la requête réseau et mettre en cache
        return fetch(event.request)
          .then((response) => {
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cloner la réponse pour la mettre en cache
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache).catch((error) => {
                  console.error('Failed to cache:', error);
                });
              })
              .catch((error) => {
                console.error('Failed to open cache:', error);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            return error;
          });
      })
      .catch((error) => {
        console.error('Cache match failed:', error);
        return fetch(event.request);
      })
  );
});
