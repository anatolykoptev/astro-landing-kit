export interface PageMeta {
  title: string;
  description: string;
  siteUrl?: string;
  ogImage?: string;
  canonical?: string;
  navLinks?: NavLink[];
  socialLinks?: SocialLink[];
  footerLinks?: NavLink[];
  footerDescription?: string;
  structuredData?: StructuredDataConfig[];
  robots?: { index?: boolean; follow?: boolean };
  twitter?: { handle?: string; site?: string; cardType?: string };
}

export interface NavLink {
  href: string;
  label: string;
}

export interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

export interface StructuredDataConfig {
  type: 'Organization' | 'ProfessionalService' | 'Person' | 'FAQPage' | 'SoftwareApplication';
  props: Record<string, unknown>;
}

export interface LandingSection {
  type: string;
  id?: string;
  variant?: 'plain' | 'raised' | 'dark';
  cssClass?: string;
  props: Record<string, unknown>;
}

export interface LandingPage {
  slug: string;
  meta: PageMeta;
  sections: LandingSection[];
}
