<script lang="ts">
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
  }

  let {
    testimonials,
    autoplay = 0,
    arrows = true,
    dots = true,
  }: Props = $props();

  let current = $state(0);
  let intervalId: ReturnType<typeof setInterval> | undefined;

  function next() {
    current = (current + 1) % testimonials.length;
  }
  function prev() {
    current = current === 0 ? testimonials.length - 1 : current - 1;
  }
  function goTo(i: number) {
    current = i;
  }

  $effect(() => {
    if (autoplay > 0 && testimonials.length > 1) {
      intervalId = setInterval(next, autoplay);
      return () => clearInterval(intervalId);
    }
  });
</script>

<div class="max-w-4xl mx-auto">
  <div class="relative overflow-hidden">
    <div
      class="flex transition-transform duration-300 ease-out"
      style:transform="translateX(-{current * 100}%)"
    >
      {#each testimonials as t}
        <div class="w-full flex-shrink-0 px-4">
          <div class="flex flex-col p-6 md:p-10 rounded-lg shadow-xl dark:shadow-none dark:border dark:border-slate-600 text-center">
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

  {#if arrows && testimonials.length > 1}
    <button
      type="button"
      onclick={prev}
      aria-label="Previous testimonial"
      class="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 z-10"
    >
      <span class="text-xl">‹</span>
    </button>
    <button
      type="button"
      onclick={next}
      aria-label="Next testimonial"
      class="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 z-10"
    >
      <span class="text-xl">›</span>
    </button>
  {/if}

  {#if dots && testimonials.length > 1}
    <div class="flex justify-center gap-2 mt-6">
      {#each testimonials as _, i}
        <button
          type="button"
          onclick={() => goTo(i)}
          aria-label="Go to testimonial {i + 1}"
          class="w-2.5 h-2.5 rounded-full transition-colors {current === i ? 'bg-primary' : 'bg-gray-300'}"
        ></button>
      {/each}
    </div>
  {/if}
</div>
