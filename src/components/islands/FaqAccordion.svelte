<script lang="ts">
  interface Props {
    items: { title: string; description: string }[];
    defaultOpen?: number;
  }
  let { items, defaultOpen = 0 }: Props = $props();
  let openIndex = $state<number | null>(defaultOpen);

  function toggle(i: number) {
    openIndex = openIndex === i ? null : i;
  }
</script>

<div class="space-y-2">
  {#each items as item, i}
    <div class="rounded-xl border transition-colors" class:border-primary={openIndex === i}>
      <button
        onclick={() => toggle(i)}
        aria-expanded={openIndex === i}
        class="w-full flex items-center justify-between gap-4 p-4 text-left"
      >
        <span class="font-semibold">{item.title}</span>
        <span class="shrink-0 transition-transform duration-200" style:transform="rotate({openIndex === i ? '45deg' : '0deg'})">+</span>
      </button>
      {#if openIndex === i}
        <div class="px-4 pb-4">
          <p class="text-muted">{item.description}</p>
        </div>
      {/if}
    </div>
  {/each}
</div>
