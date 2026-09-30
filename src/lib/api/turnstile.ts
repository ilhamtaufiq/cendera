/**
 * Verifikasi token Cloudflare Turnstile di sisi server.
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export async function verifyTurnstile(token: string, secret: string | undefined, ip?: string, expectedAction?: string) {
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY belum diset');
    return { success: false, reason: 'config' as const };
  }
  // Kunci rahasia UJI resmi Cloudflare: hasilnya sudah pasti (selalu lolos / selalu gagal),
  // jadi dijawab lokal tanpa jaringan — memudahkan dev/CI offline. Jangan dipakai di produksi.
  if (secret === '1x0000000000000000000000000000000AA') return { success: true };
  if (secret === '2x0000000000000000000000000000000AA') return { success: false, reason: 'invalid' as const };

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip && ip !== 'unknown') body.append('remoteip', ip);
  body.append('idempotency_key', crypto.randomUUID());

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const data = (await res.json()) as { success: boolean; action?: string; 'error-codes'?: string[] };
    // Kunci uji Turnstile tidak mengembalikan action yang sama; hanya dicek bila ada.
    if (data.success && expectedAction && data.action && data.action !== expectedAction && data.action !== 'test') {
      return { success: false, reason: 'action' as const };
    }
    return { success: data.success, reason: data.success ? undefined : ('invalid' as const), codes: data['error-codes'] };
  } catch (err) {
    console.error('Turnstile verify error', err);
    return { success: false, reason: 'network' as const };
  }
}
