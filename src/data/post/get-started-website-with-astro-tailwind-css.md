---
publishDate: 2025-01-15T00:00:00Z
title: Get started with astro-landing-kit
excerpt: Build a landing page from JSON in minutes — no hand-rolled markup, no copy-paste from tutorials.
category: tutorials
tags: [astro, landing-kit, json]
author: astro-landing-kit
---

## What is astro-landing-kit?

A reusable Astro + Svelte 5 landing page kit. You write JSON, the kit renders
the page from a widget registry. No hand-rolled markup, no copy-paste from
tutorials.

## Quick start

```bash
npm i astro-landing-kit
```

Create a `landing.json`:

```json
{
  "sections": [
    { "type": "hero", "props": { "title": "Hello world" } },
    { "type": "features", "props": { "items": [...] } }
  ]
}
```

Render it:

```astro
---
import { RenderSections } from 'astro-landing-kit/compose';
import landing from './landing.json';
---
<RenderSections sections={landing.sections} />
```

That's it. The widget registry maps `"hero"` → `Hero.astro`, `"features"` →
`Features.astro`, etc. You can register your own widgets too.
