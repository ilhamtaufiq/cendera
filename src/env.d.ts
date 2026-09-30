/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly PUBLIC_CF_BEACON_TOKEN?: string;
  readonly PUBLIC_UMAMI_SRC?: string;
  readonly PUBLIC_UMAMI_WEBSITE_ID?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Modul runtime Cloudflare Workers (disediakan oleh workerd saat runtime). */
declare module 'cloudflare:workers' {
  export const env: Record<string, unknown>;
}
