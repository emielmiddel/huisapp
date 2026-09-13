// Minimale service worker — vooral nodig zodat browsers de app installeerbaar vinden.
// De app werkt online (Supabase + Google), dus we cachen bewust niets uitgebreids.
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => { self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  // Gewoon doorgeven aan het netwerk, geen offline-cache.
});
