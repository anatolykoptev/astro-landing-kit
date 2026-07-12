/**
 * Generates the DESIGN.md → CSS theme override block.
 *
 * Emits a plain `:root { --aw-color-* }` block — NOT a Tailwind `@theme` block —
 * because it is injected as a runtime inline <style> (wrapped in the
 * `landing-kit-design-theme` cascade layer — see integration.ts) rather than being
 * processed by Tailwind at build time. `--aw-color-*` are the exact custom properties
 * the widgets + tailwind.css read (tailwind.css's `@theme { --color-primary:
 * var(--aw-color-primary) }` derives from these), so overriding them re-skins every
 * component.
 */
import type { DesignTokens, ColorToken } from './parser';
import { classifyColorRoles } from './color-roles';
import {
  contrastRatio,
  contrastRatioFromLuminances,
  relativeLuminance,
  parseChannels,
  WCAG_AA_NORMAL_TEXT,
  DEFAULT_BG_PAGE_LUMINANCE_ESTIMATE,
  DEFAULT_BG_PAGE_LABEL,
} from './contrast';

const DARK_ENOUGH_LUMINANCE = 0.2;

export function generateThemeCss(tokens: DesignTokens): string {
  const colors = tokens.colors;
  const roles = classifyColorRoles(colors);
  const named = (...names: string[]) =>
    colors.find((color) => names.includes(color.name.toLowerCase().replace(/^--/, '')));
  const primary = roles.primary ?? roles.accent ?? colors[0];

  // secondary/accent default to primary so a DESIGN.md with only a primary color
  // still fully displaces the CustomStyles teal defaults (e.g. btn-primary hover,
  // which reads --aw-color-secondary) instead of leaking the kit's brand.
  const secondary = roles.secondary ?? named('primary-strong', 'accent-strong') ?? primary;
  const accent = roles.accent ?? primary;
  const surface = roles.surfaces[0];
  const text = roles.texts[0];
  const onPrimary = named('on-primary', 'on-accent');
  const border = named('border', 'hairline', 'divider');
  const card = named('card', 'panel', 'surface');

  // CRITICAL fix: --aw-color-bg-page and --aw-color-text-default used to be two
  // UNCOUPLED optional overrides. A DESIGN.md naming only a dark Surface (no
  // text/foreground/body bullet) set bg-page dark while text-default stayed at its
  // near-black default → ~1.07:1 contrast → invisible body text sitewide. bg-page is
  // now only overridden when a text-role color is ALSO present to pair with it
  // (mirrors generateSmartDarkMode's `surfaces.length === 0 || texts.length === 0`
  // gate).
  const pairSurfaceAndText = !!(surface && text);

  // MAJOR-1 fix: the REVERSE case was still open — a lone text-role color (no paired
  // Surface) was emitted unconditionally, with no check against what it will actually
  // render on: the kit's own default bg-page. A dark-first DESIGN.md naming a LIGHT
  // body-text color, whose Surface bullet uses an off-whitelist role word the
  // classifier drops, silently produced light-on-light invisible body text. Compute the
  // one check up front and reuse it below.
  const contrast = checkThemeContrast(tokens);

  const lines: string[] = [];
  lines.push(`/* Generated from DESIGN.md: ${tokens.name} — overrides CustomStyles.astro --aw-color-* defaults */`);
  lines.push(':root {');
  lines.push(`  --aw-color-primary: ${primary.hex};`);
  lines.push(`  --aw-color-secondary: ${secondary.hex};`);
  lines.push(`  --aw-color-accent: ${accent.hex};`);
  if (onPrimary) lines.push(`  --aw-color-on-primary: ${onPrimary.hex};`);
  if (border) {
    lines.push(`  --aw-color-border: ${border.hex};`);
    lines.push(`  --aw-color-hairline: ${border.hex};`);
  }
  if (card) lines.push(`  --aw-color-bg-card: ${card.hex};`);

  if (pairSurfaceAndText) {
    lines.push(`  --aw-color-bg-page: ${surface.hex};`);
    lines.push(`  --aw-color-text-default: ${text.hex};`);
    // Heading follows body text when DESIGN.md doesn't name one explicitly — otherwise
    // the default (dark) heading color would stay invisible against a new dark bg too.
    lines.push(`  --aw-color-text-heading: ${(roles.heading ?? text).hex};`);
  } else {
    if (text) {
      // Fail-safe, mirroring the bg-page gate above: only apply a lone text-default
      // override when it's verified to meet WCAG AA against the default bg-page.
      // Skip (keep the kit's own known-safe default near-black text) when it would be
      // low-contrast OR unverifiable (oklch/hsl) — integration.ts's WCAG warning
      // (checkThemeContrast) explains why, never silent.
      const loneTextIsSafe = contrast?.meetsAA === true;
      if (loneTextIsSafe) lines.push(`  --aw-color-text-default: ${text.hex};`);
    }
    if (roles.heading) lines.push(`  --aw-color-text-heading: ${roles.heading.hex};`);
  }
  if (roles.muted) lines.push(`  --aw-color-text-muted: ${roles.muted.hex};`);

  // HIGH-4 fix: --aw-color-bg-page-dark was never emitted, so a branded consumer got
  // rebranded buttons/text but stock-navy dark chrome (footer/header/mobile menu —
  // tailwind.css .bg-dark). Prefer an explicit dark-role token; else derive from the
  // darkest classifiable (hex/rgb) color, but only if it's actually dark enough to
  // serve as a dark-mode surface (avoids picking a light gray as a fake "dark" bg).
  const bgDark = pickExplicitDarkSurface(colors) ?? pickDarkestClassifiable(colors);
  if (bgDark) lines.push(`  --aw-color-bg-page-dark: ${bgDark.hex};`);

  lines.push('}');

  return lines.join('\n');
}

/**
 * FOLD-IN fix: the explicit-dark-role pick used to trust the "dark" name/role substring
 * alone, with NO luminance check — a `**Charcoal** (#333) — dark accent for borders`
 * bullet could hijack the ENTIRE site's dark-mode chrome even though its role is a
 * border decoration, not a background. Now requires the same ≤0.2 luminance gate
 * `pickDarkestClassifiable` already enforces; an unverifiable (oklch/hsl) "dark"-named
 * color is not trusted on the label alone and falls through to the derived pick instead.
 */
function pickExplicitDarkSurface(colors: ColorToken[]): ColorToken | undefined {
  const candidates = colors.filter(
    (c) => /\bdark\b/.test(c.role.toLowerCase()) || /\bdark\b/.test(c.name.toLowerCase())
  );
  for (const c of candidates) {
    const channels = parseChannels(c.hex);
    if (!channels) continue;
    if (relativeLuminance(channels) <= DARK_ENOUGH_LUMINANCE) return c;
  }
  return undefined;
}

function pickDarkestClassifiable(colors: ColorToken[]): ColorToken | undefined {
  let best: { token: ColorToken; lum: number } | undefined;
  for (const c of colors) {
    const channels = parseChannels(c.hex);
    if (!channels) continue;
    const lum = relativeLuminance(channels);
    if (lum > DARK_ENOUGH_LUMINANCE) continue;
    if (!best || lum < best.lum) best = { token: c, lum };
  }
  return best?.token;
}

export interface ContrastCheck {
  /** WCAG contrast ratio, or `null` when the pair uses a non-hex/rgb value this
   * lightweight checker can't verify (oklch/hsl) — NOT the same as "passed". */
  ratio: number | null;
  bg: string;
  text: string;
  meetsAA: boolean;
  /** `true` when `bg` is the kit's own default bg-page ESTIMATE (see
   * DEFAULT_BG_PAGE_LABEL) rather than an explicit DESIGN.md Surface color — i.e. this
   * check is for a LONE text override (MAJOR-1), not a paired surface+text override. */
  againstDefaultBg: boolean;
}

/**
 * A build-time WCAG check for whatever surface/text override `generateThemeCss` is about
 * to apply:
 * - Surface AND text both present → checks the two DESIGN.md values against each other
 *   (the CRITICAL-fix paired case).
 * - Text only, no Surface (MAJOR-1) → checks the lone text value against the kit's own
 *   default bg-page (an estimate — see DEFAULT_BG_PAGE_LUMINANCE_ESTIMATE), since that
 *   is what it will actually render on.
 * - Otherwise (no text at all, or Surface-only which is already gated off and never
 *   applied) → `null`, nothing new to check.
 *
 * Callers (integration.ts, generateThemeCss) warn when `meetsAA` is false, and
 * separately note when `ratio` is `null` (unverifiable, never treated as a pass).
 */
export function checkThemeContrast(tokens: DesignTokens): ContrastCheck | null {
  const roles = classifyColorRoles(tokens.colors);
  const surface = roles.surfaces[0];
  const text = roles.texts[0];

  if (surface && text) {
    const ratio = contrastRatio(surface.hex, text.hex);
    return {
      ratio,
      bg: surface.hex,
      text: text.hex,
      meetsAA: ratio !== null && ratio >= WCAG_AA_NORMAL_TEXT,
      againstDefaultBg: false,
    };
  }

  if (!surface && text) {
    const channels = parseChannels(text.hex);
    if (!channels) {
      return { ratio: null, bg: DEFAULT_BG_PAGE_LABEL, text: text.hex, meetsAA: false, againstDefaultBg: true };
    }
    const ratio = contrastRatioFromLuminances(relativeLuminance(channels), DEFAULT_BG_PAGE_LUMINANCE_ESTIMATE);
    return {
      ratio,
      bg: DEFAULT_BG_PAGE_LABEL,
      text: text.hex,
      meetsAA: ratio >= WCAG_AA_NORMAL_TEXT,
      againstDefaultBg: true,
    };
  }

  return null;
}
