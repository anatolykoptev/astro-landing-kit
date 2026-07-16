<script lang="ts">
  /**
   * NumberFlow — animated number counter, 0 dependencies.
   *
   * Replaces GSAP StatsCounter (200KB) with ~30 lines of Svelte 5 runes.
   * Uses IntersectionObserver to trigger on view, requestAnimationFrame
   * for smooth easing. Respects prefers-reduced-motion (shows final value).
   *
   * Usage:
   *   <NumberFlow value={4200} suffix="+" />
   *   <NumberFlow value={99.9} decimals={1} suffix="%" />
   */
  import { onMount } from 'svelte';

  interface Props {
    value: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    class?: string;
  }

  let {
    value,
    duration = 2000,
    decimals = 0,
    prefix = '',
    suffix = '',
    class: className = '',
  }: Props = $props();

  let displayed = $state(0);
  let el: HTMLElement;

  onMount(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      displayed = value;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out-cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            displayed = value * eased;

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              displayed = value;
            }
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  });

  const formatted = $derived(
    prefix +
      displayed.toLocaleString('en', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix,
  );
</script>

<span bind:this={el} class={className}>{formatted}</span>
