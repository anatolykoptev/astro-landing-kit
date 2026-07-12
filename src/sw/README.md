# sw

Versioned service-worker integration for a landing site, modeled on
oxpulse-chat's production SW pattern (install/activate/cache-invalidation
core, stripped of push notifications and per-room reload exceptions — a
landing page has no live session state to protect).

## What

- `astro:config:setup`: injects a tiny `page`-stage registration snippet
  (`navigator.serviceWorker.register('/sw.js')`), guarded by
  `import.meta.env.PROD` — a no-op in `astro dev`.
- `astro:build:done`: writes `sw.js` into the build output root, with the
  cache name stamped at build time as `<prefix>-<buildId>` — `buildId`
  defaults to the consumer repo's short git SHA (or an ISO timestamp when
  git isn't resolvable). No manual version bump, ever.
- The generated `sw.js`: `install` calls `self.skipWaiting()` for instant
  activation; `activate` deletes every cache key that isn't the current
  build's, claims clients, then calls `client.navigate(client.url)` on
  every open window client to force it onto the fresh deploy; `fetch` is
  network-first for navigations (cache fallback offline), cache-first for
  same-origin `/_astro/` hashed assets, and a pass-through (no
  `respondWith`) for everything else — cross-origin requests (widget
  embeds, APIs) are never intercepted.

## Adopt

```ts
// astro.config.ts
import serviceWorkerIntegration from 'astro-landing-kit/sw';

export default defineConfig({
  integrations: [serviceWorkerIntegration()],
});
```

Options: `cachePrefix` (default `'lk'`), `buildId` (override — mainly for
reproducible test/CI builds).

## Caveat: reload-on-activate

Every open tab gets `client.navigate()`'d on activate — the deploy takes
effect immediately, no stale tab lingers on an old bundle. **This is
correct for a landing page and wrong for an app with client-side session
state** (a live call, an in-progress form, unsaved editor state): the
oxpulse-chat SW deliberately does NOT auto-`skipWaiting` or unconditionally
force-navigate for exactly that reason — it shows an in-app "reload"
banner instead and exempts live-session routes from the force-navigate.
Do not lift this integration onto a project with that shape of state
without re-adding those guards.
