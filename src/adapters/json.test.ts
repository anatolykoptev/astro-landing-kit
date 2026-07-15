import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JsonContentProvider, loadJson } from './json';
import { ContentError } from './errors';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const TMP = path.join(os.tmpdir(), `alk-json-test-${Date.now()}`);

async function setupFixture(slug: string, content: object | string): Promise<void> {
  await fs.mkdir(TMP, { recursive: true });
  const raw = typeof content === 'string' ? content : JSON.stringify(content);
  await fs.writeFile(path.join(TMP, `${slug}.json`), raw);
}

describe('JsonContentProvider', () => {
  beforeEach(async () => {
    await fs.rm(TMP, { recursive: true, force: true });
  });
  afterEach(async () => {
    await fs.rm(TMP, { recursive: true, force: true });
  });

  it('loads a valid page with slug and sections', async () => {
    await setupFixture('home', {
      slug: 'home',
      meta: { title: 'Home', description: 'Test' },
      sections: [{ type: 'Hero', props: { title: 'Hi' } }],
    });
    const provider = new JsonContentProvider(TMP);
    const page = await provider.loadPage('home');
    expect(page.slug).toBe('home');
    expect(page.sections).toHaveLength(1);
    expect(page.sections[0].type).toBe('Hero');
  });

  it('auto-fills slug when missing from JSON', async () => {
    await setupFixture('about', {
      meta: { title: 'About', description: 'About page' },
      sections: [],
    });
    const provider = new JsonContentProvider(TMP);
    const page = await provider.loadPage('about');
    expect(page.slug).toBe('about');
  });

  it('throws ContentError(not_found) for missing file', async () => {
    const provider = new JsonContentProvider(TMP);
    await expect(provider.loadPage('nope')).rejects.toMatchObject({
      name: 'ContentError',
      code: 'not_found',
    });
  });

  it('throws ContentError(invalid) for path traversal attempt', async () => {
    const provider = new JsonContentProvider(TMP);
    await expect(provider.loadPage('../../../etc/passwd')).rejects.toMatchObject({
      name: 'ContentError',
      code: 'invalid',
    });
  });

  it('throws ContentError(invalid) for bad slug format', async () => {
    const provider = new JsonContentProvider(TMP);
    await expect(provider.loadPage('bad slug!')).rejects.toMatchObject({
      name: 'ContentError',
      code: 'invalid',
    });
  });

  it('throws ContentError(parse) for invalid JSON', async () => {
    await setupFixture('broken', '{not valid json');
    const provider = new JsonContentProvider(TMP);
    await expect(provider.loadPage('broken')).rejects.toMatchObject({
      name: 'ContentError',
      code: 'parse',
    });
  });

  it('ContentError is instanceof Error', async () => {
    const provider = new JsonContentProvider(TMP);
    try {
      await provider.loadPage('nope');
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(ContentError);
    }
  });
});

describe('loadJson helper', () => {
  beforeEach(async () => {
    await fs.rm(TMP, { recursive: true, force: true });
  });
  afterEach(async () => {
    await fs.rm(TMP, { recursive: true, force: true });
  });

  it('loads via helper with basePath', async () => {
    await setupFixture('helper', {
      meta: { title: 'Helper', description: 'Test' },
      sections: [],
    });
    const page = await loadJson('helper', TMP);
    expect(page.slug).toBe('helper');
  });
});
