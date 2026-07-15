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
  }

  interface Props {
    prices: TogglePrice[];
    monthlyLabel?: string;
    annualLabel?: string;
    annualBadge?: string;
  }

  let {
    prices,
    monthlyLabel = 'Monthly',
    annualLabel = 'Annual',
    annualBadge = '',
  }: Props = $props();

  let isAnnual = $state(false);
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
      class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors {isAnnual ? 'bg-primary' : 'bg-gray-300'}"
      onclick={() => (isAnnual = !isAnnual)}
    >
      <span
        class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
        style:transform={isAnnual ? 'translateX(22px)' : 'translateX(2px)'}
      ></span>
    </button>
    <span class={isAnnual ? 'font-bold text-primary' : 'text-muted'}>
      {annualLabel}
      {#if annualBadge}<span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-white">{annualBadge}</span>{/if}
    </span>
  </div>

  <!-- Price cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each prices as plan}
      <div class="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 shadow p-6 flex flex-col text-center">
        {#if plan.hasRibbon && plan.ribbonTitle}
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold uppercase rounded-full bg-primary text-white">
            {plan.ribbonTitle}
          </div>
        {/if}
        {#if plan.title}
          <h3 class="text-xl font-semibold uppercase tracking-wider mb-2">{plan.title}</h3>
        {/if}
        {#if plan.subtitle}
          <p class="text-sm text-muted mb-6">{plan.subtitle}</p>
        {/if}
        <div class="my-6">
          <div class="flex items-center justify-center mb-1">
            <span class="text-4xl">$</span>
            <span class="text-5xl font-extrabold">
              {isAnnual && plan.annualPrice != null ? plan.annualPrice : plan.price}
            </span>
          </div>
          <span class="text-sm text-muted">
            {isAnnual && plan.annualPeriod ? plan.annualPeriod : plan.period}
          </span>
        </div>
        {#if plan.items}
          <ul class="my-6 space-y-2 text-left">
            {#each plan.items as item}
              {#if item.description}
                <li class="flex items-start gap-2 leading-7">
                  <span class="rounded-full bg-primary mt-1 w-5 h-5 flex items-center justify-center text-white text-xs shrink-0">✓</span>
                  <span>{item.description}</span>
                </li>
              {/if}
            {/each}
          </ul>
        {/if}
        {#if plan.callToAction?.href}
          <div class="mt-auto pt-4">
            <a
              href={plan.callToAction.href}
              class="inline-block px-6 py-2.5 rounded-lg font-semibold {plan.hasRibbon ? 'bg-primary text-white' : 'border border-gray-300 dark:border-gray-600'}"
            >
              {plan.callToAction.text ?? 'Choose plan'}
            </a>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
