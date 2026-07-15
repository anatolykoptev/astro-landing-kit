/**
 * Widget registry — maps `LandingSection.type` strings to Astro component
 * references. The core lookup logic is framework-agnostic (no .astro imports)
 * so it can be unit-tested in vitest; the actual widget registration happens in
 * `RenderSections.astro` (and in consumer code via `registerWidget()`).
 *
 * @see src/compose/RenderSections.astro  — default registration + renderer
 */

/** Minimal component reference — an Astro `.astro` module default export. */
export type Component = unknown;

export interface WidgetRegistry {
  register(type: string, component: Component): void;
  get(type: string): Component | undefined;
  has(type: string): boolean;
  list(): string[];
  /** Returns a snapshot copy suitable for iteration. */
  entries(): Array<[string, Component]>;
}

export function createRegistry(): WidgetRegistry {
  const map = new Map<string, Component>();
  return {
    register(type, component) {
      if (!type || typeof type !== 'string') {
        throw new Error(`registerWidget: type must be a non-empty string, got ${JSON.stringify(type)}`);
      }
      map.set(type, component);
    },
    get(type) {
      return map.get(type);
    },
    has(type) {
      return map.has(type);
    },
    list() {
      return [...map.keys()];
    },
    entries() {
      return [...map.entries()];
    },
  };
}

/**
 * Module-level singleton — the default registry used by `RenderSections.astro`
 * and by consumer `registerWidget()` calls.
 */
const defaultRegistry = createRegistry();

/**
 * Register a widget under a section `type` string.
 * Consumers call this to add custom section types:
 *
 * ```ts
 * import { registerWidget } from 'astro-landing-kit/compose/registry';
 * import MyComparison from './components/Comparison.astro';
 * registerWidget('comparison', MyComparison);
 * ```
 */
export function registerWidget(type: string, component: Component): void {
  defaultRegistry.register(type, component);
}

/** Look up a registered widget by section type. Returns `undefined` if not found. */
export function getWidget(type: string): Component | undefined {
  return defaultRegistry.get(type);
}

/** Check whether a section type is registered. */
export function hasWidget(type: string): boolean {
  return defaultRegistry.has(type);
}

/** List all registered section type strings. */
export function listWidgetTypes(): string[] {
  return defaultRegistry.list();
}

/** The singleton registry instance (rarely needed directly). */
export { defaultRegistry as registry };
