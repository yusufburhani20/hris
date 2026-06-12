const CACHE_NAME = 'hris-pwa-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/images/icon-192.png',
    '/images/icon-512.png',
    '/favicon.ico',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    
    // Ignore internal Laravel dev tools, Inertia reload, hot updates, API routes, or admin calculations
    if (
        url.pathname.startsWith('/_') || 
        url.pathname.startsWith('/api') || 
        url.pathname.startsWith('/sanctum') || 
        url.pathname.startsWith('/telescope') ||
        url.pathname.includes('/payrolls/') ||
        url.pathname.includes('/attendances/')
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Cache static assets (CSS, JS, images, fonts) to speed up loading
                const isStaticAsset = (
                    event.request.destination === 'style' ||
                    event.request.destination === 'script' ||
                    event.request.destination === 'image' ||
                    event.request.destination === 'font'
                );

                if (isStaticAsset) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }

                return response;
            })
            .catch(() => {
                // Fallback to cache if request fails (e.g. offline)
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // If page request fails offline, fallback to root path
                    if (event.request.mode === 'navigate') {
                        return caches.match('/');
                    }
                });
            })
    );
});
