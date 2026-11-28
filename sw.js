const CACHE = 'mundialito-v33';
const PRECACHE = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png', './flyer-inicio.jpg', './flyer-premios.jpg', './flyer-puntuacion.jpg', './flyer-sede.png', './flyer-sorteo.png'];
self.addEventListener('install', e => {
  // NO se llama skipWaiting solo: la página avisa y recién ahí se activa la versión nueva.
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(PRECACHE.map(u => c.add(u).catch(() => {})))));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  if (/\.mp4$/i.test(u.pathname) || r.headers.has('range')) return;   // video: lo maneja el navegador (rangos)            // datos del torneo (servidor): nunca desde caché
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match(r)));
});
