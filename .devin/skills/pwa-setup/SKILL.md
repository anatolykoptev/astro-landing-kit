---
name: pwa-setup
description: Configure PWA (installable app) in an astro-landing-kit consumer repo — wire the kit's service-worker integration, generate brand icons from the consumer's favicon, and emit a web app manifest that passes Chrome/Lighthouse installability criteria. Triggers: "add PWA", "make it installable", "service worker", "manifest", "offline support", "добавь PWA", "установочное приложение".
---

# pwa-setup

Make an astro-landing-kit consumer site installable as a PWA. The kit already ships the moving parts (`src/sw/integration.ts`, `scripts/generate-pwa-icons.mjs`) — this skill wires them into the consumer's config and generates brand-specific assets.

## Prerequisites (verify before starting)

1. Consumer repo has `astro-landing-kit` installed (`npm i astro-landing-kit` or git-pinned).
2. Consumer has a favicon SVG at a known path (usually `src/assets/favicons/favicon.svg` or `public/favicon.svg`).
3. Consumer's `astro.config.ts` imports from `astro-landing-kit`.

If any are missing, stop and ask the operator.

## Procedure

### 1. Generate PWA icons from the consumer's favicon

The kit ships `scripts/generate-pwa-icons.mjs` — but it reads from the kit's own `src/assets/favicons/favicon.svg`. For a consumer, run a one-shot sharp script against the consumer's favicon:

```bash
node -e "
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const svg = readFileSync('<CONSUMER_FAVICON_SVG>');
const bg = '<BRAND_BG_HEX>';
// 192 + 512 standard (transparent bg)
await sharp(svg, { density: 384 }).resize(192, 192, { fit: 'contain' }).png().toFile('public/icons/icon-192.png');
await sharp(svg, { density: 384 }).resize(512, 512, { fit: 'contain' }).png().toFile('public/icons/icon-512.png');
// Maskable: full-bleed bg, icon in 80% safe zone
const icon512 = await sharp(svg, { density: 384 }).resize(410, 410, { fit: 'contain' }).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: bg } }).composite([{ input: icon512, gravity: 'center' }]).png().toFile('public/icons/icon-maskable-512.png');
const icon192 = await sharp(svg, { density: 384 }).resize(154, 154, { fit: 'contain' }).png().toBuffer();
await sharp({ create: { width: 192, height: 192, channels: 4, background: bg } }).composite([{ input: icon192, gravity: 'center' }]).png().toFile('public/icons/icon-maskable-192.png');
console.log('PWA icons generated');
"
```

Replace `<CONSUMER_FAVICON_SVG>` and `<BRAND_BG_HEX>` (use the consumer's `--aw-color-bg-page` or the darkest brand color).

Verify: `file public/icons/*.png` should show 4 PNGs at correct dimensions.

### 2. Create `public/manifest.webmanifest`

Use the consumer's brand values, NOT the kit's defaults:

```json
{
  "name": "<Consumer full name>",
  "short_name": "<≤12 chars>",
  "description": "<Consumer tagline>",
  "id": "/?source=pwa",
  "start_url": "/?source=pwa",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "<BRAND_BG_HEX>",
  "theme_color": "<BRAND_THEME_COLOR_HEX>",
  "categories": ["<relevant categories>"],
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 3. Wire the service worker integration in `astro.config.ts`

```ts
import serviceWorkerIntegration from 'astro-landing-kit/sw';
// or from local path if running inside the kit repo itself:
// import serviceWorkerIntegration from './src/sw/integration';

export default defineConfig({
  integrations: [
    // ...existing integrations...
    serviceWorkerIntegration(),
  ],
});
```

Place it BEFORE `compress()` if used — compress must run last to minify the generated `sw.js`.

### 4. Add manifest link + theme-color to the layout's `<head>`

If the consumer uses the kit's `Favicons.astro` (v0.5.3+), it already includes the manifest link and theme-color meta. Just pass the brand color:

```astro
<Favicons maskIconColor="#<BRAND>" themeColor="#<BRAND>" />
```

If NOT using the kit's Favicons, add manually in `<head>`:

```html
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#<BRAND_THEME_COLOR>" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### 5. Verify

```bash
npm run build
```

Check build output contains:
- `Wrote sw.js (cache lk-<sha>)` — SW generated
- `dist/manifest.webmanifest` exists
- `dist/icons/*.png` — 4 icons
- `dist/sw.js` exists

Then verify on the deployed site:
- `curl -sI https://<domain>/manifest.webmanifest` → 200
- `curl -sI https://<domain>/sw.js` → 200, content-type `text/javascript`
- `curl -s https://<domain>/ | grep 'rel="manifest"'` → present
- `curl -s https://<domain>/ | grep 'name="theme-color"'` → present

## Lighthouse installability checklist (all must pass)

| Requirement | How to verify |
|---|---|
| Manifest with name/short_name | `curl -s /manifest.webmanifest \| jq .name` |
| Icons 192x192 + 512x512 | `jq '.icons[].sizes' manifest.webmanifest` |
| start_url | `jq .start_url manifest.webmanifest` |
| display: standalone/fullscreen/minimal-ui | `jq .display manifest.webmanifest` |
| SW with fetch handler | `curl -s /sw.js \| grep addEventListener.*fetch` |
| HTTPS | Caddy/Cloudflare handles this |
| prefer_related_applications ≠ true | must be absent or `false` |

## Maskable icon rules (Android adaptive icons)

- Safe zone: center 80% of the canvas (circle inscribed in 80% of total area)
- Full-bleed background — NO transparent borders on maskable icons
- `purpose: "maskable"` as a SEPARATE icon entry, not `"any maskable"` on one file (web.dev best practice — `"any maskable"` adds padding on non-masked display)
- Test at https://maskable.app/editor

## Boundaries (what this skill must NOT do)

- Do NOT use `@vite-pwa/astro` — it duplicates the kit's SW and adds Workbox (~200kb). The kit's `src/sw/integration.ts` is the canonical SW.
- Do NOT put `"purpose": "any maskable"` on a single icon — use separate entries.
- Do NOT skip maskable icons — without them Android shows the icon on a white background.
- Do NOT hardcode the kit's brand colors (`#0d9488`, `#1a1813`) in a consumer manifest — use the consumer's brand tokens.
- Do NOT place `serviceWorkerIntegration()` after `compress()` in the integrations array — compress must run last to minify `sw.js`.
- Do NOT register the SW in `astro dev` — the integration already guards with `import.meta.env.PROD`.
