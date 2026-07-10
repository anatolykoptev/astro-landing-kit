/**
 * Fallback source for the generated DESIGN.md theme CSS.
 *
 * The landing-kit design integration (src/design/integration.ts) overrides this
 * module's export AT BUILD TIME — via a Vite `load` hook — with the `:root` / `.dark`
 * `--aw-color-*` overrides generated from the project's DESIGN.md.
 *
 * When the integration is NOT mounted (the default), this empty string is what
 * <DesignTheme /> receives, so no <style> is injected and the kit renders exactly the
 * CustomStyles.astro defaults — a consumer that does not opt in is unaffected.
 *
 * Do NOT inline design tokens here; edit your DESIGN.md instead.
 */
export const designThemeCss = '';
