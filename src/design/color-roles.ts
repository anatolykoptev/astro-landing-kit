/**
 * Single shared color-role classifier for DesignTokens.
 *
 * theme-generator.ts and dark-mode.ts each used to run their OWN, slightly different
 * role-string regexes to answer "which color is THE surface/text color" (review finding
 * MEDIUM: duplicated + divergent classifiers). This is the one place that answers it —
 * both callers consume it instead of re-deriving their own notion of "surface" or "text".
 */
import type { ColorToken } from './parser';

export interface RoleClassification {
  /** All colors classified as a surface/background role, in DESIGN.md order. */
  surfaces: ColorToken[];
  /** All colors classified as a text/foreground role, in DESIGN.md order. */
  texts: ColorToken[];
  heading?: ColorToken;
  muted?: ColorToken;
  /** Color named exactly "Secondary" (case-insensitive). */
  secondary?: ColorToken;
  /** Color named "Accent" or whose role mentions "accent". */
  accent?: ColorToken;
}

const MUTED_RE = /muted/;
const HEADING_RE = /heading|display|title/;
const SURFACE_RE = /surface|background|cream|parchment|light|white|warm/;
const TEXT_RE = /text|foreground|dark|deep|forest|body/;
const ACCENT_RE = /accent/;

/**
 * Classifies each color into at most one of muted / heading / surface / text (priority
 * order, first match wins, mirroring the original per-file heuristics) plus the
 * independent name-based secondary/accent picks. A color can be BOTH e.g. "secondary"
 * (by name) AND "text" (by role) — those two facets don't compete for the same slot.
 */
export function classifyColorRoles(colors: ColorToken[]): RoleClassification {
  const surfaces: ColorToken[] = [];
  const texts: ColorToken[] = [];
  let heading: ColorToken | undefined;
  let muted: ColorToken | undefined;
  let secondary: ColorToken | undefined;
  let accent: ColorToken | undefined;

  for (const c of colors) {
    const role = c.role.toLowerCase();
    const name = c.name.toLowerCase();

    if (!secondary && name === 'secondary') secondary = c;
    if (!accent && (name === 'accent' || ACCENT_RE.test(role))) accent = c;

    if (MUTED_RE.test(role)) {
      muted ??= c;
      continue;
    }
    if (HEADING_RE.test(role)) {
      heading ??= c;
      continue;
    }
    if (SURFACE_RE.test(role)) {
      surfaces.push(c);
      continue;
    }
    if (TEXT_RE.test(role)) {
      texts.push(c);
      continue;
    }
  }

  return { surfaces, texts, heading, muted, secondary, accent };
}
