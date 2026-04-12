/**
 * Generates Tailwind v4 @theme CSS from parsed DesignTokens.
 */
import type { DesignTokens } from './parser';

function kebab(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function generateThemeCss(tokens: DesignTokens): string {
  const lines: string[] = [];

  lines.push(`/* Generated from DESIGN.md: ${tokens.name} */`);
  lines.push('');
  lines.push('@theme {');

  // Colors
  if (tokens.colors.length > 0) {
    lines.push('  /* Colors */');
    const primary = tokens.colors[0];
    lines.push(`  --color-primary: ${primary.hex};`);
    for (const c of tokens.colors.slice(1)) {
      lines.push(`  --color-${kebab(c.name)}: ${c.hex};`);
    }
    lines.push('');
  }

  // Fonts
  lines.push('  /* Typography */');
  lines.push(`  --font-display: "${tokens.fonts.display}", system-ui, sans-serif;`);
  lines.push(`  --font-body: "${tokens.fonts.body}", system-ui, sans-serif;`);
  lines.push(`  --font-mono: "${tokens.fonts.mono}", ui-monospace, monospace;`);
  lines.push('');

  // Font sizes from scale
  if (Object.keys(tokens.scale).length > 0) {
    lines.push('  /* Scale */');
    for (const [key, value] of Object.entries(tokens.scale)) {
      const cleanValue = value.replace(/\s*\/.*/, ''); // "1rem / 1.6" → "1rem"
      lines.push(`  --text-${key}: ${cleanValue};`);
    }
    lines.push('');
  }

  // Border radius
  lines.push('  /* Shape */');
  lines.push(`  --radius-btn: ${tokens.borderRadius};`);
  lines.push(`  --radius-card: ${tokens.borderRadius === '9999px' ? '1.5rem' : tokens.borderRadius};`);
  lines.push('');

  // Motion
  lines.push('  /* Motion */');
  const duration = tokens.motion.motion >= 7 ? '540ms' : tokens.motion.motion >= 4 ? '300ms' : '150ms';
  lines.push(`  --duration-enter: ${duration};`);
  lines.push(`  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);`);

  lines.push('}');

  return lines.join('\n');
}

/** Generate pm7 CSS custom property overrides from design tokens */
export function generatePm7Overrides(tokens: DesignTokens): string {
  if (tokens.colors.length === 0) return '';

  const lines: string[] = [];
  lines.push('');
  lines.push('/* pm7-ui overrides from DESIGN.md */');
  lines.push(':root {');

  const primary = tokens.colors[0];
  lines.push(`  --pm7-primary: ${primary.hex};`);

  const surface = tokens.colors.find(c => c.role.toLowerCase().includes('surface') || c.role.toLowerCase().includes('background'));
  if (surface) lines.push(`  --pm7-background: ${surface.hex};`);

  const text = tokens.colors.find(c => c.role.toLowerCase().includes('text') || c.role.toLowerCase().includes('foreground'));
  if (text) lines.push(`  --pm7-foreground: ${text.hex};`);

  const muted = tokens.colors.find(c => c.role.toLowerCase().includes('muted') || c.role.toLowerCase().includes('secondary text'));
  if (muted) lines.push(`  --pm7-muted: ${muted.hex};`);

  const border = tokens.colors.find(c => c.role.toLowerCase().includes('border') || c.role.toLowerCase().includes('divider'));
  if (border) lines.push(`  --pm7-border: ${border.hex};`);

  lines.push('}');
  return lines.join('\n');
}

export function generateDarkModeOverrides(tokens: DesignTokens): string {
  if (tokens.colors.length < 2) return '';

  const lines: string[] = [];
  lines.push('');
  lines.push('@variant dark {');
  lines.push('  @theme {');
  // In dark mode, swap surface/text if we detect light/dark roles
  const hasLight = tokens.colors.some(c => c.role.toLowerCase().includes('surface') || c.role.toLowerCase().includes('background'));
  if (hasLight) {
    lines.push('    /* Dark mode overrides — customize per design */');
  }
  lines.push('  }');
  lines.push('}');

  return lines.join('\n');
}
