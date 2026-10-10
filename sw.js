/* Service worker de Cuotas Compartidas
 * Permite abrir la app sin internet y que cargue rápido.
 * - La página y firebase-config.js: primero internet (para recibir cambios), si no hay, la copia guardada.
 * - Íconos, manifiesto, Firebase y tipografías: la copia guardada, y se actualiza en segundo plano.
 * - Las conexiones a la base de datos (Firestore, inicio de sesión) nunca pasan por aquí.
 * Cambia VERSION cuando subas una versión nueva de este archivo.
 */
const VERSION = 'cuotas-v2';
const SHELL = [
  './',
  './index.html',
  './firebase-config.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    // Uno por uno: si falta un archivo (por ejemplo, firebase-config.js) el resto se guarda igual
    await Promise.all(SHELL.map(url => cache.add(new Request(url, { cache: 'reload' })).catch(() => {})));
    // Firebase se guarda la primera vez que la página lo usa (solo si tienes firebase-config.js)
  })());
  // La versión nueva se activa de inmediato (la página se recarga sola una vez)
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

const sameOrigin = url => url.origin === self.location.origin;
const isStatic = url =>
  (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) ||
  url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(VERSION);
  try {
    // Siempre pregunta a GitHub si hay una versión nueva, sin usar la copia vieja que guarda el navegador
    let response = await fetch(request.url, { cache: 'no-cache', credentials: 'same-origin' });
    if (response.redirected) {
      response = new Response(await response.blob(), { status: response.status, statusText: response.statusText, headers: response.headers });
    }
    if (response && response.ok) cache.put(request.url, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request, { ignoreSearch: true }) || (fallbackUrl && await cache.match(fallbackUrl));
    if (cached) return cached;
    throw err;
  }
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(VERSION);
  const cached = await cache.match(request);
  const update = fetch(request).then(response => {
    if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  if (cached) { event.waitUntil(update); return cached; }
  const fresh = await update;
  if (fresh) return fresh;
  return Response.error();
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (sameOrigin(url)) {
    if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
    if (request.mode === 'navigate') { event.respondWith(networkFirst(request, './index.html')); return; }
    if (url.pathname.endsWith('/firebase-config.js') || url.pathname.endsWith('/index.html')) { event.respondWith(networkFirst(request)); return; }
    event.respondWith(staleWhileRevalidate(request, event));
    return;
  }
  if (isStatic(url)) { event.respondWith(staleWhileRevalidate(request, event)); return; }
  // Todo lo demás (Firestore, inicio de sesión de Google/Firebase) va directo a internet
});
