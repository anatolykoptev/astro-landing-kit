/**
 * Token-bucket rate limiter (adapter-agnostic, in-memory default).
 *
 * Designed for form-submit endpoints. The limiter is keyed by an identifier
 * (IP address, email, session ID). Each key has a bucket with a capacity and
 * refill rate; requests consume tokens, tokens refill over time.
 *
 * For distributed deployments, implement `RateLimitStore` against Redis or
 * your shared cache — the in-memory store is per-process only.
 *
 * @example
 * ```ts
 * import { createRateLimiter } from 'astro-landing-kit/forms/rate-limit';
 * const limiter = createRateLimiter({ capacity: 5, refillPerMinute: 3 });
 * const result = limiter.check('192.0.2.1');
 * if (!result.allowed) return new Response('Too many requests', { status: 429 });
 * ```
 */

export interface RateLimitOptions {
  /** Maximum tokens a bucket can hold (burst capacity). Default: 5. */
  capacity?: number;
  /** Tokens added per minute (sustained rate). Default: 3. */
  refillPerMinute?: number;
  /** Custom store (e.g. Redis-backed). Default: in-memory Map. */
  store?: RateLimitStore;
}

export interface RateLimitStore {
  get(key: string): Promise<RateLimitBucket | undefined> | RateLimitBucket | undefined;
  set(key: string, bucket: RateLimitBucket): Promise<void> | void;
}

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the next token is available (0 if tokens > 0). */
  retryAfter: number;
}

export function createRateLimiter(opts: RateLimitOptions = {}) {
  const capacity = opts.capacity ?? 5;
  const refillPerMinute = opts.refillPerMinute ?? 3;
  const refillPerSecond = refillPerMinute / 60;
  const store: RateLimitStore = opts.store ?? createInMemoryStore();

  async function check(key: string): Promise<RateLimitResult> {
    const now = Date.now() / 1000;
    const bucket = await store.get(key);

    let tokens: number;
    let lastRefill: number;

    if (bucket) {
      const elapsed = now - bucket.lastRefill;
      tokens = Math.min(capacity, bucket.tokens + elapsed * refillPerSecond);
      lastRefill = now;
    } else {
      tokens = capacity;
      lastRefill = now;
    }

    if (tokens >= 1) {
      tokens -= 1;
      await store.set(key, { tokens, lastRefill });
      return { allowed: true, remaining: Math.floor(tokens), retryAfter: 0 };
    }

    const secondsToNextToken = Math.ceil((1 - tokens) / refillPerSecond);
    await store.set(key, { tokens, lastRefill });
    return { allowed: false, remaining: 0, retryAfter: secondsToNextToken };
  }

  return { check, capacity, refillPerMinute };
}

/** Create a simple in-memory store (per-process, not shared). */
export function createInMemoryStore(): RateLimitStore {
  const map = new Map<string, RateLimitBucket>();
  return {
    get(key) {
      return map.get(key);
    },
    set(key, bucket) {
      map.set(key, bucket);
    },
  };
}
