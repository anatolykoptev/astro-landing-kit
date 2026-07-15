# forms

Form protection: CSRF tokens, rate limiting, and webhook adapters.

## What

- `csrf.ts` — HMAC-signed CSRF token generation + verification (timing-safe)
- `rate-limit.ts` — token-bucket rate limiter (in-memory or custom store)
- `webhook.ts` — pluggable form-submit adapters (JSON, Formspree, custom)

## When to use

- Any form-submit endpoint that receives data from landing-kit forms
- Protecting against CSRF attacks on serverless/API endpoints
- Preventing form-spam floods

## API

### CSRF

```ts
import { generateCsrfToken, verifyCsrfToken } from 'astro-landing-kit/forms/csrf';

// Build time (Astro frontmatter) — inject into <meta name="csrf-token" />
const token = generateCsrfToken(import.meta.env.CSRF_SECRET);

// Submit endpoint (serverless function) — verify
const ok = verifyCsrfToken(tokenFromHeader, process.env.CSRF_SECRET);
if (!ok) return new Response('Forbidden', { status: 403 });
```

Token format: `<base64url(payload)>.<base64url(hmac-sig)>` — signed with
HMAC-SHA256, TTL 1 hour (configurable). Uses `timingSafeEqual` to prevent
timing attacks.

### Rate limiting

```ts
import { createRateLimiter } from 'astro-landing-kit/forms/rate-limit';

const limiter = createRateLimiter({ capacity: 5, refillPerMinute: 3 });
const result = await limiter.check(clientIp);
if (!result.allowed) {
  return new Response('Too many requests', {
    status: 429,
    headers: { 'Retry-After': String(result.retryAfter) },
  });
}
```

For distributed deployments, implement `RateLimitStore` against Redis:

```ts
import { createRateLimiter } from 'astro-landing-kit/forms/rate-limit';
const redisStore: RateLimitStore = { /* ... */ };
const limiter = createRateLimiter({ store: redisStore });
```

### Webhook

```ts
import { JsonWebhook, FormspreeWebhook } from 'astro-landing-kit/forms/webhook';

// Generic JSON POST
const webhook = new JsonWebhook('https://api.example.com/leads', {
  Authorization: `Bearer ${token}`,
});

// Formspree
const formspree = new FormspreeWebhook('abcdwxyz');

const result = await webhook.submit({ name: 'Jane', email: 'jane@x.com' });
if (!result.ok) throw new Error(`Webhook failed: ${result.status}`);
```

## Dependencies

- `node:crypto` — HMAC-SHA256 (built-in, no external dep)

## Status

stable (0.6.0)
