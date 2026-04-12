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

## Phase 2: Design System Integration

**Depends on:** Phase 1 complete, `design_search` tool (done)

- DESIGN.md → Tailwind theme generator (parse colors/fonts/spacing → tailwind.config.ts)
- `astro add design-md` integration command
- design_search MCP tool as project bootstrap: describe UI → pick design → auto-configure theme
- Dark/light mode from DESIGN.md palette
- Component variant system tied to design tokens

## Phase 3: pm7-ui Components

**Depends on:** Phase 2

- Evaluate pm7-ui (`@pm7/core`) as base component layer
- pm7 is framework-agnostic (pure CSS classes: `pm7-button`, `pm7-card`)
- Works with Astro, Svelte, plain HTML — no React dependency
- Replace/complement AstroWind widgets where pm7 components are better
- AI-optimized: simple class names, copy-paste ready, self-healing
- Map DESIGN.md tokens → pm7 CSS custom properties

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
