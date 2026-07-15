/**
 * Webhook adapter — pluggable endpoint resolver for form submissions.
 *
 * The default `JsonWebhook` POSTs form data as JSON to a fixed URL.
 * Consumers can implement `WebhookAdapter` to route to different endpoints,
 * transform payloads, or integrate with third-party services (Formspree,
 * Web3Forms, ConvertKit, etc.).
 *
 * @example
 * ```ts
 * import { JsonWebhook } from 'astro-landing-kit/forms/webhook';
 * const webhook = new JsonWebhook('https://api.example.com/leads');
 * const res = await webhook.submit({ name: 'Jane', email: 'jane@x.com' });
 * ```
 */

export interface WebhookPayload {
  [key: string]: unknown;
}

export interface WebhookResult {
  ok: boolean;
  status: number;
  body?: unknown;
}

export interface WebhookAdapter {
  submit(payload: WebhookPayload): Promise<WebhookResult>;
}

/**
 * Default webhook: POST JSON to a URL.
 * Optional headers (e.g. Authorization) can be passed via constructor.
 */
export class JsonWebhook implements WebhookAdapter {
  private url: string;
  private headers: Record<string, string>;

  constructor(url: string, headers: Record<string, string> = {}) {
    this.url = url;
    this.headers = { 'Content-Type': 'application/json', ...headers };
  }

  async submit(payload: WebhookPayload): Promise<WebhookResult> {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    let body: unknown;
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      body = await res.json();
    } else {
      body = await res.text();
    }
    return { ok: res.ok, status: res.status, body };
  }
}

/**
 * Formspree-compatible adapter — POSTs form-encoded data to a Formspree endpoint.
 * @example
 * ```ts
 * const webhook = new FormspreeWebhook('https://formspree.io/f/abcdwxyz');
 * ```
 */
export class FormspreeWebhook implements WebhookAdapter {
  private endpoint: string;

  constructor(formId: string) {
    this.endpoint = formId.startsWith('http')
      ? formId
      : `https://formspree.io/f/${formId}`;
  }

  async submit(payload: WebhookPayload): Promise<WebhookResult> {
    const form = new URLSearchParams();
    for (const [key, value] of Object.entries(payload)) {
      form.append(key, String(value));
    }
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: form,
    });
    let body: unknown;
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      body = await res.json();
    } else {
      body = await res.text();
    }
    return { ok: res.ok, status: res.status, body };
  }
}
