import { describe, it, expect } from 'vitest';
import { parseChannels, relativeLuminance, contrastRatio, WCAG_AA_NORMAL_TEXT } from './contrast';

describe('parseChannels', () => {
  it('parses 6-digit and 3-digit hex', () => {
    expect(parseChannels('#7C3AED')).toEqual([124, 58, 237]);
    expect(parseChannels('#fff')).toEqual([255, 255, 255]);
  });

  it('parses rgb()/rgba()', () => {
    expect(parseChannels('rgb(16, 185, 129)')).toEqual([16, 185, 129]);
    expect(parseChannels('rgba(16 185 129 / 50%)')).toEqual([16, 185, 129]);
  });

  it('returns null for oklch/hsl and other unsupported syntax', () => {
    expect(parseChannels('oklch(0.55 0.24 305)')).toBeNull();
    expect(parseChannels('hsl(210, 20%, 40%)')).toBeNull();
    expect(parseChannels('lavender')).toBeNull();
  });
});

describe('relativeLuminance', () => {
  it('white is 1, black is 0 (WCAG reference values)', () => {
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 5);
    expect(relativeLuminance([0, 0, 0])).toBeCloseTo(0, 5);
  });
});

describe('contrastRatio', () => {
  it('black on white is 21:1 (WCAG max)', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
  });

  it('is order-independent (bg vs text or text vs bg gives the same ratio)', () => {
    const a = contrastRatio('#101010', '#FFFDF5');
    const b = contrastRatio('#FFFDF5', '#101010');
    expect(a).toBe(b);
  });

  it('a near-identical gray pair is well below WCAG AA', () => {
    const ratio = contrastRatio('#777777', '#888888');
    expect(ratio).not.toBeNull();
    expect(ratio!).toBeLessThan(WCAG_AA_NORMAL_TEXT);
  });

  it('returns null when either value is non-hex/rgb', () => {
    expect(contrastRatio('oklch(0.2 0 0)', '#FFFFFF')).toBeNull();
    expect(contrastRatio('#000000', 'hsl(0, 0%, 100%)')).toBeNull();
  });
});
