const CACHE_NAME = "lilly-lux-lashes-v2";
const APP_SHELL = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/assets/app-icon.svg",
  "/assets/app-icon-180.png",
  "/assets/app-icon-192.png",
  "/assets/app-icon-512.png",
  "/assets/lash-artist.jpg",
  "/assets/lash-look-soft.png",
  "/assets/lash-look-textured.png",
  "/assets/lash-look-bold.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.pathname.startsWith("/api/") || requestUrl.hostname.includes("stripe.com")) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse =>
      cachedResponse || fetch(event.request)
    )
  );
});
