/**
 * apply-design — reads a DESIGN.md, generates theme CSS, writes to project.
 * Can be used as a script: npx tsx src/design/apply.ts path/to/DESIGN.md
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseDesignMd } from './parser';
import { generateThemeCss, generateDarkModeOverrides } from './theme-generator';

export async function applyDesign(designMdPath: string, outputPath?: string): Promise<string> {
  const content = await fs.readFile(designMdPath, 'utf-8');
  const tokens = parseDesignMd(content);

  const theme = generateThemeCss(tokens);
  const dark = generateDarkModeOverrides(tokens);
  const output = theme + (dark ? '\n' + dark : '') + '\n';

  const outFile = outputPath ?? 'src/assets/styles/design-theme.css';
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, output, 'utf-8');

  return `Applied "${tokens.name}" → ${outFile} (${tokens.colors.length} colors, fonts: ${tokens.fonts.display}/${tokens.fonts.body})`;
}

// CLI entry point
const args = process.argv.slice(2);
if (args[0]) {
  applyDesign(args[0], args[1]).then(console.log).catch(console.error);
}
