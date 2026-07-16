<script lang="ts">
  /**
   * MagneticButton — button that subtly follows the cursor.
   *
   * Linear, Vercel, Rauno.me — subtle magnetic hover everywhere in 2025-2026.
   * ~30 lines of Svelte 5, 0 dependencies. The button shifts by a fraction
   * of the cursor's offset from center, creating a "magnetic" pull.
   *
   * Usage:
   *   <MagneticButton strength={0.3}>
   *     <a href="/docs" class="btn-primary">Get started</a>
   *   </MagneticButton>
   *
   * Props:
   *   strength — 0-1, how much the button follows cursor, default 0.25
   *   max      — max shift in px, default 12
   */
  interface Props {
    strength?: number;
    max?: number;
    class?: string;
  }

  let {
    strength = 0.25,
    max = 12,
    class: className = '',
  }: Props = $props();

  let el: HTMLElement;
  let dx = $state(0);
  let dy = $state(0);

  function onMove(e: MouseEvent) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rawX = (e.clientX - cx) * strength;
    const rawY = (e.clientY - cy) * strength;
    dx = Math.max(-max, Math.min(max, rawX));
    dy = Math.max(-max, Math.min(max, rawY));
  }

  function onLeave() {
    dx = 0;
    dy = 0;
  }

  const style = $derived(`transform: translate(${dx}px, ${dy}px);`);
</script>

<div
  bind:this={el}
  class={`magnetic-button inline-block transition-transform duration-200 ease-out ${className}`}
  style={style}
  onpointermove={onMove}
  onpointerleave={onLeave}
>
  <slot />
</div>
