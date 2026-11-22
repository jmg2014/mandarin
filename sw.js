// Offline support: keeps a copy of the whole app on the device.
// When online, every file is fetched fresh (so new and old files never get mixed after an update),
// and the saved copy is refreshed. When offline, the saved copy is used.
// When you add a file, add it to FILES and change the number in CACHE.
// The maths app and lengua can live on the same address and share the browser's offline storage, so this file only ever
// deletes its own old copies (names starting with "mandarin-tw-").
const PREFIX = "mandarin-tw-";
const CACHE = PREFIX + "v2";
const FILES = [
  "./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
  "./shared/style.css", "./shared/progress.js", "./shared/engine.js", "./shared/zh.js", "./shared/words.js", "./shared/topic.js",
  "./tones/", "./tones/index.html", "./tones/skills.js",
  "./numbers/", "./numbers/index.html", "./numbers/skills.js",
  "./words/", "./words/index.html", "./words/skills.js",
  "./phrases/", "./phrases/index.html", "./phrases/skills.js",
  "./sentences/", "./sentences/index.html", "./sentences/skills.js",
  "./dialogues/", "./dialogues/index.html", "./dialogues/skills.js",
  "./tests/voices.html"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache:"reload" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache:"no-cache" })
      .then(res => {
        if (res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch:true }))
  );
});
