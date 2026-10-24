/**
 * KKK Wheel Care - Service Worker (Version 2)
 * Mobile caching & PWA support with Network-First strategy
 * Stale caches from previous versions are automatically purged.
 */

const CACHE_NAME = 'kkk-wheel-care-v2';
const STATIC_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

// Sensitive endpoints containing private PII or credentials that MUST bypass cache
const SENSITIVE_API_PATTERNS = [
  '/api/customers',
  '/api/customers/login',
  '/api/customers/register',
  '/api/bookings',
  '/api/payment'
];

// Install Event - Pre-cache application shell & take control immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW v2] Pre-caching application shell.');
      return cache.addAll(STATIC_SHELL_ASSETS);
    })
  );
});

// Activate Event - Clean up ALL stale cache versions immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => {
          console.log('[SW v2] Deleting stale cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network-First Strategy for Fresh Content
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // 1. Never cache non-GET requests (POST, PUT, DELETE, PATCH)
  if (event.request.method !== 'GET') {
    return;
  }

  // 2. Strict Security: Never cache endpoints containing private PII or transactions
  const isSensitive = SENSITIVE_API_PATTERNS.some((pattern) => requestUrl.pathname.includes(pattern));
  if (isSensitive) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 3. Network-First strategy for all assets & API: always deliver fresh updates from server
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
