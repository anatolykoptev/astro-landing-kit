<script lang="ts">
  import { onMount } from 'svelte';
  /**
   * ThemeToggle — three-way theme switcher (Light / System / Dark).
   *
   * Segmented control with icons: sun (light), monitor (system), moon (dark).
   * Persists choice to localStorage. "System" follows prefers-color-scheme
   * and updates live when the OS preference changes.
   *
   * ~50 lines of Svelte 5, 0 dependencies.
   *
   * The actual class toggling on <html> happens in ApplyColorMode.astro
   * (inline, pre-paint) for the initial load, and in this component for
   * user-initiated changes. Both use the same applyTheme() logic.
   *
   * Props:
   *   class — CSS class for the wrapper
   */
  type ThemeMode = 'light' | 'dark' | 'system';

  let mode = $state<ThemeMode>('system');
  let mounted = $state(false);

  // Read initial state from localStorage (set by ApplyColorMode inline script)
  function readStoredMode(): ThemeMode {
    if (typeof localStorage === 'undefined') return 'system';
    const stored = localStorage.getItem('theme-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    return 'system';
  }

  function applyTheme(th: 'light' | 'dark') {
    if (th === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function resolveTheme(m: ThemeMode): 'light' | 'dark' {
    if (m === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return m;
  }

  function setMode(m: ThemeMode) {
    mode = m;
    if (m === 'system') {
      localStorage.removeItem('theme');
      localStorage.setItem('theme-mode', 'system');
    } else {
      localStorage.setItem('theme', m);
      localStorage.setItem('theme-mode', m);
    }

    // Add transition class for smooth color switch, remove after 200ms
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => document.documentElement.classList.remove('theme-transition'), 250);

    applyTheme(resolveTheme(m));

    // Update color-scheme meta for native form controls
    const resolved = resolveTheme(m);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute('content', resolved === 'dark' ? 'dark light' : 'light dark');
  }

  onMount(() => {
    mode = readStoredMode();
    mounted = true;

    // Listen for OS preference changes when in system mode
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (mode === 'system') applyTheme(mq.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  });

  const segments = [
    { mode: 'light' as const, icon: 'sun', label: 'Light theme' },
    { mode: 'system' as const, icon: 'monitor', label: 'System theme' },
    { mode: 'dark' as const, icon: 'moon', label: 'Dark theme' },
  ];
</script>

<div
  class="theme-toggle inline-flex items-center rounded-lg border border-hairline bg-surface p-0.5 gap-0.5"
  role="radiogroup"
  aria-label="Color theme"
>
  {#each segments as seg}
    <button
      type="button"
      role="radio"
      aria-checked={mode === seg.mode}
      aria-label={seg.label}
      title={seg.label}
      onclick={() => setMode(seg.mode)}
      class:list={[
        'relative flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        mode === seg.mode
          ? 'bg-card text-default shadow-sm'
          : 'text-muted hover:text-default',
      ]}
    >
      {#if seg.icon === 'sun'}
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="4" />
          <path stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      {:else if seg.icon === 'monitor'}
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path stroke-linecap="round" d="M8 20h8M12 16v4" />
        </svg>
      {:else}
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      {/if}
    </button>
  {/each}
</div>

<style>
  .theme-toggle {
    opacity: 0;
    animation: theme-toggle-in 0.2s ease-out 0.1s forwards;
  }

  @keyframes theme-toggle-in {
    to { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-toggle {
      opacity: 1;
      animation: none;
    }
  }
</style>
