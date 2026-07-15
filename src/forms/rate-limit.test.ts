import { describe, it, expect } from 'vitest';
import { createRateLimiter, createInMemoryStore } from './rate-limit';

describe('rate-limit', () => {
  it('allows up to capacity requests in a burst', async () => {
    const limiter = createRateLimiter({ capacity: 3, refillPerMinute: 1 });
    const results: boolean[] = [];
    for (let i = 0; i < 5; i++) {
      const r = await limiter.check('ip-1');
      results.push(r.allowed);
    }
    expect(results).toEqual([true, true, true, false, false]);
  });

  it('tracks remaining tokens', async () => {
    const limiter = createRateLimiter({ capacity: 3, refillPerMinute: 1 });
    const r1 = await limiter.check('ip-2');
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);
  });

  it('reports retryAfter when rate limited', async () => {
    const limiter = createRateLimiter({ capacity: 1, refillPerMinute: 60 });
    await limiter.check('ip-3');
    const r2 = await limiter.check('ip-3');
    expect(r2.allowed).toBe(false);
    expect(r2.retryAfter).toBeGreaterThan(0);
  });

  it('isolates keys (different IPs have separate buckets)', async () => {
    const limiter = createRateLimiter({ capacity: 1, refillPerMinute: 1 });
    const a = await limiter.check('ip-a');
    const b = await limiter.check('ip-b');
    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
  });

  it('uses custom store when provided', async () => {
    const store = createInMemoryStore();
    const limiter = createRateLimiter({ capacity: 2, refillPerMinute: 1, store });
    await limiter.check('ip-custom');
    // The store should now have an entry
    const bucket = await store.get('ip-custom');
    expect(bucket).toBeDefined();
    expect(bucket!.tokens).toBe(1);
  });

  it('refills tokens over time', async () => {
    // capacity=1, refill=600/min = 10/sec → after 100ms should have ~1 token
    const limiter = createRateLimiter({ capacity: 1, refillPerMinute: 600 });
    await limiter.check('ip-refill');
    const blocked = await limiter.check('ip-refill');
    expect(blocked.allowed).toBe(false);
    // Wait 200ms → should have refilled at least 1 token
    await new Promise((r) => setTimeout(r, 200));
    const refilled = await limiter.check('ip-refill');
    expect(refilled.allowed).toBe(true);
  });

  it('defaults: capacity=5, refillPerMinute=3', () => {
    const limiter = createRateLimiter();
    expect(limiter.capacity).toBe(5);
    expect(limiter.refillPerMinute).toBe(3);
  });
});
