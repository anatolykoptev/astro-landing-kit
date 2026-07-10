/**
 * apply-design — reads a DESIGN.md, generates theme CSS, writes to project.
 * Can be used as a script: npx tsx src/design/apply.ts path/to/DESIGN.md
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseDesignMd } from './parser';
import { generateThemeCss, generateDarkModeOverrides } from './theme-generator';

export async function applyDesign(designMdPath: string, outputPath?: string): Promise<string> {
  const content = await fs.readFile(designMdPath, 'utf-8');
  const tokens = parseDesignMd(content, designMdPath);

  const theme = generateThemeCss(tokens);
  const dark = generateDarkModeOverrides(tokens);
  const output = theme + (dark ? '\n' + dark : '') + '\n';

  const outFile = outputPath ?? 'src/assets/styles/design-theme.css';
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, output, 'utf-8');

  return `Applied "${tokens.name}" → ${outFile} (${tokens.colors.length} colors, fonts: ${tokens.fonts.display}/${tokens.fonts.body})`;
}

// CLI entry point — runs ONLY when this file is executed directly as a script
// (e.g. `npx tsx src/design/apply.ts path/to/DESIGN.md`), never merely on import.
// Without this guard, `astro build`'s own process.argv leaks into any consumer
// that imports this module (e.g. via the `./design` barrel export), and the old
// unconditional `if (args[0])` check fired applyDesign() as a build-time side effect.
const isMain = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const args = process.argv.slice(2);
  if (args[0]) {
    applyDesign(args[0], args[1]).then(console.log).catch(console.error);
  }
}
