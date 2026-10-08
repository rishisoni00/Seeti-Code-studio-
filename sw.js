const CACHE='seeti-v16-lite';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.json','./icon.svg'])));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{if(e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('cdn.jsdelivr')) return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(res.ok && e.request.url.startsWith(self.location.origin)){
      caches.open(CACHE).then(c=>c.put(e.request,res.clone()));
    }
    return res;
  }).catch(()=> e.request.mode==='navigate'?caches.match('./index.html'):undefined)));
});
