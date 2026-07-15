---
publishDate: 2026-07-14
title: 'PWA without @vite-pwa: a hand-rolled service worker for Astro'
excerpt: 'Why the kit ships its own service worker integration instead of depending on @vite-pwa — and what the hand-rolled SW actually does.'
category: 'Engineering'
tags: ['pwa', 'service-worker', 'astro']
author: 'Anatoly Koptev'
---

The kit ships a service worker integration (`src/sw/integration.ts`) that generates and registers a SW at build time. No `@vite-pwa` dependency, no Workbox abstraction. Here's why and how.

## Why not @vite-pwa

`@vite-pwa` is a good plugin. It handles the common cases well. But for a landing page kit, it adds complexity that doesn't pay off:

- **Workbox abstraction**: Workbox is powerful but opaque. When something goes wrong — a stale cache, a missing route — you're debugging Workbox, not your SW.
- **Config surface**: `@vite-pwa` exposes ~30 config options. The kit needs exactly two behaviors: cache-first for hashed assets, network-first for navigations.
- **Dependency weight**: `@vite-pwa` + Workbox is ~200KB of node_modules. The kit's SW template is 80 lines of vanilla JS.

For a consumer who needs full PWA features (background sync, periodic sync, push notifications), `@vite-pwa` is the right choice. For a landing page that needs offline navigations and fast cached assets, a hand-rolled SW is simpler and more transparent.

## What the kit's SW does

The generated `sw.js` has three behaviors:

### 1. Install + activate: drop old caches

```js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['/']))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});
```

Every build gets a fresh cache name (`lk-<commit-sha>`). On activate, every cache that isn't the current build's is deleted. A version bump is a full cache invalidation — no stale entry survives a deploy.

### 2. Navigations: network-first with cache fallback

```js
if (request.mode === 'navigate') {
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached ?? caches.match('/')))
  );
}
```

When online, navigations hit the network and cache the response. When offline, they fall back to the cached page, or to the cached `/` as a last resort.

### 3. Same-origin assets: cache-first

```js
if (request.url.startsWith(self.location.origin)) {
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
}
```

Hashed assets (`/_astro/*.js`, `/_astro/*.css`) never change — the hash is in the filename. Cache-first with a background refill is safe and skips the network entirely on a warm cache.

## Auto-reload on deploy

The SW calls `self.skipWaiting()` on install and `clients.claim()` on activate. Any open tab reloads when a new SW takes over. This is intentional for a landing page: there's no per-tab session to lose, so unlike a web app, a silent reload is safe and ensures the user always sees the latest version.

## The integration

```ts
import { serviceWorkerIntegration } from 'astro-landing-kit/sw';

export default defineConfig({
  integrations: [
    serviceWorkerIntegration(),
  ],
});
```

The integration generates `sw.js` with the current build's cache name, adds it to the build output, and injects a registration script into the HTML. No config options — the two behaviors are the whole API.
