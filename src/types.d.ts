import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { HTMLAttributes, ImageMetadata } from 'astro/types';

export interface Post {
  /** A unique ID number that identifies a post. */
  id: string;

  /** A post’s unique slug – part of the post’s URL based on its name, i.e. a post called “My Sample Page” has a slug “my-sample-page”. */
  slug: string;

  /** Full URL path of the post (e.g. /blog/my-post). */
  permalink: string;

  /** Publication date. */
  publishDate: Date;
  /** Last update date (optional). */
  updateDate?: Date;

  /** Post title. */
  title: string;
  /** Optional summary of post content. */
  excerpt?: string;
  /** Cover/hero image for the post. */
  image?: ImageMetadata | string;

  /** Primary category. */
  category?: Taxonomy;
  /** Post tags. */
  tags?: Taxonomy[];
  /** Author name or ID. */
  author?: string;

  /** Arbitrary key-value metadata. */
  metadata?: MetaData;

  /** If true, post is excluded from production output. */
  draft?: boolean;

  /** Rendered Astro component (compiled MDX/markdown). */
  Content?: AstroComponentFactory;
  content?: string;

  /** Estimated reading time in minutes. */
  readingTime?: number;
}

export interface Taxonomy {
  slug: string;
  title: string;
}

export interface MetaData {
  title?: string;
  ignoreTitleTemplate?: boolean;

  canonical?: string;

  robots?: MetaDataRobots;

  description?: string;

  openGraph?: MetaDataOpenGraph;
  twitter?: MetaDataTwitter;
}

export interface MetaDataRobots {
  index?: boolean;
  follow?: boolean;
}

export interface MetaDataImage {
  url: string;
  width?: number;
  height?: number;
}

export interface MetaDataOpenGraph {
  url?: string;
  siteName?: string;
  images?: Array<MetaDataImage>;
  locale?: string;
  type?: string;
}

export interface MetaDataTwitter {
  handle?: string;
  site?: string;
  cardType?: string;
}

export interface Image {
  src: string;
  alt?: string;
}

export interface Video {
  src: string;
  type?: string;
}

export interface Widget {
  id?: string;
  isDark?: boolean;
  bg?: string;
  classes?: Record<string, string | Record<string, string>>;
}

export interface Headline {
  title?: string;
  subtitle?: string;
  tagline?: string;
  classes?: Partial<Record<'container' | 'title' | 'subtitle' | 'tagline', string>>;
  align?: 'left' | 'center';
}

export interface Stat {
  amount?: number | string;
  title?: string;
  icon?: string;
}

export interface Item {
  title?: string;
  description?: string;
  /** Icon name (astro-icon). Pass null to suppress icon rendering entirely. */
  icon?: string | null;
  /** Chapter number string rendered by 'chapters' layout (e.g. "01"). Auto-generated if omitted. */
  chapter?: string;
  classes?: Record<string, string>;
  callToAction?: CallToAction;
  image?: Image;
}

export interface Price {
  title?: string;
  subtitle?: string;
  description?: string;
  price?: number | string;
  period?: string;
  items?: Array<Item>;
  callToAction?: CallToAction;
  hasRibbon?: boolean;
  ribbonTitle?: string;
}

export interface Testimonial {
  title?: string;
  testimonial?: string;
  name?: string;
  job?: string;
  image?: string | unknown;
}

export interface Input {
  type: HTMLInputTypeAttribute;
  name: string;
  label?: string;
  autocomplete?: string;
  placeholder?: string;
}

export interface Textarea {
  label?: string;
  name?: string;
  placeholder?: string;
  rows?: number;
}

export interface Disclaimer {
  label?: string;
}

// COMPONENTS
export interface CallToAction extends Omit<HTMLAttributes<'a'>, 'slot'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  text?: string;
  icon?: string;
  classes?: Record<string, string>;
  type?: 'button' | 'submit' | 'reset';
}

export interface ItemGrid {
  items?: Array<Item>;
  columns?: number;
  defaultIcon?: string;
  classes?: Record<string, string>;
  /**
   * Layout variant.
   * - 'grid'     — default card-grid with icon+text (backwards-compat)
   * - 'chapters' — full-width editorial list, hairline rules, chapter numbers
   * - 'log'      — monospace terminal-style dense block with › prefix
   */
  layout?: 'grid' | 'chapters' | 'log';
  /**
   * Separator rendered between title and description in the 'log' layout.
   * Defaults to ' · ' (space-middot-space, em-dash-free).
   */
  descriptionSeparator?: string;
}

export interface Collapse {
  iconUp?: string;
  iconDown?: string;
  items?: Array<Item>;
  columns?: number;
  classes?: Record<string, string>;
}

export interface Form {
  inputs?: Array<Input>;
  textarea?: Textarea;
  disclaimer?: Disclaimer;
  button?: string;
  description?: string;
  /** Form submit endpoint. If omitted, the form is non-functional (demo only). */
  action?: string;
  /** HTTP method. Default: POST. */
  method?: 'GET' | 'POST';
}

// WIDGETS
export interface Hero extends Omit<Headline, 'classes'>, Omit<Widget, 'isDark' | 'classes'> {
  content?: string;
  actions?: string | CallToAction[];
  image?: string | unknown;
  align?: 'left' | 'center';
  animate?: boolean;
}

export interface Stats extends Omit<Headline, 'classes'>, Widget {
  stats?: Array<Stat>;
  align?: 'left' | 'center';
  /** When true, renders StatsCounter.svelte with animated count-up (client:visible). */
  animate?: boolean;
}

export interface Pricing extends Omit<Headline, 'classes'>, Widget {
  prices?: Array<Price>;
  animate?: boolean;
}

export interface Testimonials extends Omit<Headline, 'classes'>, Widget {
  testimonials?: Array<Testimonial>;
  callToAction?: CallToAction;
  animate?: boolean;
}

export interface Brands extends Omit<Headline, 'classes'>, Widget {
  icons?: Array<string>;
  images?: Array<Image>;
}

export interface Features extends Omit<Headline, 'classes'>, Widget {
  image?: string | unknown;
  video?: Video;
  items?: Array<Item>;
  columns?: number;
  defaultIcon?: string;
  callToAction1?: CallToAction;
  callToAction2?: CallToAction;
  isReversed?: boolean;
  isBeforeContent?: boolean;
  isAfterContent?: boolean;
  layout?: 'grid' | 'chapters' | 'log';
  align?: 'left' | 'center';
}

export interface Faqs extends Omit<Headline, 'classes'>, Widget {
  iconUp?: string;
  iconDown?: string;
  defaultIcon?: string;
  items?: Array<Item>;
  columns?: number;
  /** When true, renders FaqAccordion.svelte with JS toggle (client:visible). */
  interactive?: boolean;
}

export interface Steps extends Omit<Headline, 'classes'>, Widget {
  items?: Array<Item>;
  callToAction?: string | CallToAction;
  image?: string | Image;
  isReversed?: boolean;
  align?: 'left' | 'center';
  animate?: boolean;
}

export interface Content extends Omit<Headline, 'classes'>, Widget {
  content?: string;
  image?: string | unknown;
  items?: Array<Item>;
  columns?: number;
  isReversed?: boolean;
  isAfterContent?: boolean;
  callToAction?: CallToAction;
}

export interface Contact extends Omit<Headline, 'classes'>, Form, Widget {
  /** When true, renders ContactForm.svelte with client-side fetch (client:load). */
  interactive?: boolean;
  /** Endpoint for ContactForm.svelte POST. Required when interactive=true. */
  endpoint?: string;
  /** Success message shown after submit (interactive mode). */
  successMessage?: string;
}

// --- New primitives (0.6.0) ---

/** A single column in a comparison table. */
export interface ComparisonColumn {
  /** Column heading (plan name, product name, etc.) */
  title?: string;
  /** Highlight this column (e.g. "Most Popular"). */
  highlight?: boolean;
  /** Optional badge/label shown next to the title. */
  badge?: string;
  /** Values per row — must match the number of rows defined on the table. Supports boolean, string, or { value, tooltip }. */
  cells?: Array<string | boolean | { value: string; tooltip?: string }>;
  /** Optional CTA at the bottom of the column. */
  callToAction?: CallToAction;
}

export interface ComparisonTable extends Omit<Headline, 'classes'>, Widget {
  /** Row labels (left column). Flat list — use `groups` for categorized rows. */
  rows?: Array<string>;
  /** Categorized row groups with section headers. Overrides `rows` when present. */
  groups?: Array<{ label: string; rows: Array<string> }>;
  /** Data columns. */
  columns?: Array<ComparisonColumn>;
}

export interface LogoCloud extends Omit<Headline, 'classes'>, Widget {
  /** Iconify icon names (rendered as inline SVG, grayscale by default). */
  icons?: Array<string>;
  /** Image URLs (alternative to icons — for raster logos). */
  images?: Array<Image>;
  /** Marquee animation: 'left', 'right', 'dual' (two opposite rows), or false for static. Default: 'left'. */
  marquee?: 'left' | 'right' | 'dual' | false;
  /** Marquee duration in seconds. Default: 30. */
  marqueeDuration?: number;
}

export interface VideoEmbed extends Omit<Headline, 'classes'>, Widget {
  /** YouTube/Vimeo/MP4 URL or embed URL. */
  src?: string;
  /** Poster image shown before play (overrides auto-generated YouTube thumbnail). */
  poster?: string;
  /** Aspect ratio class (default: 16/9). */
  aspectRatio?: string;
  /** Optional CTA below the video. */
  callToAction?: CallToAction;
  /** Use youtube-nocookie.com for privacy (default: true). */
  privacy?: boolean;
  /** Thumbnail quality for YouTube facade: 'max'|'high'|'default'|'low'. Default: 'high'. */
  posterQuality?: 'max' | 'high' | 'default' | 'low';
  /** Accessible label for the play button. Default: "Play video". */
  playlabel?: string;
  /** Video duration for JSON-LD (ISO 8601, e.g. "PT3M33S"). */
  duration?: string;
  /** Upload date for JSON-LD (ISO 8601, e.g. "2024-01-15T08:00:00Z"). */
  uploadDate?: string;
  /** Video description for JSON-LD. */
  videoDescription?: string;
}

/** A pricing plan with optional annual price for the toggle. */
export interface TogglePrice extends Price {
  /** Annual price (shown when toggle is set to "annual"). */
  annualPrice?: number | string;
  /** Annual period label (e.g. "/year"). */
  annualPeriod?: string;
  /** Features that only appear when annual billing is selected. */
  annualFeatures?: Array<string>;
  /** CTA text when monthly is selected (overrides callToAction.text). */
  ctaMonthly?: string;
  /** CTA text when annual is selected (overrides callToAction.text). */
  ctaAnnual?: string;
}

export interface PricingToggle extends Omit<Headline, 'classes'>, Widget {
  /** Pricing plans with monthly + optional annual prices. */
  prices?: Array<TogglePrice>;
  /** Label for the monthly toggle position. Default: "Monthly". */
  monthlyLabel?: string;
  /** Label for the annual toggle position. Default: "Annual". */
  annualLabel?: string;
  /** Optional badge text on the annual toggle (e.g. "Save 20%"). */
  annualBadge?: string;
  /** Show concrete dollar savings alongside percentage. Default: true. */
  showSavings?: boolean;
  /** Default to annual billing on load. Default: false. */
  defaultAnnual?: boolean;
  animate?: boolean;
}

export interface StickyCTA extends Widget {
  /** CTA text. */
  title?: string;
  /** Subtitle / supporting text. */
  subtitle?: string;
  /** CTA button. */
  callToAction?: CallToAction;
  /** Dismissible (shows close button). Default: true. */
  dismissible?: boolean;
  /** Reassurance text shown with check icon (e.g. "No credit card required"). */
  reassurance?: string;
  /** Selector for the element that triggers show when scrolled out of view. Default: first [data-cta] or section. */
  ctaSelector?: string;
  /** Show only on mobile (md:hidden). Default: true. */
  mobileOnly?: boolean;
  /** Show scroll progress bar. Default: false. */
  showProgress?: boolean;
}

export interface Gallery extends Omit<Headline, 'classes'>, Widget {
  /** Gallery images. */
  images?: Array<Image>;
  /** Grid columns (2-4). Default: 3. */
  columns?: number;
  /** Show captions on hover. Default: false. */
  captions?: boolean;
  /** Layout mode: 'grid' (uniform) or 'masonry' (staggered). Default: 'grid'. */
  layout?: 'grid' | 'masonry';
  /** Enable lightbox on click (PhotoSwipe). Default: true. */
  lightbox?: boolean;
}

export interface TestimonialSlider extends Omit<Headline, 'classes'>, Widget {
  /** Testimonial slides. */
  testimonials?: Array<Testimonial>;
  /** Auto-advance interval in ms (0 = manual). Default: 0. */
  autoplay?: number;
  /** Show navigation arrows. Default: true. */
  arrows?: boolean;
  /** Show dot indicators. Default: true. */
  dots?: boolean;
  /** Pause autoplay on hover/focus. Default: true. */
  pauseOnHover?: boolean;
}
