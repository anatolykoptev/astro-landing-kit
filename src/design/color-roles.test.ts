import { describe, it, expect } from 'vitest';
import { classifyColorRoles } from './color-roles';
import type { ColorToken } from './parser';

function token(name: string, hex: string, role: string): ColorToken {
  return { name, hex, role };
}

describe('classifyColorRoles — MEDIUM: the one shared classifier used by theme-generator + dark-mode', () => {
  it('buckets surface and text roles, in DESIGN.md order', () => {
    const colors = [
      token('Primary', '#7C3AED', 'Primary brand color'),
      token('Night', '#0B0B12', 'Surface background'),
      token('Paper', '#F5F0E8', 'Body text foreground'),
    ];

    const roles = classifyColorRoles(colors);

    expect(roles.surfaces.map((c) => c.name)).toEqual(['Night']);
    expect(roles.texts.map((c) => c.name)).toEqual(['Paper']);
  });

  it('recognizes the wider surface keyword set (cream/parchment/light/white/warm)', () => {
    const colors = [
      token('Cream', '#FFF8E7', 'Cream page background'),
      token('Parchment', '#F1E6D0', 'Parchment card surface'),
    ];
    const roles = classifyColorRoles(colors);
    expect(roles.surfaces).toHaveLength(2);
  });

  it('recognizes the wider text keyword set (dark/deep/forest/body) without colliding with surface', () => {
    const colors = [token('Forest', '#1B3A2B', 'Deep body text')];
    const roles = classifyColorRoles(colors);
    expect(roles.texts.map((c) => c.name)).toEqual(['Forest']);
  });

  it('a role naming both "surface" and "dark" classifies as surface (surface tested first)', () => {
    // e.g. "Dark surface background" — SURFACE_RE matches before TEXT_RE, matching the
    // original dark-mode.ts if/else-if priority this classifier replaces.
    const colors = [token('Night', '#0B0B12', 'Dark surface background')];
    const roles = classifyColorRoles(colors);
    expect(roles.surfaces.map((c) => c.name)).toEqual(['Night']);
    expect(roles.texts).toHaveLength(0);
  });

  it('excludes a muted-role color from the texts bucket', () => {
    const colors = [token('Ink', '#1E1B2E', 'Body text foreground'), token('Gray', '#6B7280', 'Muted secondary text')];
    const roles = classifyColorRoles(colors);
    expect(roles.texts.map((c) => c.name)).toEqual(['Ink']);
    expect(roles.muted?.name).toBe('Gray');
  });

  it('routes a heading/display/title role independently of surface/text', () => {
    const colors = [token('Titan', '#111111', 'Display heading font accent')];
    const roles = classifyColorRoles(colors);
    expect(roles.heading?.name).toBe('Titan');
    expect(roles.surfaces).toHaveLength(0);
    expect(roles.texts).toHaveLength(0);
  });

  it('picks secondary by exact name match, independent of role text', () => {
    const colors = [
      token('Primary', '#7C3AED', 'Primary brand color'),
      token('Secondary', '#DB2777', 'Secondary brand color'),
    ];
    const roles = classifyColorRoles(colors);
    expect(roles.secondary?.name).toBe('Secondary');
  });

  it('picks accent by name OR by role text mentioning "accent"', () => {
    const byName = classifyColorRoles([token('Accent', '#F59E0B', 'Highlight color')]);
    expect(byName.accent?.name).toBe('Accent');

    const byRole = classifyColorRoles([token('Sunset', '#F59E0B', 'Accent highlights')]);
    expect(byRole.accent?.name).toBe('Sunset');
  });

  it('returns empty buckets and undefined picks for a palette with no matching roles', () => {
    const colors = [token('Primary', '#7C3AED', 'Primary brand color')];
    const roles = classifyColorRoles(colors);
    expect(roles.surfaces).toHaveLength(0);
    expect(roles.texts).toHaveLength(0);
    expect(roles.heading).toBeUndefined();
    expect(roles.muted).toBeUndefined();
    expect(roles.secondary).toBeUndefined();
    expect(roles.accent).toBeUndefined();
  });

  it('recognizes the widened surface keyword set (paper/canvas/base/page/panel)', () => {
    const colors = [
      token('Paper', '#FFFDF5', 'Paper page background'),
      token('Canvas', '#F8F5EE', 'Canvas base surface'),
      token('Panel', '#EDE7DA', 'Panel background'),
    ];
    const roles = classifyColorRoles(colors);
    expect(roles.surfaces).toHaveLength(3);
  });

  // FOLD-IN regression: the classifier's widened keyword set ("dark" now also matches
  // in TEXT_RE, "warm" in SURFACE_RE) could miscategorize a border/highlight/divider/
  // shadow decoration color as body text or a background, merely because its role ALSO
  // contains "dark"/"warm". A decoration-purpose word takes precedence.
  it('a "dark accent for borders" role is NOT miscategorized as body text', () => {
    const colors = [token('Charcoal', '#333333', 'Dark accent for borders')];
    const roles = classifyColorRoles(colors);
    expect(roles.texts).toHaveLength(0);
    expect(roles.accent?.name).toBe('Charcoal');
  });

  it('a "warm border accent" role is NOT miscategorized as a background surface', () => {
    const colors = [token('Rustic', '#B08968', 'Warm border accent')];
    const roles = classifyColorRoles(colors);
    expect(roles.surfaces).toHaveLength(0);
    expect(roles.accent?.name).toBe('Rustic');
  });

  it('a heading role mentioning "font accent" still classifies as heading, not decoration', () => {
    // Guards against an overzealous decoration-word check swallowing a legitimate
    // heading role that happens to say "accent" without meaning a border/highlight.
    const colors = [token('Titan', '#111111', 'Display heading font accent')];
    const roles = classifyColorRoles(colors);
    expect(roles.heading?.name).toBe('Titan');
  });
});
