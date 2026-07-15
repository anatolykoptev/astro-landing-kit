import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Features', href: getPermalink('/#features') },
    { text: 'Production', href: getPermalink('/#production') },
    {
      text: 'npm',
      href: 'https://www.npmjs.com/package/astro-landing-kit',
      target: '_blank',
    },
  ],
  actions: [
    {
      text: 'GitHub',
      href: 'https://github.com/anatolykoptev/astro-landing-kit',
      target: '_blank',
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Kit',
      links: [
        { text: 'Features', href: getPermalink('/#features') },
        { text: 'Production', href: getPermalink('/#production') },
        {
          text: 'npm',
          href: 'https://www.npmjs.com/package/astro-landing-kit',
        },
        {
          text: 'GitHub',
          href: 'https://github.com/anatolykoptev/astro-landing-kit',
        },
      ],
    },
    {
      title: 'Docs',
      links: [
        { text: 'DESIGN.md format', href: getPermalink('/#design-system') },
        { text: 'PWA setup', href: getPermalink('/#production') },
        {
          text: 'Impeccable integration',
          href: 'https://impeccable.style',
        },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    {
      ariaLabel: 'GitHub',
      icon: 'tabler:brand-github',
      href: 'https://github.com/anatolykoptev/astro-landing-kit',
    },
    {
      ariaLabel: 'npm',
      icon: 'tabler:brand-npm',
      href: 'https://www.npmjs.com/package/astro-landing-kit',
    },
  ],
  footNote: `
    Built with astro-landing-kit · MIT licensed · Fork of AstroWind by onWidget
  `,
};
