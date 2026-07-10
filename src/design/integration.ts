import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { parseDesignMd } from './parser';
import { generateThemeCss } from './theme-generator';
import { generateSmartDarkMode } from './dark-mode';

export interface DesignIntegrationOptions {
  /** Path to DESIGN.md, resolved relative to the Astro project root. Default: `./DESIGN.md`. */
  designMd?: string;
}

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
 * DESIGN.md → theme integration (the ONE canonical apply path).
 *
 * Opt-in: a consumer adds `designMdIntegration()` to their `astro.config` integrations.
 * When mounted with a DESIGN.md present, it parses the file and overrides the
 * `designThemeCss` export of `theme-source.ts`; <DesignTheme /> (rendered right after
 * <CustomStyles /> in Layout.astro) injects that CSS as an inline <style>, so the
 * DESIGN.md `--aw-color-*` values override the CustomStyles defaults by cascade order.
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
          themeCss = theme + (dark ? '\n' + dark : '') + '\n';
          buildLogger.info(`Applied design "${tokens.name}" (${tokens.colors.length} colors) → --aw-color-* overrides`);
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
