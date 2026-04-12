export interface SectionRecipe {
  name: string;
  description: string;
  widget: string;
  pm7Classes: string[];
  layout: string;
  html: string;
  notes: string;
}

const recipes: SectionRecipe[] = [
  {
    name: 'hero-centered',
    description: 'Centered hero with tagline, title, subtitle, and CTA buttons',
    widget: 'Hero.astro',
    pm7Classes: ['pm7-button--primary', 'pm7-button--ghost'],
    layout: 'text-center max-w-5xl mx-auto',
    html: `<section class="relative py-12 md:py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="text-center max-w-5xl mx-auto">
      <p class="text-base font-bold tracking-wide uppercase text-primary">Tagline</p>
      <h1 class="text-5xl md:text-6xl font-bold leading-tighter tracking-tighter mb-4">
        Main <span class="text-primary">headline</span>
      </h1>
      <p class="text-xl text-muted mb-6 max-w-3xl mx-auto">Supporting subtitle text.</p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <button class="pm7-button pm7-button--primary pm7-button--lg">Get Started</button>
        <button class="pm7-button pm7-button--ghost pm7-button--lg">Learn More</button>
      </div>
    </div>
  </div>
</section>`,
    notes: 'Default hero layout. Use Hero.astro widget with actions prop. Primary button for main CTA, ghost for secondary. Works with any DESIGN.md theme via --color-primary.',
  },
  {
    name: 'hero-split',
    description: 'Split hero with text on left, image on right',
    widget: 'Hero2.astro',
    pm7Classes: ['pm7-button--primary', 'pm7-button--outline'],
    layout: 'grid grid-cols-1 md:grid-cols-2 gap-8 items-center',
    html: `<section class="relative py-12 md:py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <p class="text-base font-bold tracking-wide uppercase text-primary">Tagline</p>
        <h1 class="text-4xl md:text-5xl font-bold leading-tighter mb-4">Headline here</h1>
        <p class="text-lg text-muted mb-6">Description paragraph.</p>
        <div class="flex gap-4">
          <button class="pm7-button pm7-button--primary">Get Started</button>
          <button class="pm7-button pm7-button--outline">Demo</button>
        </div>
      </div>
      <div><img src="/hero.png" alt="Hero" class="rounded-lg shadow-xl" /></div>
    </div>
  </div>
</section>`,
    notes: 'Use Hero2.astro widget. Good for product pages where a screenshot/illustration is important. Image side can also be a video or interactive demo.',
  },
  {
    name: 'features-grid',
    description: '2-3 column grid of feature cards with icons',
    widget: 'Features.astro',
    pm7Classes: ['pm7-card--ghost'],
    layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    html: `<section class="py-12 md:py-20">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-12">
      <p class="text-base font-bold tracking-wide uppercase text-primary">Features</p>
      <h2 class="text-3xl md:text-4xl font-bold">What you get</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="pm7-card pm7-card--ghost">
        <div class="pm7-card-body">
          <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mb-4">✓</div>
          <h3 class="text-lg font-semibold mb-2">Feature Title</h3>
          <p class="text-muted">Feature description goes here.</p>
        </div>
      </div>
      <!-- repeat for each feature -->
    </div>
  </div>
</section>`,
    notes: 'Use Features.astro with items prop. pm7-card--ghost for borderless clean look, --outlined for defined cards. 2 columns for 4 features, 3 for 6+.',
  },
  {
    name: 'features-alternating',
    description: 'Alternating left/right feature blocks with images',
    widget: 'Content.astro',
    pm7Classes: [],
    layout: 'space-y-16',
    html: `<section class="py-12 md:py-20">
  <div class="max-w-6xl mx-auto px-4 space-y-16">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h3 class="text-2xl font-bold mb-4">Feature One</h3>
        <p class="text-muted mb-4">Detailed description.</p>
        <ul class="space-y-2 text-muted">
          <li class="flex items-center gap-2"><span class="text-primary">✓</span> Benefit 1</li>
          <li class="flex items-center gap-2"><span class="text-primary">✓</span> Benefit 2</li>
        </ul>
      </div>
      <div><img src="/feature1.png" alt="Feature" class="rounded-lg" /></div>
    </div>
    <!-- next block: image left, text right (reverse grid order) -->
  </div>
</section>`,
    notes: 'Use Content.astro widget. Good for explaining complex features with screenshots. Alternate image side per row with md:order-first/md:order-last.',
  },
  {
    name: 'pricing-cards',
    description: '3-column pricing grid with highlighted recommended plan',
    widget: 'Pricing.astro',
    pm7Classes: ['pm7-card--elevated', 'pm7-card--outlined', 'pm7-button--primary', 'pm7-button--outline', 'pm7-gradient-border--primary'],
    layout: 'grid grid-cols-1 md:grid-cols-3 gap-8',
    html: `<section class="py-12 md:py-20">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold">Pricing</h2>
      <p class="text-muted mt-2">Choose the plan that fits you</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Basic -->
      <div class="pm7-card pm7-card--outlined">
        <div class="pm7-card-body text-center">
          <h3 class="text-xl font-semibold mb-2">Basic</h3>
          <div class="text-4xl font-bold my-4">$9<span class="text-base text-muted">/mo</span></div>
          <ul class="space-y-2 text-left mb-6">
            <li class="flex items-center gap-2"><span class="text-primary">✓</span> Feature 1</li>
          </ul>
          <button class="pm7-button pm7-button--outline pm7-button--full">Get Started</button>
        </div>
      </div>
      <!-- Pro (highlighted) -->
      <div class="pm7-gradient-border pm7-gradient-border--primary">
        <div class="pm7-card pm7-card--elevated">
          <div class="pm7-card-body text-center">
            <h3 class="text-xl font-semibold mb-2">Pro</h3>
            <div class="text-4xl font-bold my-4">$29<span class="text-base text-muted">/mo</span></div>
            <ul class="space-y-2 text-left mb-6">
              <li class="flex items-center gap-2"><span class="text-primary">✓</span> Everything in Basic</li>
              <li class="flex items-center gap-2"><span class="text-primary">✓</span> Priority support</li>
            </ul>
            <button class="pm7-button pm7-button--primary pm7-button--full">Get Started</button>
          </div>
        </div>
      </div>
      <!-- Enterprise -->
      <div class="pm7-card pm7-card--outlined">
        <div class="pm7-card-body text-center">
          <h3 class="text-xl font-semibold mb-2">Enterprise</h3>
          <div class="text-4xl font-bold my-4">Custom</div>
          <button class="pm7-button pm7-button--outline pm7-button--full">Contact Us</button>
        </div>
      </div>
    </div>
  </div>
</section>`,
    notes: 'Use Pricing.astro widget or build custom. Highlight recommended plan with pm7-gradient-border. --elevated for featured card, --outlined for others. Always use --full width buttons in pricing cards.',
  },
  {
    name: 'faq-accordion',
    description: 'FAQ section with expandable accordion items',
    widget: 'FAQs.astro',
    pm7Classes: ['pm7-accordion', 'pm7-accordion--separated'],
    layout: 'max-w-3xl mx-auto',
    html: `<section class="py-12 md:py-20">
  <div class="max-w-3xl mx-auto px-4">
    <div class="text-center mb-12">
      <p class="text-base font-bold tracking-wide uppercase text-primary">FAQ</p>
      <h2 class="text-3xl md:text-4xl font-bold">Common questions</h2>
    </div>
    <div class="pm7-accordion pm7-accordion--separated">
      <div class="pm7-accordion-item" data-state="open">
        <button class="pm7-accordion-trigger" aria-expanded="true">
          <span>Question one?</span>
          <span class="pm7-accordion-icon">+</span>
        </button>
        <div class="pm7-accordion-content"><p class="text-muted">Answer one.</p></div>
      </div>
      <div class="pm7-accordion-item">
        <button class="pm7-accordion-trigger" aria-expanded="false">
          <span>Question two?</span>
          <span class="pm7-accordion-icon">+</span>
        </button>
        <div class="pm7-accordion-content"><p class="text-muted">Answer two.</p></div>
      </div>
    </div>
  </div>
</section>`,
    notes: 'Requires vendor/pm7/accordion.js. Use pm7 accordion instead of custom Svelte FaqAccordion for CSS-only animations. --separated adds visual gaps. Import JS in the Astro page: <script>import "vendor/pm7/accordion.js"</script>.',
  },
  {
    name: 'cta-banner',
    description: 'Call-to-action banner with title, subtitle, and buttons',
    widget: 'CallToAction.astro',
    pm7Classes: ['pm7-button--primary', 'pm7-card--elevated'],
    layout: 'text-center max-w-3xl mx-auto',
    html: `<section class="py-12 md:py-20">
  <div class="max-w-6xl mx-auto px-4">
    <div class="pm7-card pm7-card--elevated">
      <div class="pm7-card-body text-center py-12 px-8">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
        <p class="text-lg text-muted mb-6 max-w-xl mx-auto">Start building your landing page in minutes.</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button class="pm7-button pm7-button--primary pm7-button--lg">Get Started</button>
          <button class="pm7-button pm7-button--ghost pm7-button--lg">Learn More</button>
        </div>
      </div>
    </div>
  </div>
</section>`,
    notes: 'Use CallToAction.astro or build custom. Wrapping in pm7-card--elevated gives the CTA a distinct visual block. For dark backgrounds, add isDark=true to WidgetWrapper.',
  },
  {
    name: 'testimonials-carousel',
    description: 'Customer testimonial cards in a grid or carousel',
    widget: 'Testimonials.astro',
    pm7Classes: ['pm7-card--outlined'],
    layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    html: `<section class="py-12 md:py-20 bg-gray-50 dark:bg-slate-900">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold">What people say</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="pm7-card pm7-card--outlined">
        <div class="pm7-card-body">
          <p class="text-muted italic mb-4">"This tool changed how we work."</p>
          <div class="flex items-center gap-3">
            <img src="/avatar.jpg" alt="Jane" class="w-10 h-10 rounded-full" />
            <div>
              <p class="font-semibold text-sm">Jane Doe</p>
              <p class="text-xs text-muted">CEO, Acme Inc</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
    notes: 'Use Testimonials.astro widget. pm7-card--outlined for clean look. Add subtle background (bg-gray-50) to differentiate section. 2 cols for 2-4 testimonials, 3 for 6+.',
  },
  {
    name: 'stats-counter',
    description: 'Key metrics displayed in a horizontal row',
    widget: 'Stats.astro',
    pm7Classes: [],
    layout: 'grid grid-cols-2 md:grid-cols-4 gap-8 text-center',
    html: `<section class="py-12 md:py-16">
  <div class="max-w-5xl mx-auto px-4">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div class="text-4xl font-bold text-primary">100+</div>
        <div class="text-sm text-muted mt-1">Customers</div>
      </div>
      <div>
        <div class="text-4xl font-bold text-primary">99%</div>
        <div class="text-sm text-muted mt-1">Uptime</div>
      </div>
    </div>
  </div>
</section>`,
    notes: 'Use Stats.astro widget or StatsCounter.svelte island for animated counting. No pm7 classes needed — this is layout + typography. Use text-primary for numbers to tie to design tokens.',
  },
  {
    name: 'contact-form',
    description: 'Contact form with pm7 form controls and honeypot protection',
    widget: 'Contact.astro (or custom)',
    pm7Classes: ['pm7-input', 'pm7-label', 'pm7-form-group', 'pm7-button--primary', 'pm7-card--elevated'],
    layout: 'max-w-lg mx-auto',
    html: `<section class="py-12 md:py-20">
  <div class="max-w-lg mx-auto px-4">
    <div class="pm7-card pm7-card--elevated">
      <div class="pm7-card-body">
        <h2 class="text-2xl font-bold mb-6 text-center">Get in touch</h2>
        <form class="space-y-4">
          <div class="pm7-form-group">
            <label class="pm7-label">Name *</label>
            <input type="text" class="pm7-input" placeholder="Your name" required />
          </div>
          <div class="pm7-form-group">
            <label class="pm7-label">Email *</label>
            <input type="email" class="pm7-input" placeholder="you@company.com" required />
          </div>
          <div class="pm7-form-group">
            <label class="pm7-label">Message *</label>
            <textarea class="pm7-input" rows="4" placeholder="How can we help?" required></textarea>
          </div>
          <!-- honeypot -->
          <div style="position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden;" aria-hidden="true">
            <input tabindex="-1" autocomplete="off" name="website" />
          </div>
          <button type="submit" class="pm7-button pm7-button--primary pm7-button--full">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>`,
    notes: 'Use ContactForm.svelte island for interactive submission, or static HTML + server endpoint. pm7 form controls (pm7-input, pm7-label) replace custom Tailwind form styling. Always include honeypot field.',
  },
];

/** Search section recipes by query */
export function searchSections(query: string): SectionRecipe[] {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  if (words.length === 0) return recipes;

  const scored = recipes.map(recipe => {
    const haystack = [
      recipe.name,
      recipe.description,
      recipe.widget,
      recipe.pm7Classes.join(' '),
      recipe.notes,
    ].join(' ').toLowerCase();

    const score = words.reduce((s, w) => s + (haystack.includes(w) ? 1 : 0), 0);
    return { recipe, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.recipe);
}

/** Get a recipe by exact name */
export function getSection(name: string): SectionRecipe | undefined {
  return recipes.find(r => r.name === name);
}

/** List all recipe names */
export function listSections(): string[] {
  return recipes.map(r => r.name);
}
