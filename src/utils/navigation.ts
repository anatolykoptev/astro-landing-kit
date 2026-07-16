/**
 * Navigation utilities — auto-link generation from blog config.
 *
 * generateBlogNavLinks() reads APP_BLOG.list + APP_BLOG.category and
 * returns MenuLink[] for the header navigation. Tags are excluded
 * (no consumer need, no tag nav in headerData).
 *
 * Used by ui/Header.astro when autoGenerateBlogLinks prop is true.
 */
import type { MenuLink } from '~/types';
import { APP_BLOG } from '~/config/kit';
import { getBlogPermalink, getPermalink, CATEGORY_BASE } from '~/utils/permalinks';

/**
 * Generate navigation links from blog config.
 *
 * - Blog list link: if APP_BLOG.list.isEnabled, link to getBlogPermalink()
 * - Category index link: if APP_BLOG.category.isEnabled, link to getPermalink(CATEGORY_BASE, 'category')
 *
 * Tags are intentionally excluded — no consumer need for tag nav in header.
 *
 * @returns MenuLink[] — empty array if blog is disabled or no list/category enabled
 */
export function generateBlogNavLinks(): MenuLink[] {
  const links: MenuLink[] = [];

  if (APP_BLOG?.isEnabled) {
    if (APP_BLOG.list?.isEnabled) {
      links.push({
        text: 'Blog',
        href: getBlogPermalink(),
      });
    }

    if (APP_BLOG.category?.isEnabled) {
      links.push({
        text: 'Categories',
        href: getPermalink(CATEGORY_BASE, 'category'),
      });
    }
  }

  return links;
}
