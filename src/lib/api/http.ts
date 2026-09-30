/**
 * Utilitas HTTP untuk endpoint Worker: respons JSON, cek Origin, IP klien, parse body.
 * Hanya memakai Web API standar (kompatibel runtime Cloudflare Workers).
 */
export type ApiBody = { ok: boolean; message: string; errors?: Record<string, string> };

export function json(body: ApiBody, status = 200, extra: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extra,
    },
  });
}

export const clientIp = (request: Request) =>
  request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

/** Tolak permintaan lintas origin (CSRF sederhana). `allowed` = daftar origin dipisah koma. */
export function isAllowedOrigin(request: Request, allowed?: string) {
  const origin = request.headers.get('origin');
  if (!origin) return true; // beberapa klien tidak mengirim Origin untuk same-origin
  const self = new URL(request.url).origin;
  const list = (allowed ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return origin === self || list.includes(origin);
}

/** Terima JSON maupun form-urlencoded/multipart (fallback tanpa JS). Batasi ukuran body. */
export async function readBody(request: Request, maxBytes = 16_384): Promise<Record<string, unknown> | null> {
  const len = Number(request.headers.get('content-length') ?? 0);
  if (len > maxBytes) return null;
  const type = request.headers.get('content-type') ?? '';
  try {
    if (type.includes('application/json')) {
      const text = await request.text();
      if (text.length > maxBytes) return null;
      return JSON.parse(text);
    }
    if (type.includes('form')) return Object.fromEntries((await request.formData()).entries());
  } catch {
    return null;
  }
  return null;
}

/** Ubah error Zod menjadi { field: pesan } untuk ditampilkan di form. */
export function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const key = String(i.path[0] ?? 'form');
    out[key] ??= i.message;
  }
  return out;
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
