/**
 * Typed error thrown by content adapters.
 *
 * Distinguishes failure modes so callers (e.g. RenderSections, SSR
 * fallback) can react appropriately: not-found → 404, network → 503,
 * parse → 500.
 */
export class ContentError extends Error {
  readonly code: ContentErrorCode;
  readonly cause?: unknown;

  constructor(code: ContentErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'ContentError';
    this.code = code;
    if (cause !== undefined) this.cause = cause;
  }

  static notFound(slug: string, source?: string): ContentError {
    return new ContentError('not_found', `Page "${slug}" not found${source ? ` in ${source}` : ''}`);
  }

  static network(message: string, cause?: unknown): ContentError {
    return new ContentError('network', message, cause);
  }

  static parse(message: string, cause?: unknown): ContentError {
    return new ContentError('parse', message, cause);
  }

  static invalid(message: string, cause?: unknown): ContentError {
    return new ContentError('invalid', message, cause);
  }
}

export type ContentErrorCode = 'not_found' | 'network' | 'parse' | 'invalid';
