import fs from 'node:fs';
import type { AstroIntegration } from 'astro';
import { parseDesignMd } from './parser';
import { generateThemeCss, generateDarkModeOverrides } from './theme-generator';
import { generateAwOverrides, isDarkDesign } from './aw-overrides';

export interface DesignIntegrationOptions {
  /** Path to DESIGN.md, default: './DESIGN.md' */
  designMd?: string;
}

export default function designMdIntegration(options: DesignIntegrationOptions = {}): AstroIntegration {
  const designMdPath = options.designMd ?? './DESIGN.md';

  return {
    name: 'landing-kit-design',
    hooks: {
      'astro:config:setup': ({ config, updateConfig, addWatchFile, logger, injectScript }) => {
        const buildLogger = logger.fork('landing-kit-design');

        const virtualModuleId = 'landing-kit:design-theme';
        const resolvedVirtualModuleId = '\0' + virtualModuleId;

        let themeCss = '/* No DESIGN.md found */';
        let awCss = '';
        let forceDark = false;

        try {
          if (fs.existsSync(designMdPath)) {
            const content = fs.readFileSync(designMdPath, 'utf-8');
            const tokens = parseDesignMd(content);
            const theme = generateThemeCss(tokens);
            const dark = generateDarkModeOverrides(tokens);
            awCss = generateAwOverrides(tokens);
            forceDark = isDarkDesign(tokens);
            themeCss = theme + (dark ? '\n' + dark : '') + (awCss ? '\n' + awCss : '');
            buildLogger.info(`Applied design: ${tokens.name} (${tokens.colors.length} colors, dark=${forceDark})`);
            addWatchFile(new URL(designMdPath, config.root));
          } else {
            buildLogger.info('No DESIGN.md found — using default theme');
          }
        } catch (err) {
          buildLogger.warn(`Failed to parse DESIGN.md: ${err}`);
        }

        // Inject --aw-* overrides as inline style (highest priority)
        if (awCss) {
          injectScript('head-inline', `
            (function(){
              var s = document.createElement('style');
              s.textContent = ${JSON.stringify(awCss)};
              document.head.appendChild(s);
            })();
          `);
        }

        // Force dark class on <html> for dark-first designs
        if (forceDark) {
          injectScript('head-inline', `document.documentElement.classList.add('dark');`);
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
