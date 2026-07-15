import { describe, it, expect } from 'vitest';
import { ContentError } from './errors';

describe('ContentError', () => {
  it('is an Error subclass', () => {
    const err = new ContentError('network', 'boom');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('ContentError');
    expect(err.message).toBe('boom');
    expect(err.code).toBe('network');
  });

  it('preserves cause when provided', () => {
    const cause = new Error('underlying');
    const err = new ContentError('parse', 'bad json', cause);
    expect(err.cause).toBe(cause);
  });

  it('has no cause when not provided', () => {
    const err = new ContentError('not_found', 'missing');
    expect(err.cause).toBeUndefined();
  });

  it('notFound factory sets code and message', () => {
    const err = ContentError.notFound('home', 'JSON');
    expect(err.code).toBe('not_found');
    expect(err.message).toContain('home');
    expect(err.message).toContain('JSON');
  });

  it('network factory sets code', () => {
    const err = ContentError.network('timeout');
    expect(err.code).toBe('network');
    expect(err.message).toBe('timeout');
  });

  it('parse factory sets code', () => {
    const err = ContentError.parse('unexpected token');
    expect(err.code).toBe('parse');
  });

  it('invalid factory sets code', () => {
    const err = ContentError.invalid('bad slug');
    expect(err.code).toBe('invalid');
  });
});
