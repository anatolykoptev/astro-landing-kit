<script lang="ts">
  interface Props {
    items: { title: string; description: string }[];
    defaultOpen?: number;
  }
  let { items, defaultOpen = 0 }: Props = $props();
  let openIndex = $state<number | null>(defaultOpen);
  let buttonEls: HTMLButtonElement[] = [];

  function toggle(i: number) {
    openIndex = openIndex === i ? null : i;
  }

  function onKeydown(e: KeyboardEvent, i: number) {
    const last = items.length - 1;
    let target: number | null = null;
    switch (e.key) {
      case 'ArrowDown': target = i < last ? i + 1 : 0; break;
      case 'ArrowUp':   target = i > 0 ? i - 1 : last; break;
      case 'Home':      target = 0; break;
      case 'End':       target = last; break;
      case 'Enter':
      case ' ':         e.preventDefault(); toggle(i); return;
    }
    if (target !== null) {
      e.preventDefault();
      buttonEls[target]?.focus();
    }
  }
</script>

<div class="space-y-2" role="region" aria-label="Frequently asked questions">
  {#each items as item, i}
    <div class="rounded-xl border transition-colors" class:border-primary={openIndex === i}>
      <h3>
        <button
          bind:this={buttonEls[i]}
          onclick={() => toggle(i)}
          onkeydown={(e) => onKeydown(e, i)}
          aria-expanded={openIndex === i}
          aria-controls="faq-panel-{i}"
          id="faq-button-{i}"
          class="w-full flex items-center justify-between gap-4 p-4 text-left"
        >
          <span class="font-semibold">{item.title}</span>
          <span class="shrink-0 transition-transform duration-200" style:transform="rotate({openIndex === i ? '45deg' : '0deg'})" aria-hidden="true">+</span>
        </button>
      </h3>
      {#if openIndex === i}
        <div
          id="faq-panel-{i}"
          role="region"
          aria-labelledby="faq-button-{i}"
          class="px-4 pb-4"
        >
          <p class="text-muted">{item.description}</p>
        </div>
      {/if}
    </div>
  {/each}
</div>
