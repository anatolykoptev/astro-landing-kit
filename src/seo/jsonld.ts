import type { StructuredDataConfig } from '../adapters/types';

interface JsonLdOptions {
  siteUrl: string;
  siteName: string;
  faqs?: { q: string; a: string }[];
}

function buildFaqEntities(faqs: { q: string; a: string }[]): object[] {
  return faqs.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  }));
}

const builders: Record<string, (config: StructuredDataConfig, opts: JsonLdOptions) => object> = {
  Organization: (config, opts) => ({
    '@type': 'Organization',
    '@id': `${opts.siteUrl}/#org`,
    name: opts.siteName,
    url: opts.siteUrl,
    ...config.props,
  }),
  ProfessionalService: (config, opts) => ({
    '@type': 'ProfessionalService',
    '@id': `${opts.siteUrl}/#service`,
    name: opts.siteName,
    url: opts.siteUrl,
    provider: { '@id': `${opts.siteUrl}/#org` },
    ...config.props,
  }),
  Person: (config, opts) => ({
    '@type': 'Person',
    '@id': `${opts.siteUrl}/#founder`,
    worksFor: { '@id': `${opts.siteUrl}/#org` },
    url: opts.siteUrl,
    ...config.props,
  }),
  FAQPage: (_config, opts) => ({
    '@type': 'FAQPage',
    '@id': `${opts.siteUrl}/#faq`,
    mainEntity: opts.faqs ? buildFaqEntities(opts.faqs) : [],
  }),
  SoftwareApplication: (config, opts) => ({
    '@type': 'SoftwareApplication',
    '@id': `${opts.siteUrl}/#app`,
    url: opts.siteUrl,
    ...config.props,
  }),
};

export function buildJsonLd(
  configs: StructuredDataConfig[],
  options: JsonLdOptions
): string {
  const graph = configs
    .filter(c => builders[c.type])
    .map(c => builders[c.type](c, options));

  if (graph.length === 0) return '';

  const doc = { '@context': 'https://schema.org', '@graph': graph };
  const json = JSON.stringify(doc).replace(/<\//g, '<\\/');
  return `<script type="application/ld+json">${json}</script>`;
}
