self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open('cp-deluxe-v1').then(c => c.addAll([
    './',
    './index.html',
    './manifest.webmanifest',
    './assets/icon-192.png',
    './assets/icon-512.png'
  ])));
});
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open('cp-deluxe-v1').then(c => c.put(e.request, copy));
      return r;
    }).catch(()=>caches.match('./')))
  );
});
