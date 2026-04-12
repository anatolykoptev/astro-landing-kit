import fs from 'node:fs/promises';
import path from 'node:path';
import { parseDesignMd } from './parser';
import { generateThemeCss, generateDarkModeOverrides } from './theme-generator';

const DESIGNS_DIR = '/home/krolik/tools/awesome-design-md/design-md-styles';

export interface SearchResult {
  name: string;
  slug: string;
  designMdPath: string;
  themeCss: string;
}

/** List all available design slugs */
export async function listDesigns(): Promise<string[]> {
  const entries = await fs.readdir(DESIGNS_DIR, { withFileTypes: true });
  return entries.filter(e => e.isDirectory()).map(e => e.name).sort();
}

/** Load a design by slug and generate theme CSS */
export async function loadDesign(slug: string): Promise<SearchResult> {
  const designMdPath = path.join(DESIGNS_DIR, slug, 'DESIGN.md');
  const content = await fs.readFile(designMdPath, 'utf-8');
  const tokens = parseDesignMd(content);
  const theme = generateThemeCss(tokens);
  const dark = generateDarkModeOverrides(tokens);
  const themeCss = theme + (dark ? '\n' + dark : '') + '\n';
  return { name: tokens.name, slug, designMdPath, themeCss };
}

/** Simple fuzzy search: split query into words, match against slug */
export async function searchDesigns(query: string, limit = 5): Promise<string[]> {
  const all = await listDesigns();
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const scored = all.map(slug => {
    const score = words.reduce((s, w) => s + (slug.includes(w) ? 1 : 0), 0);
    return { slug, score };
  });
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map(s => s.slug);
}
