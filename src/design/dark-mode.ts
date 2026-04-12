/**
 * Smart dark/light mode resolver — generates CSS overrides from DesignTokens color roles.
 */
import type { DesignTokens, ColorToken } from './parser';

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

function isLightColor(hex: string): boolean {
  return hexToHsl(hex).l > 0.6;
}

function isDarkDesign(tokens: DesignTokens): boolean {
  const nameLower = tokens.name.toLowerCase();
  if (nameLower.includes('dark') || nameLower.includes('night') || nameLower.includes('noir')) return true;
  const lightColors = tokens.colors.filter(c => isLightColor(c.hex));
  return lightColors.length <= tokens.colors.length * 0.3;
}

export function generateSmartDarkMode(tokens: DesignTokens): string {
  if (tokens.colors.length < 2) return '';

  const lines: string[] = [''];
  const dark = isDarkDesign(tokens);

  // Classify colors by role
  const surfaces: ColorToken[] = [];
  const texts: ColorToken[] = [];

  for (const c of tokens.colors) {
    const role = c.role.toLowerCase();
    if (/surface|background|cream|parchment|light|white|warm/.test(role)) surfaces.push(c);
    else if (/text|foreground|dark|deep|forest|body/.test(role)) texts.push(c);
  }

  if (surfaces.length === 0 && texts.length === 0) {
    lines.push('/* No surface/text role colors detected — add dark mode manually */');
    return lines.join('\n');
  }

  const variant = dark ? 'light' : 'dark';
  lines.push(`@variant ${variant} {`);
  lines.push('  @theme {');

  if (surfaces.length > 0 && texts.length > 0) {
    lines.push(`    /* Swap: surfaces ↔ texts for ${variant} mode */`);
    lines.push(`    --color-surface: ${texts[0].hex};`);
    lines.push(`    --color-text: ${surfaces[0].hex};`);
  } else if (surfaces.length > 0) {
    lines.push(`    /* Only surface colors detected — dark text fallback */`);
    lines.push(`    --color-surface: #0f0f0f;`);
    lines.push(`    --color-text: ${surfaces[0].hex};`);
  } else {
    lines.push(`    /* Only text colors detected — light surface fallback */`);
    lines.push(`    --color-surface: ${texts[0].hex};`);
    lines.push(`    --color-text: #f5f5f5;`);
  }

  // Keep primary accent — usually works in both modes
  lines.push('  }');
  lines.push('}');

  return lines.join('\n');
}
