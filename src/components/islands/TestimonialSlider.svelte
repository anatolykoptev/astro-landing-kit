<script lang="ts">
  import useEmblaCarousel from 'embla-carousel-svelte';
  import Autoplay from 'embla-carousel-autoplay';

  interface Testimonial {
    title?: string;
    testimonial?: string;
    name?: string;
    job?: string;
    image?: string | unknown;
  }

  interface Props {
    testimonials: Testimonial[];
    autoplay?: number;
    arrows?: boolean;
    dots?: boolean;
    pauseOnHover?: boolean;
  }

  let {
    testimonials,
    autoplay = 0,
    arrows = true,
    dots = true,
    pauseOnHover = true,
  }: Props = $props();

  let emblaRef: HTMLElement;
  let emblaApi: any = $state(null);

  let current = $state(0);
  let isPaused = $state(false);
  let scrollSnaps: number[] = $state([]);

  // Build plugins array
  const plugins: any[] = [];
  if (autoplay > 0) {
    plugins.push(Autoplay({ delay: autoplay, stopOnInteraction: false, stopOnMouseEnter: pauseOnHover }));
  }

  const options = { loop: true, align: 'center' };

  function onInit(event: CustomEvent) {
    emblaApi = event.detail;
    scrollSnaps = emblaApi.scrollSnapList();
    emblaApi.on('select', () => {
      current = emblaApi.selectedScrollSnap();
    });
  }

  function next() { emblaApi?.scrollNext(); }
  function prev() { emblaApi?.scrollPrev(); }
  function goTo(i: number) { emblaApi?.scrollTo(i); }

  // Keyboard navigation
  function onKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowLeft': e.preventDefault(); prev(); break;
      case 'ArrowRight': e.preventDefault(); next(); break;
      case 'Home': e.preventDefault(); goTo(0); break;
      case 'End': e.preventDefault(); goTo(testimonials.length - 1); break;
    }
  }

  // Pause/resume on hover/focus
  function onPause() {
    if (autoplay > 0 && pauseOnHover) {
      isPaused = true;
      emblaApi?.plugins()?.autoplay?.stop();
    }
  }
  function onResume() {
    if (autoplay > 0 && pauseOnHover) {
      isPaused = false;
      emblaApi?.plugins()?.autoplay?.play();
    }
  }
</script>

<div
  class="max-w-4xl mx-auto relative"
  role="region"
  aria-label="Testimonials"
  tabindex="0"
  onkeydown={onKeydown}
  onmouseenter={onPause}
  onmouseleave={onResume}
  onfocusin={onPause}
  onfocusout={onResume}
>
  <!-- Gradient edge masks -->
  <div class="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none hidden md:block"></div>
  <div class="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none hidden md:block"></div>

  <!-- Embla viewport -->
  <div bind:this={emblaRef} class="embla overflow-hidden">
    <div
      class="embla__container flex"
      use:useEmblaCarousel={{ options, plugins }}
      onemblaInit={onInit}
    >
      {#each testimonials as t}
        <div class="embla__slide flex-[0_0_100%] min-w-0 px-4">
          <div class="flex flex-col p-6 md:p-10 rounded-xl shadow-xl dark:shadow-none dark:border dark:border-slate-600 text-center">
            {#if t.title}
              <h3 class="text-lg font-medium pb-4">{t.title}</h3>
            {/if}
            {#if t.testimonial}
              <blockquote class="flex-auto mb-6">
                <p class="text-lg text-muted italic">"{t.testimonial}"</p>
              </blockquote>
            {/if}
            {#if t.name}
              <div class="flex items-center justify-center gap-3">
                {#if t.image && typeof t.image === 'object'}
                  <div class="h-12 w-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
                    <img src={(t.image as any).src} alt={t.name} class="w-full h-full object-cover" />
                  </div>
                {/if}
                <div class="text-left">
                  <p class="font-semibold">{t.name}</p>
                  {#if t.job}<p class="text-sm text-muted">{t.job}</p>{/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Arrows -->
  {#if arrows && testimonials.length > 1}
    <button
      type="button"
      onclick={prev}
      aria-label="Previous testimonial"
      class="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-4 w-10 h-10 rounded-full bg-page shadow-lg flex items-center justify-center hover:bg-surface-hover z-20 transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
    </button>
    <button
      type="button"
      onclick={next}
      aria-label="Next testimonial"
      class="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-4 w-10 h-10 rounded-full bg-page shadow-lg flex items-center justify-center hover:bg-surface-hover z-20 transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
    </button>
  {/if}

  <!-- Dots -->
  {#if dots && testimonials.length > 1}
    <div class="flex justify-center gap-2 mt-6">
      {#each scrollSnaps as _, i}
        <button
          type="button"
          onclick={() => goTo(i)}
          aria-label="Go to testimonial {i + 1}"
          class="w-2.5 h-2.5 rounded-full transition-colors {current === i ? 'bg-primary' : 'bg-hairline'}"
        ></button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .embla__slide {
    transform: translate3d(0, 0, 0);
  }
</style>
