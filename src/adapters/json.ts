import type { ContentProvider } from './provider';
import type { LandingPage } from './types';
import fs from 'node:fs/promises';
import path from 'node:path';

const SLUG_RE = /^[a-z0-9_-]+$/i;

export class JsonContentProvider implements ContentProvider {
  private basePath: string;

  constructor(basePath: string = 'src/content') {
    this.basePath = basePath;
  }

  async loadPage(slug: string): Promise<LandingPage> {
    if (!SLUG_RE.test(slug)) {
      throw new Error(`Invalid slug: ${JSON.stringify(slug)}`);
    }
    const resolvedBase = path.resolve(this.basePath);
    const filePath = path.resolve(resolvedBase, `${slug}.json`);
    if (!filePath.startsWith(resolvedBase + path.sep)) {
      throw new Error(`Path traversal detected for slug: ${JSON.stringify(slug)}`);
    }
    const raw = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw) as LandingPage;
    if (!data.slug) data.slug = slug;
    return data;
  }
}

const defaultProvider = new JsonContentProvider();

export async function loadJson(slug: string, basePath?: string): Promise<LandingPage> {
  if (basePath) {
    return new JsonContentProvider(basePath).loadPage(slug);
  }
  return defaultProvider.loadPage(slug);
}
