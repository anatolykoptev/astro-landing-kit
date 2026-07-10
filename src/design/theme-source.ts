/**
 * Fallback source for the generated DESIGN.md theme CSS.
 *
 * The landing-kit design integration (src/design/integration.ts) overrides this
 * module's export AT BUILD TIME — via a Vite `load` hook — with the `:root` / `.dark`
 * `--aw-color-*` overrides generated from the project's DESIGN.md, wrapped in the
 * `landing-kit-design-theme` cascade layer.
 *
 * Why a real fallback file instead of the more idiomatic Astro virtual-module pattern
 * (a synthetic id like `landing-kit:design-theme` that only exists once an integration
 * resolves it): this pipeline must be OPT-IN and gracefully no-op for a consumer who
 * never mounts the integration. A bare virtual-module import fails the build for anyone
 * who hasn't wired the resolver; a real file with a safe empty default always resolves,
 * so <DesignTheme /> can unconditionally `import { designThemeCss }` and the integration
 * simply overrides the value when present.
 *
 * When the integration is NOT mounted (the default), this empty string is what
 * <DesignTheme /> receives, so no <style> is injected and the kit renders exactly the
 * CustomStyles.astro defaults — a consumer that does not opt in is unaffected.
 *
 * Do NOT inline design tokens here; edit your DESIGN.md instead.
 */
export const designThemeCss = '';
