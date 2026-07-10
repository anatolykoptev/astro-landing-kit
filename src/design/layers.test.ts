import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// HIGH-1 / HIGH-2 regression coverage: there is no browser/cascade test harness in this
// repo (vitest + node environment only — see CLAUDE.md / package.json), so this verifies
// the SOURCE-level contract the cascade-layer fix depends on: the three --aw-color-*
// sources are each wrapped in their named layer, and the priority-declaring statement
// lists them lowest-to-highest in the order theme-layers.css's doc comment promises, in
// Astro SOURCE order (not the built <head> emission order — that depends on Vite's own
// bundling, which this suite does not control or verify).
//
// MAJOR-2: this is a NECESSARY but not SUFFICIENT proof. CustomStyles.astro vs
// DesignTheme.astro (same Layout.astro document, same build) is reliably order-safe by
// construction — that 2-way relationship is what these tests + the CSS Cascading Level 5
// spec (cited in theme-layers.css) together establish. The 3-way relationship involving a
// consumer's OWN separately-imported theme.css is NOT something a source-index check (or
// the spec alone) can prove — see src/design/README.md "Precedence" for the honest
// version of that claim, and the real adversarial build referenced there.

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (rel: string) => fs.readFileSync(path.join(here, rel), 'utf-8');

describe('cascade-layer precedence for --aw-color-*', () => {
  it('theme-layers.css declares the 3-tier priority order lowest-to-highest', () => {
    const css = read('theme-layers.css');
    const match = /@layer\s+([\w.,\s-]+);/.exec(css);
    expect(match).not.toBeNull();

    const names = match![1].split(',').map((s) => s.trim());
    expect(names).toEqual(['landing-kit-defaults', 'landing-kit-theme-starter', 'landing-kit-design-theme']);
  });

  it('Layout.astro imports theme-layers.css before any other stylesheet', () => {
    const layout = read('../layouts/Layout.astro');
    const layerImportIdx = layout.indexOf("import '~/design/theme-layers.css'");
    const tailwindImportIdx = layout.indexOf("import '~/assets/styles/tailwind.css'");

    expect(layerImportIdx).toBeGreaterThanOrEqual(0);
    expect(tailwindImportIdx).toBeGreaterThan(layerImportIdx);
  });

  it('CustomStyles.astro wraps its defaults in the landing-kit-defaults layer', () => {
    const custom = read('../components/CustomStyles.astro');
    expect(custom).toContain('@layer landing-kit-defaults {');
    expect(custom).toContain('--aw-color-primary: rgb(16 185 129);');
  });

  it('theme.css wraps its starter palette in the landing-kit-theme-starter layer', () => {
    const themeCss = read('../assets/styles/theme.css');
    expect(themeCss).toContain('@layer landing-kit-theme-starter {');
  });

  it('DESIGN_THEME_LAYER constant matches the highest-priority name declared in theme-layers.css', async () => {
    const { DESIGN_THEME_LAYER } = await import('./integration');
    const css = read('theme-layers.css');
    const match = /@layer\s+([\w.,\s-]+);/.exec(css)!;
    const names = match[1].split(',').map((s) => s.trim());

    expect(DESIGN_THEME_LAYER).toBe(names[names.length - 1]);
  });
});

describe('HIGH-3: .btn-primary:hover gives feedback even when --aw-color-secondary equals primary', () => {
  it('tailwind.css applies a filter on hover that does not depend on secondary differing from primary', () => {
    const css = read('../assets/styles/tailwind.css');
    const hoverBlock = /\.btn-primary:hover\s*\{([^}]*)\}/.exec(css);

    expect(hoverBlock).not.toBeNull();
    // Still swaps to --aw-color-secondary when it DOES differ...
    expect(hoverBlock![1]).toContain('--aw-color-secondary');
    // ...but also applies a rendered-pixel-level treatment that gives feedback even when
    // secondary === primary (theme-generator.ts's `secondary ?? primary` fallback).
    expect(hoverBlock![1]).toMatch(/filter\s*:/);
  });
});
