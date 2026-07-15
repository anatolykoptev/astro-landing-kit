<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    stats: { amount?: number | string; title?: string; icon?: string }[];
    duration?: number;
  }
  let { stats, duration = 2 }: Props = $props();

  let displayed = $state<string[]>(stats.map(() => '0'));
  let el: HTMLElement;

  onMount(async () => {
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    stats.forEach((stat, i) => {
      const target = typeof stat.amount === 'number' ? stat.amount : parseFloat(String(stat.amount).replace(/[^0-9.]/g, ''));
      const suffix = typeof stat.amount === 'string' ? stat.amount.replace(/[0-9.,]/g, '') : '';
      if (isNaN(target)) { displayed[i] = String(stat.amount); return; }

      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        onUpdate: () => { displayed[i] = Math.round(obj.val).toLocaleString() + suffix; },
      });
    });
  });
</script>

<div bind:this={el} class="grid grid-cols-2 md:grid-cols-4 gap-8">
  {#each stats as stat, i}
    <div class="text-center">
      <div class="text-4xl font-bold">{displayed[i]}</div>
      <div class="text-sm text-muted mt-1">{stat.title}</div>
    </div>
  {/each}
</div>
