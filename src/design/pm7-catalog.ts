export interface CatalogEntry {
  name: string;
  description: string;
  variants: string[];
  sizes: string[];
  cssClass: string;
  html: string;
  notes: string;
}

const catalog: CatalogEntry[] = [
  {
    name: 'button',
    description: 'Interactive button with multiple style variants',
    variants: ['primary', 'secondary', 'destructive', 'ghost', 'outline', 'link'],
    sizes: ['sm', 'md', 'lg'],
    cssClass: 'pm7-button',
    html: `<button class="pm7-button pm7-button--primary pm7-button--md">Click me</button>`,
    notes: 'Use --primary for main CTA, --ghost for nav, --outline for secondary actions. Add pm7-button--full for full-width. Icon-only: pm7-button--icon.',
  },
  {
    name: 'card',
    description: 'Content container with elevation and border variants',
    variants: ['elevated', 'outlined', 'ghost', 'hoverable', 'success', 'warning', 'error', 'info'],
    sizes: [],
    cssClass: 'pm7-card',
    html: `<div class="pm7-card pm7-card--elevated">
  <div class="pm7-card-header"><h3>Title</h3></div>
  <div class="pm7-card-body"><p>Content</p></div>
  <div class="pm7-card-footer"><button class="pm7-button pm7-button--primary">Action</button></div>
</div>`,
    notes: 'Use --elevated for pricing/feature cards, --outlined for lighter feel. Grid: pm7-card-grid-2, pm7-card-grid-3, pm7-card-grid-4. Add --hoverable for interactive cards.',
  },
  {
    name: 'accordion',
    description: 'Expandable content sections for FAQs and details',
    variants: ['compact', 'flush', 'separated'],
    sizes: ['sm', 'md', 'lg'],
    cssClass: 'pm7-accordion',
    html: `<div class="pm7-accordion">
  <div class="pm7-accordion-item" data-state="open">
    <button class="pm7-accordion-trigger" aria-expanded="true">Question?</button>
    <div class="pm7-accordion-content"><p>Answer.</p></div>
  </div>
</div>`,
    notes: 'Requires accordion.js for toggle behavior. Use data-state="open" for default-open items. --flush removes borders, --separated adds gaps between items.',
  },
  {
    name: 'dialog',
    description: 'Modal dialog for forms, confirmations, and alerts',
    variants: ['alert', 'success', 'loading'],
    sizes: ['sm', 'md', 'lg', 'xl', 'full'],
    cssClass: 'pm7-dialog',
    html: `<div class="pm7-dialog pm7-dialog--md" data-state="open">
  <div class="pm7-dialog-header">
    <h2>Dialog Title</h2>
    <button class="pm7-dialog-close">&times;</button>
  </div>
  <div class="pm7-dialog-body"><p>Content here</p></div>
  <div class="pm7-dialog-footer">
    <button class="pm7-button pm7-button--ghost">Cancel</button>
    <button class="pm7-button pm7-button--primary">Confirm</button>
  </div>
</div>`,
    notes: 'Requires dialog.js. Use --sm for confirmations, --md for forms, --lg for complex content. data-state="open"/"closed" controls visibility.',
  },
  {
    name: 'callout',
    description: 'Alert/notification banner with semantic variants',
    variants: ['info', 'warning', 'danger', 'success', 'neutral', 'tip'],
    sizes: [],
    cssClass: 'pm7-callout',
    html: `<div class="pm7-callout pm7-callout--info">
  <div class="pm7-callout-title">Note</div>
  <div class="pm7-callout-body">Important information here.</div>
</div>`,
    notes: 'Use for announcements, warnings, tips on landing pages. Add pm7-callout--pulse for attention-grabbing animation.',
  },
  {
    name: 'input',
    description: 'Text input field with validation states',
    variants: ['error', 'success', 'disabled'],
    sizes: ['sm', 'md', 'lg'],
    cssClass: 'pm7-input',
    html: `<div class="pm7-form-group">
  <label class="pm7-label">Email</label>
  <input type="email" class="pm7-input" placeholder="you@example.com" />
  <span class="pm7-helper-text">We'll never share your email.</span>
</div>`,
    notes: 'Use pm7-label for labels, pm7-helper-text for help text. Error state: add pm7-input--error + pm7-helper-text--error.',
  },
  {
    name: 'checkbox',
    description: 'Checkbox with label',
    variants: ['error'],
    sizes: ['sm', 'md'],
    cssClass: 'pm7-checkbox',
    html: `<label class="pm7-checkbox">
  <input type="checkbox" />
  <span>I agree to terms</span>
</label>`,
    notes: 'Wrap input + label text in .pm7-checkbox container. data-checked for controlled state.',
  },
  {
    name: 'radio',
    description: 'Radio button group',
    variants: [],
    sizes: ['sm', 'md'],
    cssClass: 'pm7-radio',
    html: `<div class="pm7-radio-group">
  <label class="pm7-radio"><input type="radio" name="plan" value="free" /><span>Free</span></label>
  <label class="pm7-radio"><input type="radio" name="plan" value="pro" /><span>Pro</span></label>
</div>`,
    notes: 'Group radios in .pm7-radio-group. Each radio: .pm7-radio wrapping input + span.',
  },
  {
    name: 'select',
    description: 'Dropdown select input',
    variants: ['error'],
    sizes: ['sm', 'md', 'lg'],
    cssClass: 'pm7-select',
    html: `<select class="pm7-select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>`,
    notes: 'Native select with pm7 styling. Combine with pm7-label and pm7-form-group.',
  },
  {
    name: 'switch',
    description: 'Toggle switch for on/off states',
    variants: [],
    sizes: ['sm', 'md'],
    cssClass: 'pm7-switch',
    html: `<label class="pm7-switch">
  <input type="checkbox" />
  <span class="pm7-switch-slider"></span>
  <span>Dark mode</span>
</label>`,
    notes: 'Use for binary toggles. data-checked for controlled state.',
  },
  {
    name: 'tabs',
    description: 'Tab navigation for content switching',
    variants: ['pills', 'solid', 'full-width'],
    sizes: [],
    cssClass: 'pm7-tab-selector',
    html: `<div class="pm7-tab-selector">
  <button class="pm7-tab" data-state="active">Tab 1</button>
  <button class="pm7-tab">Tab 2</button>
  <button class="pm7-tab">Tab 3</button>
</div>`,
    notes: 'Requires tab-selector.js. Use --pills for rounded tabs, --solid for filled background. data-state="active" marks selected tab.',
  },
  {
    name: 'menu',
    description: 'Dropdown menu with items, submenus, and dividers',
    variants: ['flat', 'flat-hover'],
    sizes: [],
    cssClass: 'pm7-menu',
    html: `<div class="pm7-menu">
  <button class="pm7-menu-item">Action 1</button>
  <button class="pm7-menu-item">Action 2</button>
  <div class="pm7-menu-divider"></div>
  <button class="pm7-menu-item pm7-menu-item--danger">Delete</button>
</div>`,
    notes: 'Requires menu.js. Supports submenus, checkbox items, radio items. --flat removes background.',
  },
  {
    name: 'sidebar',
    description: 'Navigation sidebar with collapsible sections',
    variants: ['compact', 'mini', 'floating', 'static'],
    sizes: [],
    cssClass: 'pm7-sidebar',
    html: `<aside class="pm7-sidebar">
  <div class="pm7-sidebar-header"><h2>App</h2></div>
  <nav class="pm7-sidebar-nav">
    <a class="pm7-sidebar-item pm7-sidebar-item--active" href="#">Home</a>
    <a class="pm7-sidebar-item" href="#">Settings</a>
  </nav>
</aside>`,
    notes: 'Unlikely needed for landing pages. Use for admin/dashboard layouts if landing-kit is extended.',
  },
  {
    name: 'toast',
    description: 'Temporary notification popup',
    variants: ['success', 'error', 'warning', 'info'],
    sizes: [],
    cssClass: 'pm7-toast',
    html: `<div class="pm7-toast pm7-toast--success">
  <span class="pm7-toast-message">Form submitted successfully!</span>
  <button class="pm7-toast-close">&times;</button>
</div>`,
    notes: 'Requires toast.js. Use after form submission or async actions. Position: top-right by default.',
  },
  {
    name: 'tooltip',
    description: 'Hover tooltip for additional context',
    variants: [],
    sizes: [],
    cssClass: 'pm7-tooltip',
    html: `<span class="pm7-tooltip" data-tooltip="More information here">Hover me</span>`,
    notes: 'Requires tooltip.js. Use data-tooltip attribute for content. Positions: data-tooltip-position="top|bottom|left|right".',
  },
  {
    name: 'gradient-border',
    description: 'Decorative gradient border utility',
    variants: ['blue', 'green', 'red', 'primary'],
    sizes: [],
    cssClass: 'pm7-gradient-border',
    html: `<div class="pm7-gradient-border pm7-gradient-border--primary">
  <div class="pm7-card pm7-card--elevated">Premium content</div>
</div>`,
    notes: 'Wrap any element for a gradient border effect. Good for highlighting premium pricing cards or featured sections.',
  },
  {
    name: 'theme-switch',
    description: 'Light/dark mode toggle button',
    variants: [],
    sizes: [],
    cssClass: 'pm7-theme-switch',
    html: `<button class="pm7-theme-switch" aria-label="Toggle theme">
  <span class="pm7-theme-switch-icon"></span>
</button>`,
    notes: 'Sun/moon icon toggle. Pairs with landing-kit dark mode resolver. CSS vars: --pm7-theme-switch-sun-color, --pm7-theme-switch-moon-color.',
  },
];

/** Search components by query — matches against name, description, variants, notes */
export function searchComponents(query: string): CatalogEntry[] {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  if (words.length === 0) return catalog;

  const scored = catalog.map(entry => {
    const haystack = [
      entry.name,
      entry.description,
      entry.variants.join(' '),
      entry.notes,
      entry.cssClass,
    ].join(' ').toLowerCase();

    const score = words.reduce((s, w) => s + (haystack.includes(w) ? 1 : 0), 0);
    return { entry, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.entry);
}

/** Get a component by exact name */
export function getComponent(name: string): CatalogEntry | undefined {
  return catalog.find(c => c.name === name);
}

/** List all component names */
export function listComponents(): string[] {
  return catalog.map(c => c.name);
}
