/* SharingNE service worker — installazione, uso offline, ricezione file condivisi */
const CACHE = 'sharingne-v3';
const ASSETS = [
  './', './index.html', './manifest.json',
  './qrcode-generator.min.js', './pako.min.js', './jsQR.min.js',
  './icon-192.png', './icon-512.png',
  './apple-touch-icon.png', './favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== 'shared-files').map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Web Share Target (Windows/Android): riceve i file condivisi da altre app
  if (e.request.method === 'POST' && url.pathname.endsWith('/share-target')) {
    e.respondWith((async () => {
      try {
        const form = await e.request.formData();
        const files = form.getAll('files');
        const cache = await caches.open('shared-files');
        for (const k of await cache.keys()) await cache.delete(k);
        const meta = [];
        let i = 0;
        for (const f of files) {
          if (!(f instanceof File)) continue;
          const key = 'shared/' + i;
          await cache.put(new Request(key), new Response(f, {
            headers: { 'Content-Type': f.type || 'application/octet-stream' }
          }));
          meta.push({ key, name: f.name, size: f.size, type: f.type });
          i++;
        }
        await cache.put(new Request('shared/meta'), new Response(JSON.stringify(meta), {
          headers: { 'Content-Type': 'application/json' }
        }));
      } catch (err) { /* ignora: apriamo comunque l'app */ }
      return Response.redirect('./?shared=1', 303);
    })());
    return;
  }

  // App shell: cache-first per le GET dello stesso dominio
  if (e.request.method === 'GET' && url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
        if (resp && resp.ok && resp.type === 'basic') {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return resp;
      }).catch(() => caches.match('./index.html')))
    );
  }
});
