import { describe, it, expect } from 'vitest';
import { generateCsrfToken, verifyCsrfToken } from './csrf';

const TEST_SECRET = 'test-secret-at-least-16-chars-long';

describe('csrf', () => {
  it('generateCsrfToken produces a signed token with payload.signature format', () => {
    const token = generateCsrfToken(TEST_SECRET);
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  });

  it('verifyCsrfToken accepts a freshly generated token', () => {
    const token = generateCsrfToken(TEST_SECRET);
    expect(verifyCsrfToken(token, TEST_SECRET)).toBe(true);
  });

  it('verifyCsrfToken rejects a token signed with a different secret', () => {
    const token = generateCsrfToken(TEST_SECRET);
    expect(verifyCsrfToken(token, 'wrong-secret-at-least-16-chars')).toBe(false);
  });

  it('verifyCsrfToken rejects a tampered payload', () => {
    const token = generateCsrfToken(TEST_SECRET);
    const [payload, sig] = token.split('.');
    // Flip a character in the payload
    const tampered = payload.charAt(0) === 'A' ? 'B' + payload.slice(1) : 'A' + payload.slice(1);
    expect(verifyCsrfToken(`${tampered}.${sig}`, TEST_SECRET)).toBe(false);
  });

  it('verifyCsrfToken rejects a tampered signature', () => {
    const token = generateCsrfToken(TEST_SECRET);
    const [payload, sig] = token.split('.');
    const tamperedSig = sig.charAt(0) === 'A' ? 'B' + sig.slice(1) : 'A' + sig.slice(1);
    expect(verifyCsrfToken(`${payload}.${tamperedSig}`, TEST_SECRET)).toBe(false);
  });

  it('verifyCsrfToken rejects an expired token', () => {
    const token = generateCsrfToken(TEST_SECRET, 0);
    // maxAge=0 means already expired
    expect(verifyCsrfToken(token, TEST_SECRET, 0)).toBe(false);
  });

  it('verifyCsrfToken rejects empty/null inputs', () => {
    expect(verifyCsrfToken('', TEST_SECRET)).toBe(false);
    expect(verifyCsrfToken('invalid', TEST_SECRET)).toBe(false);
    expect(verifyCsrfToken('a.b.c', TEST_SECRET)).toBe(false);
  });

  it('generateCsrfToken throws on short secret', () => {
    expect(() => generateCsrfToken('short')).toThrow('at least 16 characters');
    expect(() => generateCsrfToken('')).toThrow('at least 16 characters');
  });

  it('tokens are unique (different nonces)', () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 20; i++) {
      tokens.add(generateCsrfToken(TEST_SECRET));
    }
    expect(tokens.size).toBe(20);
  });
});
