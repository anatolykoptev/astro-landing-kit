<script lang="ts">
  interface Props {
    endpoint: string;
    fields?: { name: string; label: string; type: string; required?: boolean; placeholder?: string; validate?: (v: string) => string | null }[];
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
  let errors = $state<Record<string, string>>({});
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

  function validateField(field: typeof fields[0]): string | null {
    const value = formData[field.name] ?? '';
    if (field.required && !value.trim()) return `${field.label} is required`;
    if (field.validate) return field.validate(value);
    return null;
  }

  function validateAll(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      const err = validateField(field);
      if (err) newErrors[field.name] = err;
    }
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  function onInput(name: string) {
    if (errors[name]) {
      errors = { ...errors, [name]: '' };
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (honeypot) { submitted = true; return; }
    if (!validateAll()) return;

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
        const status = res.status;
        if (status === 429) submitError = 'Too many requests. Please try again later.';
        else if (status === 403) submitError = 'Security check failed. Please refresh the page.';
        else if (status >= 500) submitError = 'Server error. Please try again later.';
        else submitError = 'Failed to submit. Please try again.';
      }
    } catch (err) {
      submitError = 'Network error. Please check your connection and try again.';
    } finally {
      submitting = false;
    }
  }
</script>

{#if submitted}
  <div class="text-center py-12 scroll-reveal">
    <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
      <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 class="text-2xl font-bold mb-2 text-default">{successTitle}</h3>
    <p class="text-muted">{successMessage}</p>
  </div>
{:else}
  <form onsubmit={handleSubmit} class="space-y-5">
    {#each fields as field}
      <div>
        <label for="cf-{field.name}" class="block text-sm font-medium mb-1.5 text-default">
          {field.label}{field.required ? ' *' : ''}
        </label>
        {#if field.type === 'textarea'}
          <textarea
            id="cf-{field.name}"
            bind:value={formData[field.name]}
            oninput={() => onInput(field.name)}
            placeholder={field.placeholder}
            required={field.required}
            rows="4"
            aria-invalid={errors[field.name] ? 'true' : undefined}
            class:list={[
              'w-full rounded-lg border bg-card px-4 py-2.5 text-default placeholder:text-muted/60',
              'transition-colors duration-150 resize-y focus:outline-none focus:ring-2',
              errors[field.name]
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                : 'border-hairline focus:border-primary focus:ring-primary/20',
            ]}
          ></textarea>
        {:else}
          <input
            id="cf-{field.name}"
            type={field.type}
            bind:value={formData[field.name]}
            oninput={() => onInput(field.name)}
            placeholder={field.placeholder}
            required={field.required}
            aria-invalid={errors[field.name] ? 'true' : undefined}
            class:list={[
              'w-full rounded-lg border bg-card px-4 py-2.5 text-default placeholder:text-muted/60',
              'transition-colors duration-150 focus:outline-none focus:ring-2',
              errors[field.name]
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                : 'border-hairline focus:border-primary focus:ring-primary/20',
            ]}
          />
        {/if}
        {#if errors[field.name]}
          <p class="mt-1.5 text-xs text-red-500" role="alert">{errors[field.name]}</p>
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

    <button
      type="submit"
      disabled={submitting}
      class="w-full btn-primary py-3 rounded-lg font-semibold disabled:opacity-50 transition-opacity"
    >
      {submitting ? 'Sending...' : submitText}
    </button>
  </form>
{/if}
