/**
 * Smart dark-mode resolver — generates a `.dark { --aw-color-* }` override from
 * DesignTokens color roles. Emitted alongside generateThemeCss()'s :root block and
 * injected after CustomStyles.astro, so it overrides the kit's own `.dark` defaults.
 */
import type { DesignTokens } from './parser';
import { classifyColorRoles } from './color-roles';

/**
 * Parse a `#rgb` / `#rrggbb` hex into HSL. Returns `null` for any NON-hex value
 * (oklch/rgb/hsl function syntax, accepted since the parser's #12 tolerance change).
 *
 * The pre-#12 code assumed `#rrggbb` and ran `parseInt(value.slice(1,3), 16)` on an
 * `oklch(...)` string → `NaN` → every downstream light/dark comparison silently went
 * false, misclassifying the design. Callers MUST treat `null` as "lightness unknown"
 * and exclude it from the classification rather than letting it poison a comparison.
 */
function hexToHsl(value: string): { h: number; s: number; l: number } | null {
  const m = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.exec(value.trim());
  if (!m) return null;
  let hex = m[1];
  if (hex.length === 3)
    hex = hex
      .split('')
      .map((ch) => ch + ch)
      .join('');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

/** `true` = light, `false` = dark, `null` = unknown (non-hex value we can't classify
 * without a color library, which we deliberately don't add — see the RF-firewall /
 * no-new-dep constraint). */
function isLightColor(value: string): boolean | null {
  const hsl = hexToHsl(value);
  return hsl === null ? null : hsl.l > 0.6;
}

function isDarkDesign(tokens: DesignTokens): boolean {
  const nameLower = tokens.name.toLowerCase();
  if (/dark|night|noir/.test(nameLower)) return true;
  // Reason only over colors we can classify; non-hex values are ignored, never
  // silently counted as dark (which is what the NaN bug used to do).
  const classifiable = tokens.colors.map((c) => isLightColor(c.hex)).filter((v): v is boolean => v !== null);
  if (classifiable.length === 0) return false;
  const lightCount = classifiable.filter(Boolean).length;
  return lightCount <= classifiable.length * 0.3;
}

export function generateSmartDarkMode(tokens: DesignTokens): string {
  if (tokens.colors.length < 2) return '';

  // MEDIUM fix: surface/text classification now comes from the ONE shared classifier
  // (color-roles.ts) instead of a second, slightly divergent regex set kept in sync by
  // hand with theme-generator.ts's.
  const { surfaces, texts } = classifyColorRoles(tokens.colors);

  if (surfaces.length === 0 || texts.length === 0) {
    return '/* Auto dark mode skipped — DESIGN.md needs both a surface-role and a text-role color to swap; override .dark manually */';
  }

  // Swap surface ↔ text for dark mode. The swap uses the raw token VALUES verbatim,
  // so it is safe for hex and non-hex (oklch/rgb/hsl) alike — only the classification
  // heuristic below needs hex, and it degrades gracefully when it can't classify.
  const reads = isDarkDesign(tokens) ? 'dark' : 'light';
  const lines: string[] = [];
  lines.push(`/* Auto dark mode — swap surface ↔ text (design reads as ${reads}) */`);
  lines.push('.dark {');
  lines.push(`  --aw-color-bg-page: ${texts[0].hex};`);
  lines.push(`  --aw-color-text-default: ${surfaces[0].hex};`);
  lines.push(`  --aw-color-text-heading: ${surfaces[0].hex};`);
  lines.push('}');

  return lines.join('\n');
}
