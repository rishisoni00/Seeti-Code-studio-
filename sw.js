const CACHE='seeti-dev-v6-3-final';
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.json']))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.map(x=>{ if(x!==CACHE) return caches.delete(x); }))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
