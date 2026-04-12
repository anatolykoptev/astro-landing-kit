/** Generate HMAC-SHA256 signature for a timestamp */
async function sign(ts: number, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(String(ts)));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

/** Create a new form token pair: timestamp + signature */
export async function createFormToken(secret: string): Promise<{ ts: string; sig: string }> {
  const ts = Math.floor(Date.now() / 1000);
  const sig = await sign(ts, secret);
  return { ts: String(ts), sig };
}

/** Verify a form token: signature matches and 2s < elapsed < 1h */
export async function verifyFormToken(ts: string, sig: string, secret: string): Promise<boolean> {
  const tsNum = parseInt(ts, 10);
  if (isNaN(tsNum)) return false;
  const elapsed = Math.floor(Date.now() / 1000) - tsNum;
  if (elapsed < 2 || elapsed > 3600) return false;
  const expected = await sign(tsNum, secret);
  return expected === sig;
}
