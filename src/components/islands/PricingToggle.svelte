<script lang="ts">
  interface TogglePrice {
    title?: string;
    subtitle?: string;
    description?: string;
    price?: number | string;
    period?: string;
    annualPrice?: number | string;
    annualPeriod?: string;
    items?: Array<{ title?: string; description?: string; icon?: string | null }>;
    callToAction?: { text?: string; href?: string | URL | null; variant?: string };
    hasRibbon?: boolean;
    ribbonTitle?: string;
    annualFeatures?: Array<string>;
    ctaMonthly?: string;
    ctaAnnual?: string;
  }

  interface Props {
    prices: TogglePrice[];
    monthlyLabel?: string;
    annualLabel?: string;
    annualBadge?: string;
    showSavings?: boolean;
    defaultAnnual?: boolean;
  }

  let {
    prices,
    monthlyLabel = 'Monthly',
    annualLabel = 'Annual',
    annualBadge = '',
    showSavings = true,
    defaultAnnual = false,
  }: Props = $props();

  let isAnnual = $state(defaultAnnual);

  function numericPrice(plan: TogglePrice): number {
    const p = isAnnual && plan.annualPrice != null ? plan.annualPrice : plan.price;
    return typeof p === 'number' ? p : parseFloat(String(p)) || 0;
  }

  function displayPrice(plan: TogglePrice): string {
    const p = isAnnual && plan.annualPrice != null ? plan.annualPrice : plan.price;
    if (typeof p === 'number') return String(p);
    return String(p ?? '');
  }

  function savingsFor(plan: TogglePrice): { percent: number; amount: number } | null {
    if (!showSavings) return null;
    const monthly = typeof plan.price === 'number' ? plan.price : parseFloat(String(plan.price)) || 0;
    const annual = typeof plan.annualPrice === 'number' ? plan.annualPrice : parseFloat(String(plan.annualPrice)) || 0;
    if (!monthly || !annual) return null;
    const monthlyAnnual = monthly * 12;
    const annualAnnual = annual * 12;
    const amount = monthlyAnnual - annualAnnual;
    if (amount <= 0) return null;
    const percent = Math.round((amount / monthlyAnnual) * 100);
    return { percent, amount: Math.round(amount) };
  }

  function ctaText(plan: TogglePrice): string {
    if (isAnnual && plan.ctaAnnual) return plan.ctaAnnual;
    if (!isAnnual && plan.ctaMonthly) return plan.ctaMonthly;
    return plan.callToAction?.text ?? 'Choose plan';
  }
</script>

<div class="max-w-7xl mx-auto">
  <!-- Toggle switch -->
  <div class="flex items-center justify-center gap-4 mb-10">
    <span class={!isAnnual ? 'font-bold text-primary' : 'text-muted'}>{monthlyLabel}</span>
    <button
      type="button"
      role="switch"
      aria-checked={isAnnual}
      aria-label="Toggle billing period"
      class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors {isAnnual ? 'bg-primary' : 'bg-hairline'}"
      onclick={() => (isAnnual = !isAnnual)}
    >
      <span
        class="inline-block h-5 w-5 transform rounded-full bg-page transition-transform"
        style:transform={isAnnual ? 'translateX(22px)' : 'translateX(2px)'}
      ></span>
    </button>
    <span class={isAnnual ? 'font-bold text-primary' : 'text-muted'}>
      {annualLabel}
      {#if annualBadge}<span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-on-primary">{annualBadge}</span>{/if}
    </span>
  </div>

  <!-- Price cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each prices as plan, i}
      {@const savings = savingsFor(plan)}
      <div class="relative rounded-xl border border-hairline bg-page shadow-lg p-6 flex flex-col text-center">
        {#if plan.hasRibbon && plan.ribbonTitle}
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold uppercase rounded-full bg-primary text-on-primary">
            {plan.ribbonTitle}
          </div>
        {/if}
        {#if plan.title}
          <h3 class="text-xl font-semibold uppercase tracking-wider mb-2">{plan.title}</h3>
        {/if}
        {#if plan.subtitle}
          <p class="text-sm text-muted mb-6">{plan.subtitle}</p>
        {/if}
        <div class="my-6 h-24 flex flex-col items-center justify-center">
          <div class="flex items-center justify-center mb-1">
            <span class="text-4xl">$</span>
            <span class="text-5xl font-extrabold tabular-nums price-animate" key={isAnnual ? 'annual' : 'monthly'}>
              {displayPrice(plan)}
            </span>
          </div>
          <span class="text-sm text-muted">
            {isAnnual && plan.annualPeriod ? plan.annualPeriod : plan.period}
          </span>
          {#if savings && isAnnual}
            <span class="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
              Save {savings.percent}% — ${savings.amount}/yr
            </span>
          {/if}
        </div>
        {#if plan.items}
          <ul class="my-6 space-y-2 text-left">
            {#each plan.items as item}
              {#if item.description}
                <li class="flex items-start gap-2 leading-7">
                  <span class="rounded-full bg-primary mt-1 w-5 h-5 flex items-center justify-center text-on-primary text-xs shrink-0">✓</span>
                  <span>{item.description}</span>
                </li>
              {/if}
            {/each}
            {#if isAnnual && plan.annualFeatures}
              {#each plan.annualFeatures as feat}
                <li class="flex items-start gap-2 leading-7 animate-[fadeIn_0.3s_ease-out]">
                  <span class="rounded-full bg-primary mt-1 w-5 h-5 flex items-center justify-center text-on-primary text-xs shrink-0">✓</span>
                  <span class="text-primary dark:text-primary">{feat}</span>
                </li>
              {/each}
            {/if}
          </ul>
        {/if}
        {#if plan.callToAction?.href}
          <div class="mt-auto pt-4">
            <a
              href={plan.callToAction.href}
              class="inline-block px-6 py-2.5 rounded-lg font-semibold transition-colors {plan.hasRibbon ? 'bg-primary text-on-primary hover:bg-primary/90' : 'border border-hairline hover:bg-surface-hover'}"
            >
              {ctaText(plan)}
            </a>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes priceSwap {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .price-animate {
    animation: priceSwap 0.25s ease-out;
  }
  @media (prefers-reduced-motion: reduce) {
    .price-animate { animation: none; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  }
</style>
