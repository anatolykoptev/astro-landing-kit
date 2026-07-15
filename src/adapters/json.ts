import type { ContentProvider } from './provider';
import type { LandingPage } from './types';
import { ContentError } from './errors';
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
      throw ContentError.invalid(`Invalid slug: ${JSON.stringify(slug)}`);
    }
    const resolvedBase = path.resolve(this.basePath);
    const filePath = path.resolve(resolvedBase, `${slug}.json`);
    if (!filePath.startsWith(resolvedBase + path.sep)) {
      throw ContentError.invalid(`Path traversal detected for slug: ${JSON.stringify(slug)}`);
    }

    let raw: string;
    try {
      raw = await fs.readFile(filePath, 'utf-8');
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        throw ContentError.notFound(slug, `JSON (${this.basePath})`);
      }
      throw ContentError.network(`Failed to read ${filePath}: ${(err as Error).message}`, err);
    }

    let data: LandingPage;
    try {
      data = JSON.parse(raw) as LandingPage;
    } catch (err) {
      throw ContentError.parse(`Invalid JSON in ${filePath}: ${(err as Error).message}`, err);
    }

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
