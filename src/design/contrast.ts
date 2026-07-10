/**
 * Minimal WCAG 2.x contrast-ratio + luminance check, hex/rgb only.
 *
 * We deliberately do NOT add a full color-space library to convert oklch/hsl → sRGB
 * (a real dependency, against the kit's "no new dep" / RF-firewall discipline — see
 * src/design/README.md Dependencies). For oklch()/hsl() values this checker returns
 * `null` ("unverifiable"), and callers must treat that as "could not check" — never as
 * "passed" — see theme-generator.ts's contrast warning and README's failure-behavior
 * section.
 */

/** Parses `#rgb`, `#rrggbb`, or `rgb()`/`rgba()` into 0-255 channel values. `null` for
 * any other syntax (oklch/hsl/named colors) — those are intentionally unverifiable. */
export function parseChannels(value: string): [number, number, number] | null {
  const v = value.trim();

  const long = /^#([0-9a-fA-F]{6})$/.exec(v);
  if (long) {
    const h = long[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const short = /^#([0-9a-fA-F]{3})$/.exec(v);
  if (short) {
    const [r, g, b] = short[1].split('');
    return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
  }
  const rgb = /^rgba?\(\s*([\d.]+)\s*,?\s*([\d.]+)\s*,?\s*([\d.]+)/.exec(v);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];

  return null;
}

/** WCAG relative luminance (0 = black, 1 = white) from 0-255 sRGB channels. */
export function relativeLuminance([r, g, b]: [number, number, number]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio (1 = no contrast, 21 = max) between two color values, or `null`
 * when either value isn't in a format this checker can parse (oklch/hsl/named). */
export function contrastRatio(a: string, b: string): number | null {
  const ca = parseChannels(a);
  const cb = parseChannels(b);
  if (!ca || !cb) return null;
  const la = relativeLuminance(ca);
  const lb = relativeLuminance(cb);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG AA minimum contrast ratio for normal-size body text. */
export const WCAG_AA_NORMAL_TEXT = 4.5;
