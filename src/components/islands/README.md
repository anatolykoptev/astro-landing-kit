# islands

Svelte 5 interactive components hydrated client-side.

## What

Three Svelte 5 components for interactivity that can't be done server-side: contact form submission, animated stat counters, and FAQ accordion.

## When to use

- `ContactForm.svelte` — any form with server-side submission endpoint
- `StatsCounter.svelte` — animated number counts (GSAP-powered)
- `FaqAccordion.svelte` — FAQ accordion with JS transitions

## API

```svelte
<!-- ContactForm.svelte -->
<ContactForm endpoint="/api/contact" successMessage="Sent!" />

<!-- StatsCounter.svelte -->
<StatsCounter items={[{ number: '1M+', description: 'Users' }]} />

<!-- FaqAccordion.svelte -->
<FaqAccordion items={[{ question: 'Q?', answer: 'A.' }]} />
```

## Example

```astro
---
import ContactForm from '@krolik/landing-kit/islands/ContactForm';
---
<ContactForm client:load endpoint="/api/contact" />
```

## Dependencies

- `gsap` — StatsCounter animation
- No internal landing-kit imports

## Status

stable
