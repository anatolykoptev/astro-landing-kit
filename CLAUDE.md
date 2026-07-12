# @krolik/landing-kit

Reusable Astro + Svelte 5 landing page kit. Fork of AstroWind.

## Stack
Astro 6 + Svelte 5 + Tailwind CSS 4 + GSAP + astro-seo

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
