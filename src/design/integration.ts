import fs from 'node:fs';
import type { AstroIntegration } from 'astro';
import { parseDesignMd } from './parser';
import { generateThemeCss, generateDarkModeOverrides } from './theme-generator';

export interface DesignIntegrationOptions {
  /** Path to DESIGN.md, default: './DESIGN.md' */
  designMd?: string;
}

export default function designMdIntegration(options: DesignIntegrationOptions = {}): AstroIntegration {
  const designMdPath = options.designMd ?? './DESIGN.md';

  return {
    name: 'landing-kit-design',
    hooks: {
      'astro:config:setup': ({ config, updateConfig, addWatchFile, logger }) => {
        const buildLogger = logger.fork('landing-kit-design');

        const virtualModuleId = 'landing-kit:design-theme';
        const resolvedVirtualModuleId = '\0' + virtualModuleId;

        let themeCss = '/* No DESIGN.md found */';

        // No try/catch here on purpose: a DESIGN.md that exists but fails to parse
        // (e.g. zero colors) must fail the build loudly — see src/design/README.md —
        // not get swallowed into a silently-unthemed site.
        if (fs.existsSync(designMdPath)) {
          const content = fs.readFileSync(designMdPath, 'utf-8');
          const tokens = parseDesignMd(content, designMdPath);
          const theme = generateThemeCss(tokens);
          const dark = generateDarkModeOverrides(tokens);
          themeCss = theme + (dark ? '\n' + dark : '');
          buildLogger.info(`Applied design: ${tokens.name} (${tokens.colors.length} colors)`);
          addWatchFile(new URL(designMdPath, config.root));
        } else {
          buildLogger.info('No DESIGN.md found — using default theme');
        }

        updateConfig({
          vite: {
            plugins: [
              {
                name: 'vite-plugin-design-theme',
                resolveId(id) {
                  if (id === virtualModuleId) return resolvedVirtualModuleId;
                },
                load(id) {
                  if (id === resolvedVirtualModuleId) {
                    return `export default ${JSON.stringify(themeCss)};`;
                  }
                },
              },
            ],
          },
        });
      },
    },
  };
}
