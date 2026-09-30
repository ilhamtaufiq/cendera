/**
 * POST /api/kontak — dijalankan sebagai kode Worker (tidak di-prerender).
 * Alur: cek origin → rate limit per IP → parse body → honeypot → validasi Zod
 *       → verifikasi Turnstile → kirim lewat adapter notifikasi (Resend/webhook/console).
 */
import type { APIRoute } from 'astro';
import { env } from '@/lib/api/env';
import { clientIp, fieldErrors, isAllowedOrigin, json, readBody } from '@/lib/api/http';
import { checkRateLimit } from '@/lib/api/rate-limit';
import { contactSchema } from '@/lib/api/schemas';
import { verifyTurnstile } from '@/lib/api/turnstile';
import { dispatch } from '@/lib/api/notifiers';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!isAllowedOrigin(request, env.ALLOWED_ORIGINS)) {
    return json({ ok: false, message: 'Permintaan ditolak (origin tidak diizinkan).' }, 403);
  }

  const ip = clientIp(request);
  if (!(await checkRateLimit(env.FORM_RATE_LIMITER, `kontak:${ip}`))) {
    return json({ ok: false, message: 'Terlalu banyak percobaan. Silakan coba lagi dalam satu menit.' }, 429, { 'Retry-After': '60' });
  }

  const body = await readBody(request);
  if (!body) return json({ ok: false, message: 'Format data tidak valid.' }, 400);

  // Honeypot terisi → kemungkinan bot. Balas "sukses" palsu agar bot tidak mencoba ulang.
  if (typeof body.company_website === 'string' && body.company_website.trim() !== '') {
    return json({ ok: true, message: 'Terima kasih! Pesan Anda sudah kami terima.' });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, message: 'Mohon periksa kembali isian form.', errors: fieldErrors(parsed.error.issues) }, 422);
  }
  const data = parsed.data;

  const captcha = await verifyTurnstile(data.turnstileToken, env.TURNSTILE_SECRET_KEY, ip, 'kontak');
  if (!captcha.success) {
    const status = captcha.reason === 'config' || captcha.reason === 'network' ? 503 : 400;
    return json({ ok: false, message: 'Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.' }, status);
  }

  const delivered = await dispatch(env, {
    name: data.name,
    email: data.email,
    service: data.service,
    budget: data.budget,
    message: data.message,
    ip,
    userAgent: request.headers.get('user-agent') ?? '',
    receivedAt: new Date().toISOString(),
    pageUrl: request.headers.get('referer') ?? undefined,
  });

  if (!delivered) {
    return json({ ok: false, message: 'Maaf, pesan belum terkirim karena gangguan layanan. Silakan hubungi kami lewat WhatsApp atau email.' }, 502);
  }
  return json({ ok: true, message: 'Terima kasih! Pesan Anda sudah kami terima. Kami akan membalas dalam 1×24 jam kerja.' });
};

/** Metode lain tidak didukung. */
export const ALL: APIRoute = () =>
  json({ ok: false, message: 'Metode tidak didukung. Gunakan POST.' }, 405, { Allow: 'POST' });
