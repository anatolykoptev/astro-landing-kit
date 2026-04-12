export interface WebhookConfig {
  url: string;
  headers?: Record<string, string>;
  source?: string;
}

export async function sendWebhook(config: WebhookConfig, payload: Record<string, unknown>): Promise<boolean> {
  const body = { ...payload, source: config.source || 'landing-kit', timestamp: new Date().toISOString() };
  try {
    const res = await fetch(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...config.headers },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}
