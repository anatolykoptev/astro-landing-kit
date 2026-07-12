# astro-landing-kit

Reusable Astro + Svelte 5 landing page kit. Fork of AstroWind (MIT,
copyright onWidget — see LICENSE.md).

## Stack
Astro 7 + Svelte 5 + Tailwind CSS 4 + GSAP + astro-seo

## Dev
npm install && npm run dev

## Structure
- `src/components/widgets/` — Astro section widgets (Hero, Features, Stats, etc.)
- `src/components/islands/` — Svelte interactive components
- `src/components/ui/` — UI primitives (Button, Headline, etc.)
- `src/components/blog/` — Optional blog components
- `src/layouts/` — Page layouts
- `src/adapters/` — Content providers (JSON, Directus, custom)
- `src/forms/` — Form protection (honeypot, CSRF, webhook)
- `src/seo/` — SEO utilities, JSON-LD builder

## Content
Sites provide content via adapters. Default: JSON files in `content/`.

## Widgets = scaffold, not shippable (HARD)

`widgets/*` = fast-prototype shape, fine for MVP/internal/product-register pages. NEVER ship
one as-is on a brand-register page (marketing/landing — design IS the product). Compose bespoke
from `ui/*` primitives instead (WidgetWrapper+Headline+custom markup/CSS) — re-theming colors/
fonts on a stock widget ≠ de-templating; this kit = fork of AstroWind (LICENSE.md), instantly
recognizable generic shape (icon-grid features, numbered steps, basic FAQ/stats/pricing cards)
regardless of palette. Real incident: starthey.com shipped re-themed stock Features/Steps, read
as "2012 design" despite a full OKLCH/Onest token pass — root cause was untouched widget markup,
not the palette; fixed by rewriting bespoke (see that repo's Testimonials/Comparison sections,
merged, for the pattern).

Kit widget type-scale defaults also run big — sanity-check before shipping anywhere, don't trust
blind: `Headline`/`ItemGrid` ship H2~45px, H3~26px, eyebrow~20px uppercase. Typical product-
landing bar: H2 32-36px, H3 18-20px, eyebrow 14-16px — match your OWN hero eyebrow size, don't
let a stock component drift bigger.

## Consumer compatibility

Published on the public npm registry as `astro-landing-kit` (`npm i
astro-landing-kit`) — publish is automated via release-please + npm Trusted
Publishing (OIDC, no stored token) in `.github/workflows/release-please.yml`.
Pre-existing consumers pinned via git (`github:anatolykoptev/astro-landing-kit#semver:^X.Y.Z`
or a raw sha) keep working — the GitHub repo rename auto-redirects — but new
consumers should install from npm.

**v0.3.0+ requires the consumer's own `astro` to be `^7.0.0`**
(peer-required by `@astrojs/svelte@9` / `@astrojs/mdx@7`, pulled in by the
kit's Astro 6→7 bump). A consumer still on Astro 6 must NOT widen its kit
version past `^0.2.x` until it bumps its own `astro` dependency in the same
change — mixing an Astro-6 site with an Astro-7 kit is unsupported and will
fail to build. Bump each consumer's astro version deliberately, one repo at
a time; do not fleet-sweep.
