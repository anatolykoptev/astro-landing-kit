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

// Accepts a hex code or a single-level color function call in bullet and table rows.
const COLOR_VALUE_RE = /^(#[0-9A-Fa-f]{6}|(?:oklch|rgb|rgba|hsl|hsla)\([^()]*\))$/;
const COLOR_LINE_RE =
  /\*\s+\*\*(.+?)\*\*\s+\((#[0-9A-Fa-f]{6}|(?:oklch|rgb|rgba|hsl|hsla)\([^()]*\))\)\s*—\s*(.+)/;

export function parseDesignMd(content: string, sourcePath?: string): DesignTokens {
  const name = parseName(content);
  const motion = parseMotion(content);
  const colors = parseColors(content, sourcePath);
  const typoSection = extractSection(content, '3', ['typography']);
  const { typography, fonts } = parseTypography(typoSection);
  const scale = parseScale(typoSection);
  const borderRadius = parseBorderRadius(extractSection(content, '4', ['components']));

  return { name, colors, typography, scale, motion, borderRadius, fonts };
}

function parseName(content: string): string {
  return (
    content.match(/^#\s+Design System:\s*(.+)/m)?.[1]?.trim() ??
    content.match(/^#\s+(.+)/m)?.[1]?.trim() ??
    'Unknown'
  );
}

function parseMotion(content: string): { density: number; variance: number; motion: number } {
  const density = parseInt(content.match(/Density:\s*(\d+)/)?.[1] ?? '5');
  const variance = parseInt(content.match(/Variance:\s*(\d+)/)?.[1] ?? '5');
  const motion = parseInt(content.match(/Motion:\s*(\d+)/)?.[1] ?? '5');
  return { density, variance, motion };
}

function parseColors(content: string, sourcePath?: string): ColorToken[] {
  const colors: ColorToken[] = [];
  const colorSection = extractSection(content, '2', ['color', 'colors']);
  for (const line of colorSection.split('\n')) {
    const bullet = line.match(COLOR_LINE_RE);
    if (bullet) {
      colors.push({ name: bullet[1], hex: bullet[2], role: bullet[3].trim() });
      continue;
    }
    const cells = parseTableRow(line);
    if (!cells || cells.some((cell) => /^:?-{3,}:?$/.test(cell))) continue;
    const valueIndex = cells.findIndex((cell) => COLOR_VALUE_RE.test(cell));
    if (valueIndex < 0) continue;
    const name = cells[valueIndex === 0 ? 1 : 0];
    const role = cells.filter((_, index) => index !== valueIndex && index !== (valueIndex === 0 ? 1 : 0)).join(' — ');
    if (name && role) colors.push({ name, hex: cells[valueIndex], role });
  }

  if (colors.length === 0) {
    throw new Error(
      `parseDesignMd: no colors found in ${sourcePath ?? 'DESIGN.md'} — expected a ` +
        '"## 2. Colors"/"## Color" section with bullets like "* **Name** (#RRGGBB) — role" ' +
        'or a markdown table with name, value, and purpose columns.',
    );
  }
  return colors;
}

function parseTypography(section: string): {
  typography: TypographyToken[];
  fonts: { display: string; body: string; mono: string };
} {
  const typography: TypographyToken[] = [];
  let displayFont = 'Inter';
  let bodyFont = 'Inter';
  let monoFont = 'JetBrains Mono';

  for (const line of section.split('\n')) {
    const match = line.match(/\*\s+\*\*(.+?)\*\*\s+(.+)/);
    if (!match) continue;
    const role = match[1];
    const rest = match[2];
    const font = rest.match(/^([A-Za-z\s]+)\s*—/)?.[1]?.trim() ?? 'Inter';
    const weight = parseInt(rest.match(WEIGHT_RE)?.[1] ?? '400');
    typography.push({ role, font, weight, details: rest });

    if (role.includes('Display') || role.includes('Hero')) displayFont = font;
    else if (role.includes('Body')) bodyFont = font;
    else if (role.includes('Monospace') || role.includes('Mono')) monoFont = font;
  }
  return { typography, fonts: { display: displayFont, body: bodyFont, mono: monoFont } };
}

function parseScale(section: string): Record<string, string> {
  const scale: Record<string, string> = {};
  const scaleLines = section.match(/\*\s+(Hero|H1|H2|Body|Small):\s*(.+)/g) ?? [];
  for (const line of scaleLines) {
    const m = line.match(/\*\s+(\w+):\s*(.+)/);
    if (m) scale[m[1].toLowerCase()] = m[2].trim();
  }
  return scale;
}

function parseBorderRadius(compSection: string): string {
  if (compSection.includes('9999px') || compSection.includes('Pill')) return '9999px';
  if (compSection.includes('Sharp') || compSection.includes('0px')) return '0px';
  return '0.75rem';
}

function extractSection(content: string, num: string, names: string[] = []): string {
  const lines = content.split('\n');
  const numbered = new RegExp(`^##\\s+${num}\\\\?\\.\\s+`, 'i');
  const named = new RegExp(`^##\\s+(?:${names.map((name) => `${name}s?`).join('|')})\\s*$`, 'i');
  const start = lines.findIndex((line) => numbered.test(line) || (names.length > 0 && named.test(line)));
  if (start < 0) return '';
  const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line));
  return lines.slice(start + 1, end < 0 ? undefined : end).join('\n');
}

function parseTableRow(line: string): string[] | null {
  if (!line.trim().startsWith('|')) return null;
  const cells = line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim().replace(/^`|`$/g, ''));
  return cells.length >= 3 ? cells : null;
}
