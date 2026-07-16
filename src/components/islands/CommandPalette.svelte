<script lang="ts">
  import { onMount } from 'svelte';
  /**
   * CommandPalette — Cmd+K / Ctrl+K navigation palette.
   *
   * Linear, Raycast, Vercel — Cmd+K is the 2026 standard for dev tools.
   * ~60 lines of Svelte 5, 0 dependencies. Keyboard nav: arrows + enter.
   *
   * Usage:
   *   <CommandPalette
   *     items={[
   *       { label: 'Home', href: '/' },
   *       { label: 'Blog', href: '/blog' },
   *       { label: 'GitHub', href: 'https://github.com/...', external: true },
   *     ]}
   *     placeholder="Search pages..."
   *   />
   *
   * Or with sections:
   *   <CommandPalette
   *     sections={[
   *       { title: 'Pages', items: [...] },
   *       { title: 'Links', items: [...] },
   *     ]}
   *   />
   */
  interface CommandItem {
    label: string;
    href?: string;
    hint?: string;
    external?: boolean;
    onSelect?: () => void;
  }

  interface CommandSection {
    title?: string;
    items: CommandItem[];
  }

  interface Props {
    items?: CommandItem[];
    sections?: CommandSection[];
    placeholder?: string;
    hotkey?: string;
  }

  let {
    items = [],
    sections = [],
    placeholder = 'Type a command or search...',
    hotkey = 'mod+k',
  }: Props = $props();

  let open = $state(false);
  let query = $state('');
  let activeIndex = $state(0);
  let inputEl: HTMLInputElement;

  // Flatten sections for keyboard nav
  const allItems = $derived(
    sections.length > 0
      ? sections.flatMap((s) => s.items)
      : items,
  );

  const filtered = $derived(
    sections.length > 0
      ? sections.map((s) => ({
          title: s.title,
          items: s.items.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase()),
          ),
        }))
      : [
          {
            items: items.filter((item) =>
              item.label.toLowerCase().includes(query.toLowerCase()),
            ),
          },
        ],
  );

  const flatFiltered = $derived(filtered.flatMap((s) => s.items));

  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      open = !open;
      if (open) {
        query = '';
        activeIndex = 0;
        requestAnimationFrame(() => inputEl?.focus());
      }
    }
    if (e.key === 'Escape') {
      open = false;
    }
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, flatFiltered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flatFiltered[activeIndex];
      if (item) selectItem(item);
    }
  }

  function selectItem(item: CommandItem) {
    open = false;
    if (item.onSelect) {
      item.onSelect();
    } else if (item.href) {
      if (item.external) {
        window.open(item.href, '_blank');
      } else {
        window.location.href = item.href;
      }
    }
  }

  let globalIndex = 0;

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
    onclick={() => (open = false)}
    role="dialog"
    aria-modal="true"
    aria-label="Command palette"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-default/60 backdrop-blur-sm"></div>

    <!-- Palette -->
    <div
      class="relative w-full max-w-lg rounded-xl border border-hairline bg-card shadow-2xl overflow-hidden"
      onclick={(e) => e.stopPropagation()}
      role="combobox"
      aria-expanded="true"
    >
      <input
        bind:this={inputEl}
        bind:value={query}
        type="text"
        {placeholder}
        role="combobox"
        aria-autocomplete="list"
        class="w-full px-4 py-3.5 text-default bg-transparent border-b border-hairline focus:outline-none placeholder:text-muted/60"
      />

      <div class="max-h-80 overflow-y-auto p-2">
        {#each filtered as section}
          {#if section.title && section.items.length > 0}
            <div class="px-2 py-1.5 text-xs font-medium text-muted uppercase tracking-wide">
              {section.title}
            </div>
          {/if}
          {#each section.items as item}
            {@const idx = globalIndex++}
            <button
              type="button"
              onclick={() => selectItem(item)}
              onmouseenter={() => (activeIndex = idx)}
              class:list={[
                'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors',
                activeIndex === idx ? 'bg-primary/10 text-default' : 'text-default hover:bg-surface',
              ]}
            >
              <span class="font-medium">{item.label}</span>
              {#if item.hint}
                <span class="text-xs text-muted font-mono">{item.hint}</span>
              {/if}
            </button>
          {/each}
        {/each}

        {#if flatFiltered.length === 0}
          <div class="px-3 py-8 text-center text-sm text-muted">
            No results for "{query}"
          </div>
        {/if}
      </div>

      <div class="flex items-center justify-between px-4 py-2 border-t border-hairline text-xs text-muted">
        <span class="flex items-center gap-1">
          <kbd class="px-1.5 py-0.5 rounded border border-hairline bg-surface font-mono text-[10px]">↑↓</kbd>
          navigate
        </span>
        <span class="flex items-center gap-1">
          <kbd class="px-1.5 py-0.5 rounded border border-hairline bg-surface font-mono text-[10px]">↵</kbd>
          select
        </span>
        <span class="flex items-center gap-1">
          <kbd class="px-1.5 py-0.5 rounded border border-hairline bg-surface font-mono text-[10px]">esc</kbd>
          close
        </span>
      </div>
    </div>
  </div>
{/if}

<!-- Trigger hint (optional, place in layout) -->
<slot />
