/**
 * POST /api/newsletter — simpan email pelanggan ke Workers KV (binding NEWSLETTER).
 * Kunci: `sub:<email>` → { email, createdAt, ip, source }. Ekspor dengan:
 *   npx wrangler kv key list --binding NEWSLETTER --prefix sub: --remote
 */
import type { APIRoute } from 'astro';
import { env } from '@/lib/api/env';
import { clientIp, fieldErrors, isAllowedOrigin, json, readBody } from '@/lib/api/http';
import { checkRateLimit } from '@/lib/api/rate-limit';
import { newsletterSchema } from '@/lib/api/schemas';
import { verifyTurnstile } from '@/lib/api/turnstile';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!isAllowedOrigin(request, env.ALLOWED_ORIGINS)) {
    return json({ ok: false, message: 'Permintaan ditolak (origin tidak diizinkan).' }, 403);
  }
  const ip = clientIp(request);
  if (!(await checkRateLimit(env.FORM_RATE_LIMITER, `newsletter:${ip}`))) {
    return json({ ok: false, message: 'Terlalu banyak percobaan. Silakan coba lagi sebentar lagi.' }, 429, { 'Retry-After': '60' });
  }

  const body = await readBody(request, 4096);
  if (!body) return json({ ok: false, message: 'Format data tidak valid.' }, 400);
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json({ ok: true, message: 'Berhasil berlangganan.' });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, message: 'Mohon periksa alamat email Anda.', errors: fieldErrors(parsed.error.issues) }, 422);
  }

  const captcha = await verifyTurnstile(parsed.data.turnstileToken, env.TURNSTILE_SECRET_KEY, ip, 'newsletter');
  if (!captcha.success) {
    return json({ ok: false, message: 'Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.' }, 400);
  }

  if (!env.NEWSLETTER) {
    console.error('Binding KV NEWSLETTER belum dikonfigurasi');
    return json({ ok: false, message: 'Layanan newsletter sedang tidak tersedia.' }, 503);
  }

  const key = `sub:${parsed.data.email}`;
  if (await env.NEWSLETTER.get(key)) {
    return json({ ok: true, message: 'Email Anda sudah terdaftar. Terima kasih!' });
  }
  await env.NEWSLETTER.put(
    key,
    JSON.stringify({ email: parsed.data.email, createdAt: new Date().toISOString(), ip, source: request.headers.get('referer') ?? '' }),
  );
  return json({ ok: true, message: 'Berhasil! Anda akan menerima artikel terbaru dari kami.' }, 201);
};

export const ALL: APIRoute = () =>
  json({ ok: false, message: 'Metode tidak didukung. Gunakan POST.' }, 405, { Allow: 'POST' });
