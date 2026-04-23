const CACHE_NAME = 'easybudget-v1';
const ASSETS = ['/'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Ne pas intercepter les requêtes Supabase
  if (e.request.url.includes('supabase.co') || e.request.url.includes('anthropic')) {
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Mettre en cache la réponse fraîche
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
