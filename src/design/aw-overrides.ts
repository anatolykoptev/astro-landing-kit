/**
 * Generates AstroWind --aw-* CSS overrides from DESIGN.md tokens.
 * Maps design colors to kit's internal CSS custom properties.
 */
import type { DesignTokens } from './parser';

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
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

export function isDarkDesign(tokens: DesignTokens): boolean {
  const nameLower = tokens.name.toLowerCase();
  if (nameLower.includes('dark') || nameLower.includes('night') || nameLower.includes('noir')) return true;
  const lightColors = tokens.colors.filter(c => hexToHsl(c.hex).l > 0.6);
  return lightColors.length <= tokens.colors.length * 0.3;
}

export function generateAwOverrides(tokens: DesignTokens): string {
  if (tokens.colors.length === 0) return '';

  const lines: string[] = [];
  const dark = isDarkDesign(tokens);

  const primary = tokens.colors[0];
  const secondary = tokens.colors[1];

  // For dark designs, pick the darkest color as background
  const darkestColor = [...tokens.colors].sort((a, b) => hexToHsl(a.hex).l - hexToHsl(b.hex).l)[0];
  const bgColor = dark
    ? darkestColor
    : tokens.colors.find(c => /supporting|surface|background/.test(c.role.toLowerCase()));
  const bgDark = bgColor ?? (dark ? darkestColor : null);
  const textLight = tokens.colors.find(c => hexToHsl(c.hex).l > 0.9);
  const textDark = tokens.colors.find(c => /text|foreground/.test(c.role.toLowerCase()) && hexToHsl(c.hex).l < 0.3);

  const pushAccents = (target: string[]) => {
    target.push(`  --aw-color-primary: ${primary.hex};`);
    if (secondary) target.push(`  --aw-color-secondary: ${secondary.hex};`);
    target.push(`  --aw-color-accent: ${secondary?.hex ?? primary.hex};`);
  };

  if (dark) {
    const bg = bgDark?.hex ?? '#0F172A';
    const text = textLight?.hex ?? '#F8FAFC';
    lines.push('');
    lines.push('/* AstroWind overrides from DESIGN.md (dark-first) */');
    for (const selector of [':root', '.dark']) {
      lines.push(`${selector} {`);
      pushAccents(lines);
      lines.push(`  --aw-color-text-heading: ${text};`);
      lines.push(`  --aw-color-text-default: ${text};`);
      lines.push(`  --aw-color-text-muted: ${text}aa;`);
      lines.push(`  --aw-color-bg-page: ${bg};`);
      if (selector === ':root') lines.push(`  --aw-color-bg-page-dark: ${bg};`);
      lines.push('}');
    }
  } else {
    lines.push('');
    lines.push('/* AstroWind overrides from DESIGN.md (light-first) */');
    lines.push(':root {');
    pushAccents(lines);
    if (bgColor) lines.push(`  --aw-color-bg-page: ${bgColor.hex};`);
    if (textDark) {
      lines.push(`  --aw-color-text-heading: ${textDark.hex};`);
      lines.push(`  --aw-color-text-default: ${textDark.hex};`);
    }
    lines.push('}');
  }

  return lines.join('\n');
}
