/**
 * CSRF token generation and verification (double-submit + HMAC-signed pattern).
 *
 * For SSG: generate a token in Astro frontmatter (server-side at build time)
 * and inject it as a hidden field or meta tag. The submit endpoint (serverless
 * function / API route) verifies the token using the same secret.
 *
 * For SSR: generate per-request in an API route and set as a cookie + return in
 * response body.
 *
 * @example
 * ```ts
 * // Build time (Astro frontmatter):
 * import { generateCsrfToken } from 'astro-landing-kit/forms/csrf';
 * const csrfToken = generateCsrfToken(import.meta.env.CSRF_SECRET);
 * // → inject into <meta name="csrf-token" content={csrfToken} />
 * ```
 *
 * @example
 * ```ts
 * // Submit endpoint (serverless function):
 * import { verifyCsrfToken } from 'astro-landing-kit/forms/csrf';
 * const ok = verifyCsrfToken(tokenFromHeader, process.env.CSRF_SECRET);
 * if (!ok) return new Response('Forbidden', { status: 403 });
 * ```
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

/** Default token TTL: 1 hour (in seconds). */
const DEFAULT_MAX_AGE = 3600;

export interface CsrfTokenPayload {
  /** Unix timestamp (seconds) when the token was issued. */
  ts: number;
  /** Optional nonce for uniqueness. */
  nonce: string;
}

/**
 * Generate an HMAC-signed CSRF token.
 *
 * Token format: `<base64url(json payload)>.<base64url(hmac signature)>`
 *
 * The secret should be at least 32 bytes. In production, store it in an env var
 * (`CSRF_SECRET`) — never commit it.
 */
export function generateCsrfToken(secret: string, maxAge: number = DEFAULT_MAX_AGE): string {
  if (!secret || secret.length < 16) {
    throw new Error('CSRF secret must be at least 16 characters');
  }
  const payload: CsrfTokenPayload = {
    ts: Math.floor(Date.now() / 1000),
    nonce: Math.random().toString(36).slice(2, 10),
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', secret).update(payloadStr).digest('base64url');
  return `${payloadStr}.${sig}`;
}

/**
 * Verify an HMAC-signed CSRF token.
 *
 * Checks: signature validity + timestamp not expired.
 * Returns `true` if valid, `false` otherwise. Uses `timingSafeEqual` to prevent
 * timing attacks.
 */
export function verifyCsrfToken(token: string, secret: string, maxAge: number = DEFAULT_MAX_AGE): boolean {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadStr, sig] = parts;

  // Verify signature
  const expectedSig = createHmac('sha256', secret).update(payloadStr).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  // Verify timestamp
  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString()) as CsrfTokenPayload;
    const now = Math.floor(Date.now() / 1000);
    if (now - payload.ts >= maxAge) return false;
    return true;
  } catch {
    return false;
  }
}
