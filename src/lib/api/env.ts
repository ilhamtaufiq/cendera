/**
 * Akses environment Worker (bindings, vars, secrets) — cara resmi sejak Astro 6:
 *   import { env } from 'cloudflare:workers'
 * Tipe di bawah mendokumentasikan binding yang dipakai endpoint (sengaja minimal agar tidak
 * bentrok dengan tipe DOM di kode klien).
 */
import { env as cfEnv } from 'cloudflare:workers';
import type { RateLimitBinding } from './rate-limit';
import type { NotifierEnv } from './notifiers';

/** Subset API Workers KV yang dipakai. */
export interface KVLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

export interface AppEnv extends NotifierEnv {
  TURNSTILE_SECRET_KEY?: string;
  ALLOWED_ORIGINS?: string;
  FORM_RATE_LIMITER?: RateLimitBinding;
  NEWSLETTER?: KVLike;
}

export const env = cfEnv as AppEnv;
