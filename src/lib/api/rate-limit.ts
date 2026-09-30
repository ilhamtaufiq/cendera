/**
 * Rate limit per IP memakai binding Workers Rate Limiting (`ratelimits` di wrangler.jsonc).
 * Bila binding tidak ada (mis. dev lokal tanpa binding), permintaan diizinkan.
 */
export interface RateLimitBinding {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

export async function checkRateLimit(binding: RateLimitBinding | undefined, key: string) {
  if (!binding) return true;
  try {
    const { success } = await binding.limit({ key });
    return success;
  } catch (err) {
    console.error('Rate limiter error', err);
    return true; // fail-open agar form tetap bisa dipakai bila layanan rate limit bermasalah
  }
}
