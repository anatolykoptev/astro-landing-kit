import { describe, it, expect } from 'vitest';
import { parseDesignMd } from './parser';

const HEADER = '# Design System: Ocean\n\n';

function withColorsSection(bullets: string): string {
  return `${HEADER}## 2. Colors\n\n${bullets}\n`;
}

describe('parseDesignMd — color value formats', () => {
  it('accepts hex, oklch, rgb, and hsl values in the same "* **Name** (VALUE) — role" bullet', () => {
    const md = withColorsSection(
      [
        '* **Primary** (#3B82F6) — Primary brand color',
        '* **Surface** (oklch(96% 0.01 90)) — Background surface',
        '* **Accent** (rgb(255, 99, 71)) — Accent highlights',
        '* **Muted** (hsl(210, 20%, 40%)) — Muted secondary text',
      ].join('\n'),
    );

    const tokens = parseDesignMd(md);

    expect(tokens.colors).toEqual([
      { name: 'Primary', hex: '#3B82F6', role: 'Primary brand color' },
      { name: 'Surface', hex: 'oklch(96% 0.01 90)', role: 'Background surface' },
      { name: 'Accent', hex: 'rgb(255, 99, 71)', role: 'Accent highlights' },
      { name: 'Muted', hex: 'hsl(210, 20%, 40%)', role: 'Muted secondary text' },
    ]);
  });
});

describe('parseDesignMd — markdown color tables', () => {
  it('accepts an unnumbered Color section with role, value, and use columns', () => {
    const md = `${HEADER}## Color\n\n| Role | OKLCH | Use |\n|---|---|---|\n| \`--bg\` | \`oklch(0.984 0.006 60)\` | Warm page surface |\n| \`--ink\` | \`oklch(0.24 0.012 50)\` | Primary body text |\n| \`--accent\` | \`#C4512D\` | Primary brand accent |\n`;

    const tokens = parseDesignMd(md);

    expect(tokens.colors).toEqual([
      { name: '--bg', hex: 'oklch(0.984 0.006 60)', role: 'Warm page surface' },
      { name: '--ink', hex: 'oklch(0.24 0.012 50)', role: 'Primary body text' },
      { name: '--accent', hex: '#C4512D', role: 'Primary brand accent' },
    ]);
  });

  it('keeps the document title as the design name when no Design System prefix is present', () => {
    const md = '# Starthey design\n\n## Colors\n\n| Token | Value | Purpose |\n|---|---|---|\n| Primary | #C4512D | Primary brand color |\n';

    expect(parseDesignMd(md).name).toBe('Starthey design');
  });
});

describe('parseDesignMd — zero-colors must fail loudly, not silently produce nothing', () => {
  it('throws naming the source file and the expected bullet format when no colors parse', () => {
    const md = `${HEADER}## 2. Colors\n\nSome prose describing colors, but no bullet list here.\n`;

    expect(() => parseDesignMd(md, '/tmp/some-project/DESIGN.md')).toThrow(/some-project\/DESIGN\.md/);
    expect(() => parseDesignMd(md, '/tmp/some-project/DESIGN.md')).toThrow(/\*\*Name\*\*/);
  });

  it('still throws a descriptive error without a source path', () => {
    const md = `${HEADER}## 2. Colors\n\nno bullets\n`;

    expect(() => parseDesignMd(md)).toThrow(Error);
    expect(() => parseDesignMd(md)).toThrow(/\*\*Name\*\*/);
  });

  it('does not throw when at least one color bullet parses', () => {
    const md = withColorsSection('* **Primary** (#3B82F6) — Primary brand color');

    expect(() => parseDesignMd(md)).not.toThrow();
  });
});
