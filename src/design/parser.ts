/**
 * DESIGN.md parser — extracts design tokens from markdown.
 * Format: awesome-design-md (371 styles, Google Stitch-inspired).
 */

export interface DesignTokens {
  name: string;
  colors: ColorToken[];
  typography: TypographyToken[];
  scale: Record<string, string>;
  motion: { density: number; variance: number; motion: number };
  borderRadius: string;
  fonts: { display: string; body: string; mono: string };
}

export interface ColorToken {
  name: string;
  hex: string;
  role: string;
}

export interface TypographyToken {
  role: string;
  font: string;
  weight: number;
  details: string;
}

const WEIGHT_RE = /Weight\s+(\d+)/;

export function parseDesignMd(content: string): DesignTokens {
  const name = content.match(/^#\s+Design System:\s*(.+)/m)?.[1]?.trim() ?? 'Unknown';

  const density = parseInt(content.match(/Density:\s*(\d+)/)?.[1] ?? '5');
  const variance = parseInt(content.match(/Variance:\s*(\d+)/)?.[1] ?? '5');
  const motionVal = parseInt(content.match(/Motion:\s*(\d+)/)?.[1] ?? '5');

  const colors: ColorToken[] = [];
  const colorSection = extractSection(content, '2');
  for (const line of colorSection.split('\n')) {
    const match = line.match(/\*\s+\*\*(.+?)\*\*\s+\((#[0-9A-Fa-f]{6})\)\s*—\s*(.+)/);
    if (match) {
      colors.push({ name: match[1], hex: match[2], role: match[3].trim() });
    }
  }

  const typography: TypographyToken[] = [];
  let displayFont = 'Inter';
  let bodyFont = 'Inter';
  let monoFont = 'JetBrains Mono';

  const typoSection = extractSection(content, '3');
  for (const line of typoSection.split('\n')) {
    const match = line.match(/\*\s+\*\*(.+?)\*\*\s+(.+)/);
    if (match) {
      const role = match[1];
      const rest = match[2];
      const font = rest.match(/^([A-Za-z\s]+)\s*—/)?.[1]?.trim() ?? 'Inter';
      const weight = parseInt(rest.match(WEIGHT_RE)?.[1] ?? '400');
      typography.push({ role, font, weight, details: rest });

      if (role.includes('Display') || role.includes('Hero')) displayFont = font;
      else if (role.includes('Body')) bodyFont = font;
      else if (role.includes('Monospace') || role.includes('Mono')) monoFont = font;
    }
  }

  const scale: Record<string, string> = {};
  const scaleLines = typoSection.match(/\*\s+(Hero|H1|H2|Body|Small):\s*(.+)/g) ?? [];
  for (const line of scaleLines) {
    const m = line.match(/\*\s+(\w+):\s*(.+)/);
    if (m) scale[m[1].toLowerCase()] = m[2].trim();
  }

  const compSection = extractSection(content, '4');
  let borderRadius = '0.75rem';
  if (compSection.includes('9999px') || compSection.includes('Pill')) {
    borderRadius = '9999px';
  } else if (compSection.includes('Sharp') || compSection.includes('0px')) {
    borderRadius = '0px';
  }

  return {
    name,
    colors,
    typography,
    scale,
    motion: { density, variance, motion: motionVal },
    borderRadius,
    fonts: { display: displayFont, body: bodyFont, mono: monoFont },
  };
}

function extractSection(content: string, num: string): string {
  // Handle both "## 2." and "## 2\." (escaped dot in markdown)
  const re = new RegExp(`## ${num}\\\\?\\.\\s+.+?\\n([\\s\\S]*?)(?=## \\d|$)`);
  return re.exec(content)?.[1] ?? '';
}
