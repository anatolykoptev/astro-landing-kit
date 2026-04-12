# @krolik/landing-kit — Roadmap

## Vision

AI-first landing page kit. Agent describes what it wants → kit assembles pixel-perfect page from composable layers: visual style, static sections, interactive islands, agent-driven UI, embedded AI chat.

## Architecture Layers

```
Layer 5: AI Chat          assistant-ui (Svelte port) — embedded support/demo chat
Layer 4: Agent UI         A2UI protocol — agent generates rich UI in real-time  
Layer 3: Islands          Svelte 5 — forms, counters, accordion, animations
Layer 2: Static Sections  Astro widgets + pm7-ui — Hero, Features, Pricing, CTA
Layer 1: Visual Style     DESIGN.md from design_search (437 designs indexed)
Layer 0: Foundation       Astro 5, Tailwind CSS 4, GSAP, JSON-LD SEO
```

## Phase 1: Foundation — COMPLETE

**Status:** Done (2026-04-12). 8 commits, repo: `anatolykoptev/landing-kit`.
**Plan:** `~/docs/superpowers/plans/2026-04-12-landing-kit.md`

- [x] Fork AstroWind → `~/src/landing-kit/`
- [x] Content provider abstraction (JSON / Directus / custom)
- [x] Svelte 5 islands (ContactForm, FaqAccordion, StatsCounter)
- [x] Form protection (honeypot + CSRF + webhook)
- [x] Enhanced JSON-LD (Organization, Person, FAQPage, SoftwareApp)
- [x] Tailwind v4 migration, build passing
- [x] Subpath exports for reuse across projects
- [x] GitHub repo created and pushed

**Next:** Migrate memdb-site as first consumer, then hully-site.

## Phase 2: Design System Integration — COMPLETE

**Status:** Done (2026-04-12). 6 files, 371 designs supported.

- [x] DESIGN.md parser → DesignTokens (colors, fonts, scale, shape, motion)
- [x] Tailwind v4 @theme generator from tokens
- [x] CLI: `tsx src/design/apply.ts DESIGN.md [output.css]`
- [x] Astro integration: auto-import DESIGN.md theme via virtual module
- [x] Design search bridge: list/load/search 371 designs
- [x] Smart dark/light mode resolver from color roles
- [ ] Component variant system tied to design tokens (deferred to first migration)

## Phase 3a: pm7-ui Components — COMPLETE

**Status:** Done (2026-04-12).

- [x] Vendor full pm7 CSS + JS into `vendor/pm7/`
- [x] Bridge CSS: DESIGN.md tokens → pm7 custom properties
- [x] Theme generator: pm7 overrides from design tokens
- [x] Component catalog: 16 components, searchComponents()
- [x] Section recipes: 10 pre-composed sections, searchSections()
- [x] Search bridge integration: unified design + component + section search
- [ ] Component variant system tied to design tokens (deferred to first migration)

## Phase 3b: Experience Memory

**Depends on:** Phase 3a + first migrations (memdb-site, hully-site)

- Self-learning from landing page assembly outcomes (go-wowa pattern)
- Experience recording: component+section+design combos accepted/rejected
- Recall: suggest proven combos for new landing pages
- Consolidator: generalize patterns across sites
- Storage: MemDB cubes per domain + `_global` for cross-site patterns
- Confidence: Beta-Bernoulli scoring (same as go-wowa intelligence layer)

## Phase 4: A2UI Agent-Driven Sections

**Depends on:** Phase 1

- Integrate Google A2UI protocol (Apache 2.0)
- Lit-based renderer as Astro island (`<A2UISection client:visible />`)
- Agent backend via CLIProxyAPI (Gemini) generates UI JSON
- Use cases on landing pages:
  - Live product demo section (agent shows features interactively)
  - Dynamic pricing calculator (agent responds to user inputs)
  - Personalized onboarding flow (agent adapts UI to visitor)
- A2UI component catalog = landing-kit's widget set
- Security: declarative JSON only, no code execution

## Phase 5: Embedded AI Chat

**Depends on:** Phase 1, oxpulse-chat integration

- assistant-ui for React-based chat widget (or Svelte port)
- Embed as Astro React island (`<ChatWidget client:idle />`)
- Backends: oxpulse-chat API, AI SDK, custom
- Use cases:
  - Support chat on landing page
  - AI sales assistant
  - Product Q&A with RAG
- Rich responses: markdown, cards, suggestions, tool results
- assistant-ui composable primitives = full customization

## Phase 6: Full AI Landing Pipeline

**Depends on:** All phases

The end goal — fully automated landing page creation:

```
User: "I need a landing page for my AI code review tool,
       dark theme, developer-focused, like Linear"

Agent:
  1. design_search("dark developer tool like Linear") → linear-precision-dark
  2. cp DESIGN.md → auto-generate tailwind theme (Phase 2)
  3. Load content from JSON/CMS (Phase 1)
  4. Assemble page from pm7 + Astro widgets (Phase 3)
  5. Add live demo section via A2UI (Phase 4)
  6. Embed support chat via assistant-ui (Phase 5)
  7. astro build → deploy
```

## References

| Resource | What | License |
|----------|------|---------|
| [design_search](http://127.0.0.1:8897/mcp) | 437 design systems, semantic search | Internal |
| [pm7-ui](https://pm7-ui.com/) | AI-optimized component library | MIT |
| [A2UI](https://a2ui.org/) | Agent-driven UI protocol (Google) | Apache 2.0 |
| [assistant-ui](https://github.com/assistant-ui/assistant-ui) | AI chat components (YC-backed) | MIT |
| [AstroWind](https://github.com/onwidget/astrowind) | Base template (forked) | MIT |
| [DESIGN.md spec](https://stitch.withgoogle.com/docs/design-md/overview/) | Google Stitch format | Open |
