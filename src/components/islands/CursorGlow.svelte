<script lang="ts">
  /**
   * CursorGlow — ambient page-wide cursor glow.
   *
   * A large soft radial gradient follows the cursor across the entire page.
   * Used by Rauno.me, Linear, Vercel for ambient lighting effect.
   * One island on <body>, ~15 lines, 0 dependencies.
   *
   * Usage:
   *   <CursorGlow color="var(--aw-color-primary)" />
   *
   * Props:
   *   color   — CSS color, default var(--aw-color-primary)
   *   size    — glow diameter, default 600px
   *   opacity — glow opacity, default 0.03
   *   z       — z-index, default 0 (behind content)
   */
  interface Props {
    color?: string;
    size?: string;
    opacity?: number;
    z?: number;
  }

  let {
    color = 'var(--aw-color-primary)',
    size = '600px',
    opacity = 0.03,
    z = 0,
  }: Props = $props();

  let x = $state(-1000);
  let y = $state(-1000);

  function onMove(e: MouseEvent) {
    x = e.clientX;
    y = e.clientY;
  }

  const style = $derived(
    `left: ${x}px; top: ${y}px; width: ${size}; height: ${size}; background: radial-gradient(circle, ${color}, transparent 70%); opacity: ${opacity}; z-index: ${z};`,
  );
</script>

<svelte:window onpointermove={onMove} />

<div
  class="cursor-glow pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen transition-opacity duration-500"
  style={style}
  aria-hidden="true"
>
</div>

<style>
  .cursor-glow {
    will-change: left, top;
  }

  @media (prefers-reduced-motion: reduce) {
    .cursor-glow {
      display: none;
    }
  }
</style>
