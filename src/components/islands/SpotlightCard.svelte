<script lang="ts">
  /**
   * SpotlightCard — card with cursor-tracking radial glow.
   *
   * A soft radial gradient follows the cursor inside the card.
   * Used by Apple, Linear, Vercel for premium card hover effects.
   * ~20 lines of Svelte 5, 0 dependencies.
   *
   * Usage:
   *   <SpotlightCard color="var(--aw-color-primary)" radius="300px">
   *     <h3>Card title</h3>
   *     <p>Card content</p>
   *   </SpotlightCard>
   *
   * Props:
   *   color  — CSS color for the glow, default var(--aw-color-primary)
   *   radius — glow radius, default 250px
   *   opacity — glow opacity, default 0.08
   */
  interface Props {
    color?: string;
    radius?: string;
    opacity?: number;
    class?: string;
  }

  let {
    color = 'var(--aw-color-primary)',
    radius = '250px',
    opacity = 0.08,
    class: className = '',
  }: Props = $props();

  let el: HTMLElement;
  let x = $state(0);
  let y = $state(0);
  let visible = $state(false);

  function onMove(e: MouseEvent) {
    const rect = el.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  const style = $derived(
    visible
      ? `--spot-x: ${x}px; --spot-y: ${y}px; --spot-color: ${color}; --spot-radius: ${radius}; --spot-opacity: ${opacity};`
      : `--spot-color: ${color}; --spot-radius: ${radius}; --spot-opacity: ${opacity};`,
  );
</script>

<div
  bind:this={el}
  class={`spotlight-card group ${className}`}
  style={style}
  onpointermove={onMove}
  onpointerenter={() => (visible = true)}
  onpointerleave={() => (visible = false)}
>
  <div
    class="spotlight-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    style="background: radial-gradient(var(--spot-radius) circle at var(--spot-x) var(--spot-y), var(--spot-color), transparent 70%); opacity: var(--spot-opacity);"
  >
  </div>
  <div class="relative z-10">
    <slot />
  </div>
</div>

<style>
  .spotlight-card {
    position: relative;
    overflow: hidden;
    border-radius: inherit;
  }
</style>
