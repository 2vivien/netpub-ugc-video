const CACHE_NAME = 'netpub-static-cache-v2';
const MEDIA_CACHE_NAME = 'netpub-media-cache-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/favicon.ico',
];

// Install Event: Cache essential static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME && key !== MEDIA_CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Smart caching strategy
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const isNavigation = event.request.mode === 'navigate';
    const isStaticAsset = url.origin === self.location.origin && 
                         (url.pathname.includes('/assets/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css'));
    const isMedia = event.request.destination === 'image' || 
                    event.request.destination === 'video' ||
                    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|mp4|webm)$/);

    // 1. Navigation (HTML): Network first, fallback to cache
    if (isNavigation) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                    return response;
                })
                .catch(() => caches.match('/index.html') || caches.match(event.request))
        );
        return;
    }

    // 2. Media: Cache first, then network (Performance for images/videos)
    if (isMedia) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                return cached || fetch(event.request).then(response => {
                    if (!response || response.status !== 200) return response;
                    const copy = response.clone();
                    caches.open(MEDIA_CACHE_NAME).then(cache => cache.put(event.request, copy));
                    return response;
                });
            })
        );
        return;
    }

    // 3. Static Assets (JS/CSS): Stale-while-revalidate
    if (isStaticAsset) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                const networked = fetch(event.request).then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                    return response;
                });
                return cached || networked;
            })
        );
        return;
    }
});