/**
 * Generates the DESIGN.md → CSS theme override block.
 *
 * Emits a plain `:root { --aw-color-* }` block — NOT a Tailwind `@theme` block —
 * because it is injected as a runtime inline <style> AFTER CustomStyles.astro
 * (see src/components/DesignTheme.astro + Layout.astro), overriding by cascade
 * order rather than being processed by Tailwind at build time. `--aw-color-*` are
 * the exact custom properties the widgets + tailwind.css read (tailwind.css's
 * `@theme { --color-primary: var(--aw-color-primary) }` and pm7-bridge.css both
 * derive from these), so overriding them re-skins every component.
 */
import type { DesignTokens, ColorToken } from './parser';

export function generateThemeCss(tokens: DesignTokens): string {
  const c = tokens.colors;
  const primary = c[0];
  const lower = (s: string) => s.toLowerCase();
  const byName = (n: string): ColorToken | undefined => c.find((x) => lower(x.name) === n);
  const byRole = (...needles: string[]): ColorToken | undefined =>
    c.find((x) => needles.some((nd) => lower(x.role).includes(nd)));

  // secondary/accent default to primary so a DESIGN.md with only a primary color
  // still fully displaces the CustomStyles teal defaults (e.g. btn-primary hover,
  // which reads --aw-color-secondary) instead of leaking the kit's brand.
  const secondary = byName('secondary') ?? primary;
  const accent = byName('accent') ?? byRole('accent') ?? primary;
  const bg = byRole('surface', 'background');
  const heading = byRole('heading', 'display', 'title');
  const text = c.find((x) => /text|foreground|body/.test(lower(x.role)) && !lower(x.role).includes('muted'));
  const muted = byRole('muted');

  const lines: string[] = [];
  lines.push(`/* Generated from DESIGN.md: ${tokens.name} — overrides CustomStyles.astro --aw-color-* defaults */`);
  lines.push(':root {');
  lines.push(`  --aw-color-primary: ${primary.hex};`);
  lines.push(`  --aw-color-secondary: ${secondary.hex};`);
  lines.push(`  --aw-color-accent: ${accent.hex};`);
  if (bg) lines.push(`  --aw-color-bg-page: ${bg.hex};`);
  if (heading) lines.push(`  --aw-color-text-heading: ${heading.hex};`);
  if (text) lines.push(`  --aw-color-text-default: ${text.hex};`);
  if (muted) lines.push(`  --aw-color-text-muted: ${muted.hex};`);
  lines.push('}');

  return lines.join('\n');
}
