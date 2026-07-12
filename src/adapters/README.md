# adapters

Content loading abstraction: typed interfaces + JSON file loader.

## What

Defines the `LandingPage` / `PageMeta` / `LandingSection` types and ships a concrete `JsonContentProvider` (file-based loader). Consumers can implement `ContentProvider` against any backend.

## When to use

- Loading page content from JSON files under `src/content/`
- Defining custom content sources (CMS, API) that produce `LandingPage` objects
- Importing shared TypeScript types across a project

## API

```ts
// adapters/types
export interface LandingPage { slug, meta: PageMeta, sections: LandingSection[] }
export interface PageMeta { title, description, siteUrl?, ogImage?, canonical?, navLinks?, socialLinks?, footerLinks?, footerDescription?, structuredData?, robots?, twitter? }
export interface LandingSection { type, id?, variant?, cssClass?, props }
export interface StructuredDataConfig { type: 'Organization'|'ProfessionalService'|'Person'|'FAQPage'|'SoftwareApplication', props }

// adapters/provider
export interface ContentProvider {
  loadPage(slug: string): Promise<LandingPage>
  loadSection?(collection: string, id: string): Promise<LandingSection>
}

// adapters/json
export async function loadJson(slug: string, basePath?: string): Promise<LandingPage>

// adapters/index — barrel: re-exports all of the above
```

## Example

```ts
import { loadJson } from 'astro-landing-kit/adapters/json';
import type { LandingPage } from 'astro-landing-kit/adapters/types';

const page: LandingPage = await loadJson('home', 'src/content');
```

## Dependencies

None — zero internal cross-imports.

## Status

stable
