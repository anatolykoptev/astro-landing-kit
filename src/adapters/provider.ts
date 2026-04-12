import type { LandingPage, LandingSection } from './types';

export interface ContentProvider {
  loadPage(slug: string): Promise<LandingPage>;
  loadSection?(collection: string, id: string): Promise<LandingSection>;
}
