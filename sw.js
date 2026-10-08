const CACHE = 'seeti-studio-v14-permanent';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=> self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(()=> self.clients.claim())
  );
});

// For permanent Update App button
self.addEventListener('message', e => {
  if (e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', e => {
  // Skip puter API
  if(e.request.url.includes('puter.com') || e.request.url.includes('cdn.jsdelivr')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request)
        .then(res => {
          // Cache new assets
          if(res.ok && e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)){
            let clone = res.clone();
            caches.open(CACHE).then(c=>c.put(e.request, clone));
          }
          return res;
        })
        .catch(()=> {
          if(e.request.mode === 'navigate') return caches.match('./index.html');
        });
    })
  );
});
