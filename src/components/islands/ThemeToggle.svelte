<script lang="ts">
  import { onMount } from 'svelte';
  /**
   * ThemeToggle — three-way theme switcher (Light / System / Dark).
   *
   * Single cycle button: one icon at a time, click cycles
   * light → dark → system → light. Icon shows the CURRENT mode:
   * sun (light), moon (dark), monitor (system).
   *
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

  // Cycle light → dark → system → light
  function cycle() {
    const next: Record<ThemeMode, ThemeMode> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    };
    setMode(next[mode]);
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

  const modeLabel: Record<ThemeMode, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  };
</script>

<button
  type="button"
  class="tt-btn"
  onclick={cycle}
  aria-label={`Switch theme (currently: ${modeLabel[mode]})`}
  title={`Switch theme (currently: ${modeLabel[mode]})`}
>
  {#if mode === 'light'}
    <!-- Sun -->
    <svg
      class="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  {:else if mode === 'dark'}
    <!-- Moon -->
    <svg
      class="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  {:else}
    <!-- Monitor (system) -->
    <svg
      class="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  {/if}
</button>

<style>
  .tt-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: var(--aw-color-text-muted);
    cursor: pointer;
    transition:
      color 160ms ease-out,
      background-color 160ms ease-out;
    opacity: 0;
    animation: tt-fade-in 0.2s ease-out 0.1s forwards;
  }

  .tt-btn:hover {
    color: var(--aw-color-text-default);
    background-color: var(--aw-color-surface-hover);
  }

  .tt-btn:focus-visible {
    outline: 2px solid var(--aw-color-primary);
    outline-offset: 3px;
  }

  @keyframes tt-fade-in {
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tt-btn {
      opacity: 1;
      animation: none;
    }
  }
</style>
