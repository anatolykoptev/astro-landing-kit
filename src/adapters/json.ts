import type { ContentProvider, LandingPage } from './types';
import fs from 'node:fs/promises';
import path from 'node:path';

export class JsonContentProvider implements ContentProvider {
  private basePath: string;

  constructor(basePath: string = 'src/content') {
    this.basePath = basePath;
  }

  async loadPage(slug: string): Promise<LandingPage> {
    const filePath = path.resolve(this.basePath, `${slug}.json`);
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
