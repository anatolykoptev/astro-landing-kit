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
// FOLD-IN fix: decoration-purpose words are checked BEFORE surface/text so a role like
// "dark accent for borders" or "warm border accent" doesn't get miscategorized as body
// text / a background color merely because it also contains "dark"/"warm" — those
// substrings are legitimate surface/text signals ONLY when the color isn't ALSO a
// border/highlight/divider/shadow decoration. Tested AFTER heading (a heading role can
// legitimately say "font accent" without being a decoration — "accent" alone is not a
// decoration keyword here) and independently of the accent/secondary picks below (a
// decoration color can still become the `accent` pick via ACCENT_RE/name match).
const DECORATION_RE = /border|highlight|divider|shadow/;
// Widened per review: paper/canvas/base/page/panel are common awesome-design-md surface
// descriptors that were previously dropped, silently failing to apply a themed background.
const SURFACE_RE = /surface|background|cream|parchment|light|white|warm|paper|canvas|base|page|panel/;
const TEXT_RE = /text|foreground|dark|deep|forest|body/;
const ACCENT_RE = /accent/;

/**
 * Classifies each color into at most one of muted / heading / decoration(dropped) /
 * surface / text (priority order, first match wins, mirroring the original per-file
 * heuristics) plus the independent name-based secondary/accent picks. A color can be
 * BOTH e.g. "secondary" (by name) AND "text" (by role) — those two facets don't compete
 * for the same slot.
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
    if (DECORATION_RE.test(role)) {
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
