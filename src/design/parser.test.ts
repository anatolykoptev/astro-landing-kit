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
