# widgets

Full-width section components for marketing pages.

## What

20 composable Astro components covering the standard landing-page sections. Each wraps `ui/WidgetWrapper` for consistent padding, background variants, and id anchors.

## When to use

- Assembling a landing page from JSON-driven sections
- Embedding a single section (e.g. `FAQs`) into an existing page
- Any section that spans the full viewport width

## API

All widgets accept typed props matching `~/types`. Key components:

| Component | Props type | Description |
|---|---|---|
| `Hero.astro` / `Hero2.astro` | `Hero` | Above-the-fold hero with image + CTA |
| `HeroText.astro` | `Hero` | Text-only hero variant |
| `Features.astro` / `Features2.astro` / `Features3.astro` | `Features` | Icon grid features |
| `FAQs.astro` | `FAQs` | Accordion-ready FAQ list |
| `Stats.astro` | `Stats` | Animated counters widget |
| `Steps.astro` / `Steps2.astro` | `Steps` | Numbered step list |
| `CallToAction.astro` | `CallToAction` | CTA band |
| `Contact.astro` | `Contact` | Contact form wrapper |
| `Pricing.astro` | `Pricing` | Pricing table |
| `Testimonials.astro` | `Testimonials` | Testimonial cards |
| `Brands.astro` | `Brands` | Logo strip |
| `Content.astro` | `Content` | Rich text + media section |
| `Header.astro` / `Footer.astro` | nav config | Site chrome |
| `Announcement.astro` | — | Top-of-page banner |
| `Note.astro` | — | Inline callout |
| `BlogLatestPosts.astro` / `BlogHighlightedPosts.astro` | `Widget` | Blog entry points |

## Example

```astro
---
import Hero from '@krolik/landing-kit/widgets/Hero';
import FAQs from '@krolik/landing-kit/widgets/FAQs';
---
<Hero title="Build faster" tagline="Ship landing pages in minutes" />
<FAQs items={faqItems} />
```

## Dependencies

- `ui` — WidgetWrapper, Headline, Button, ItemGrid, Timeline, Form
- `blog` — Grid (for blog widgets)
- `utils/permalinks`, `utils/blog` — for blog widgets

## Status

stable
