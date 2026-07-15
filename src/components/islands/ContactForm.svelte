<script lang="ts">
  interface Props {
    endpoint: string;
    fields?: { name: string; label: string; type: string; required?: boolean; placeholder?: string }[];
    submitText?: string;
    successTitle?: string;
    successMessage?: string;
    /** CSRF token — injected from a <meta name="csrf-token"> tag if present. */
    csrfToken?: string;
  }

  let {
    endpoint,
    fields = defaultFields(),
    submitText = 'Submit',
    successTitle = 'Sent!',
    successMessage = 'We\'ll be in touch.',
    csrfToken,
  }: Props = $props();

  let formData = $state<Record<string, string>>({});
  let honeypot = $state('');
  let formLoadedAt = $state(Date.now() / 1000);
  let submitted = $state(false);
  let submitting = $state(false);
  let submitError = $state('');

  // Auto-detect CSRF token from <meta name="csrf-token"> if not passed as prop
  if (!csrfToken && typeof document !== 'undefined') {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) csrfToken = meta.getAttribute('content') ?? undefined;
  }

  function defaultFields() {
    return [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@company.com' },
      { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'How can we help?' },
    ];
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (honeypot) { submitted = true; return; }
    submitting = true;
    submitError = '';
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...formData, _ts: formLoadedAt, website: honeypot }),
      });
      if (res.ok) submitted = true;
      else {
        // Sanitize error — never expose raw server response to user
        const status = res.status;
        if (status === 429) submitError = 'Too many requests. Please try again later.';
        else if (status === 403) submitError = 'Security check failed. Please refresh the page.';
        else if (status >= 500) submitError = 'Server error. Please try again later.';
        else submitError = 'Failed to submit. Please try again.';
      }
    } catch (err) {
      // Network error — don't expose err.message (could leak internal URLs)
      submitError = 'Network error. Please check your connection and try again.';
    } finally {
      submitting = false;
    }
  }
</script>

{#if submitted}
  <div class="text-center py-12">
    <h3 class="text-2xl font-bold mb-2">{successTitle}</h3>
    <p class="text-muted">{successMessage}</p>
  </div>
{:else}
  <form onsubmit={handleSubmit} class="space-y-4">
    {#each fields as field}
      <div>
        <label for="cf-{field.name}" class="block text-sm font-medium mb-1">{field.label}{field.required ? ' *' : ''}</label>
        {#if field.type === 'textarea'}
          <textarea id="cf-{field.name}" bind:value={formData[field.name]} placeholder={field.placeholder} required={field.required} rows="4" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5"></textarea>
        {:else}
          <input id="cf-{field.name}" type={field.type} bind:value={formData[field.name]} placeholder={field.placeholder} required={field.required} class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5" />
        {/if}
      </div>
    {/each}

    <!-- Honeypot -->
    <div style="position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden;" aria-hidden="true">
      <input tabindex="-1" autocomplete="off" bind:value={honeypot} name="website" />
    </div>

    {#if submitError}
      <p class="text-sm text-red-500" role="alert">{submitError}</p>
    {/if}

    <button type="submit" disabled={submitting} class="w-full btn-primary py-3 rounded-lg font-semibold disabled:opacity-50">
      {submitting ? 'Sending...' : submitText}
    </button>
  </form>
{/if}
