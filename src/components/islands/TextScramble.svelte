<script lang="ts">
  import { onMount } from 'svelte';
  /**
   * TextScramble — terminal-style text decode animation.
   *
   * Text starts as random characters, then "decodes" into the final text.
   * Developer tool / terminal aesthetic. Triggers on view via
   * IntersectionObserver. ~40 lines, 0 dependencies.
   *
   * Usage:
   *   <TextScramble text="astro-landing-kit" />
   *   <TextScramble text="npm install" duration={800} />
   *
   * Props:
   *   text     — final text to decode into
   *   duration — animation duration in ms, default 1200
   *   chars    — character set for scramble, default "!<>-_\\/[]{}=+*^?#"
   *   class    — CSS class for styling
   */
  interface Props {
    text: string;
    duration?: number;
    chars?: string;
    class?: string;
  }

  let {
    text,
    duration = 1200,
    chars = '!<>-_\\/[]{}=+*^?#________',
    class: className = '',
  }: Props = $props();

  let displayed = $state(text);
  let el: HTMLElement;
  let frame = 0;
  let rafId: number | null = null;

  function scramble() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      displayed = text;
      return;
    }

    const len = text.length;
    const startTime = performance.now();
    frame = 0;

    if (rafId) cancelAnimationFrame(rafId);

    function update(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const revealed = Math.floor(progress * len);
      let result = '';

      for (let i = 0; i < len; i++) {
        if (i < revealed) {
          result += text[i];
        } else if (text[i] === ' ') {
          result += ' ';
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      displayed = result;

      if (progress < 1) {
        rafId = requestAnimationFrame(update);
      } else {
        displayed = text;
        rafId = null;
      }
    }

    rafId = requestAnimationFrame(update);
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          scramble();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  });
</script>

<span bind:this={el} class={className} aria-label={text}>{displayed}</span>
