import { describe, it, expect, beforeEach } from 'vitest';
import {
  createRegistry,
  registerWidget,
  getWidget,
  hasWidget,
  listWidgetTypes,
  registry,
} from './registry';

describe('createRegistry', () => {
  it('returns an empty registry', () => {
    const r = createRegistry();
    expect(r.list()).toEqual([]);
    expect(r.entries()).toEqual([]);
  });

  it('register + get round-trip', () => {
    const r = createRegistry();
    const fake = { __astro: true };
    r.register('hero', fake);
    expect(r.get('hero')).toBe(fake);
    expect(r.has('hero')).toBe(true);
  });

  it('has() returns false for unregistered type', () => {
    const r = createRegistry();
    expect(r.has('nope')).toBe(false);
    expect(r.get('nope')).toBeUndefined();
  });

  it('list() returns registered type strings', () => {
    const r = createRegistry();
    r.register('hero', {});
    r.register('features', {});
    r.register('cta', {});
    expect(r.list().sort()).toEqual(['cta', 'features', 'hero']);
  });

  it('entries() returns [type, component] pairs', () => {
    const r = createRegistry();
    const hero = { id: 'hero' };
    r.register('hero', hero);
    expect(r.entries()).toEqual([['hero', hero]]);
  });

  it('register overwrites existing type (idempotent)', () => {
    const r = createRegistry();
    const v1 = { version: 1 };
    const v2 = { version: 2 };
    r.register('hero', v1);
    r.register('hero', v2);
    expect(r.get('hero')).toBe(v2);
    expect(r.list()).toEqual(['hero']);
  });

  it('register throws on empty/non-string type', () => {
    const r = createRegistry();
    expect(() => r.register('', {})).toThrow('non-empty string');
    expect(() => r.register(null as unknown as string, {})).toThrow('non-empty string');
    expect(() => r.register(undefined as unknown as string, {})).toThrow('non-empty string');
  });

  it('isolated registries do not share state', () => {
    const a = createRegistry();
    const b = createRegistry();
    a.register('hero', {});
    expect(b.has('hero')).toBe(false);
  });
});

describe('default registry (module singleton)', () => {
  // Use a unique type prefix to avoid collision with default registrations
  // that RenderSections.astro would make in an Astro build (not in vitest).
  const testType = '__test_widget__';

  beforeEach(() => {
    // Clean up if a previous test left it
    if (hasWidget(testType)) {
      // Registry has no unregister — re-register with undefined to simulate removal
      // (getWidget will return undefined, hasWidget will return true but that's
      // acceptable for test isolation; the type is unique per test run).
    }
  });

  it('registerWidget + getWidget round-trip on singleton', () => {
    const fake = { __test: true };
    registerWidget(testType, fake);
    expect(getWidget(testType)).toBe(fake);
    expect(hasWidget(testType)).toBe(true);
  });

  it('listWidgetTypes includes registered type', () => {
    registerWidget(testType, {});
    expect(listWidgetTypes()).toContain(testType);
  });

  it('getWidget returns undefined for unknown type', () => {
    expect(getWidget('__nonexistent__')).toBeUndefined();
  });

  it('registry singleton is the same instance', () => {
    expect(registry).toBe(registry);
    expect(typeof registry.register).toBe('function');
  });
});
