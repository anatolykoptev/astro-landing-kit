import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { parseDesignMd } from './parser';
import { generateThemeCss, checkThemeContrast } from './theme-generator';
import { generateSmartDarkMode } from './dark-mode';

export interface DesignIntegrationOptions {
  /** Path to DESIGN.md, resolved relative to the Astro project root. Default: `./DESIGN.md`. */
  designMd?: string;
}

/**
 * HIGH-1 fix: the highest-priority named cascade layer in the 3-tier `--aw-color-*`
 * precedence chain declared by src/design/theme-layers.css:
 *   landing-kit-defaults (CustomStyles.astro) < landing-kit-theme-starter (theme.css)
 *   < landing-kit-design-theme (this integration).
 * Cascade-layer priority is independent of DOM/import order, so DESIGN.md wins
 * regardless of where a consumer happens to `@import` theme.css or render
 * <CustomStyles />/<DesignTheme /> — see src/design/README.md "Precedence".
 */
export const DESIGN_THEME_LAYER = 'landing-kit-design-theme';

/**
 * Matches the always-resolvable fallback module `src/design/theme-source.ts` that
 * <DesignTheme /> imports. This integration's Vite `load` hook overrides that module's
 * `designThemeCss` export with the CSS generated from DESIGN.md. Matched by path suffix
 * (not exact absolute path) so it is robust to whichever alias the consumer resolves it
 * through (`~/design/theme-source`, a relative import, a node_modules copy, …).
 */
function isThemeSourceModule(id: string): boolean {
  return id.split('?')[0].replace(/\\/g, '/').endsWith('/design/theme-source.ts');
}

/**
 * DESIGN.md → theme integration (the ONE canonical GENERATION path — see
 * src/design/README.md "Precedence" for the full 3-source picture including theme.css).
 *
 * Opt-in: a consumer adds `designMdIntegration()` to their `astro.config` integrations.
 * When mounted with a DESIGN.md present, it parses the file and overrides the
 * `designThemeCss` export of `theme-source.ts`, wrapped in the `landing-kit-design-theme`
 * cascade layer (see DESIGN_THEME_LAYER); <DesignTheme /> injects that CSS as an inline
 * <style>. Because it's the highest-priority named layer, it wins over CustomStyles
 * defaults AND an optionally-imported theme.css regardless of render/import order.
 *
 * When NOT mounted, `theme-source.ts` keeps its `export const designThemeCss = ''`,
 * <DesignTheme /> injects nothing, and the site renders exactly the CustomStyles
 * defaults — i.e. a consumer that does not opt in is byte-for-byte unaffected.
 */
export default function designMdIntegration(options: DesignIntegrationOptions = {}): AstroIntegration {
  const designMdRel = options.designMd ?? './DESIGN.md';

  return {
    name: 'landing-kit-design',
    hooks: {
      'astro:config:setup': ({ config, updateConfig, addWatchFile, logger }) => {
        const buildLogger = logger.fork('landing-kit-design');
        const designMdPath = fileURLToPath(new URL(designMdRel, config.root));

        let themeCss = '';

        // No try/catch on purpose: a DESIGN.md that EXISTS but parses to zero colors
        // must fail the build loudly (see src/design/README.md), never silently ship an
        // unthemed site. A MISSING DESIGN.md is not an error — it is the default.
        if (fs.existsSync(designMdPath)) {
          const content = fs.readFileSync(designMdPath, 'utf-8');
          const tokens = parseDesignMd(content, designMdPath);
          const theme = generateThemeCss(tokens);
          const dark = generateSmartDarkMode(tokens);
          const combined = theme + (dark ? '\n' + dark : '');
          // HIGH-1 fix: wrap in the highest-priority named layer so this ALWAYS wins
          // over CustomStyles defaults and an optionally-imported theme.css, regardless
          // of head/DOM order — see DESIGN_THEME_LAYER above.
          themeCss = `@layer ${DESIGN_THEME_LAYER} {\n${combined}\n}\n`;
          buildLogger.info(`Applied design "${tokens.name}" (${tokens.colors.length} colors) → --aw-color-* overrides`);

          // CRITICAL fix: build-time WCAG contrast warning for the paired bg/text
          // override (see theme-generator.ts checkThemeContrast). Warn, don't fail the
          // build — a bad but intentional pairing is the author's call, but it must not
          // be silent.
          const contrast = checkThemeContrast(tokens);
          if (contrast) {
            if (contrast.ratio === null) {
              buildLogger.warn(
                `Could not verify contrast for --aw-color-bg-page (${contrast.bg}) vs ` +
                  `--aw-color-text-default (${contrast.text}) — non-hex/rgb value; check manually.`
              );
            } else if (!contrast.meetsAA) {
              buildLogger.warn(
                `--aw-color-bg-page (${contrast.bg}) vs --aw-color-text-default (${contrast.text}) ` +
                  `is ${contrast.ratio.toFixed(2)}:1 — below WCAG AA's 4.5:1 for body text.`
              );
            }
          }

          addWatchFile(designMdPath);
        } else {
          buildLogger.info(`No DESIGN.md at ${designMdRel} — using kit defaults (CustomStyles.astro)`);
        }

        updateConfig({
          vite: {
            plugins: [
              {
                name: 'landing-kit:design-theme',
                enforce: 'pre',
                load(id: string) {
                  if (isThemeSourceModule(id)) {
                    return `export const designThemeCss = ${JSON.stringify(themeCss)};\n`;
                  }
                  return undefined;
                },
              },
            ],
          },
        });
      },
    },
  };
}
