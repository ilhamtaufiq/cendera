/**
 * Langkah setelah `astro build`:
 * 1. Membuat indeks pencarian Pagefind dari HTML di dist/client (hanya konten blog & proyek).
 * 2. Menyusun Content-Security-Policy: menghitung hash SHA-256 setiap <script> inline di HTML
 *    lalu menyuntikkannya ke dist/client/_headers (menggantikan placeholder __CSP__).
 * Dijalankan otomatis oleh `npm run build`.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const OUT = 'dist/client';

// 1) Pagefind
execFileSync('npx', ['pagefind', '--site', OUT, '--force-language', 'id'], { stdio: 'inherit' });

// 2) CSP
async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}
const hashes = new Set();
const re = /<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g;
for await (const file of walk(OUT)) {
  const html = await readFile(file, 'utf8');
  for (const m of html.matchAll(re)) {
    if (!m[1].trim()) continue;
    hashes.add(`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
  }
}

const env = process.env;
const umamiOrigin = env.PUBLIC_UMAMI_SRC ? new URL(env.PUBLIC_UMAMI_SRC).origin : '';
const csp = [
  "default-src 'self'",
  `script-src 'self' 'wasm-unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com ${umamiOrigin} ${[...hashes].join(' ')}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com ${umamiOrigin}`,
  'frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
]
  .map((d) => d.replace(/\s+/g, ' ').trim())
  .join('; ');

const headersPath = join(OUT, '_headers');
const headers = await readFile(headersPath, 'utf8');
const PLACEHOLDER = 'Content-Security-Policy: __CSP__';
if (!headers.includes(PLACEHOLDER)) throw new Error(`"${PLACEHOLDER}" tidak ditemukan di _headers`);
await writeFile(headersPath, headers.replace(PLACEHOLDER, `Content-Security-Policy: ${csp}`));
console.log(`✓ CSP ditulis ke ${headersPath} (${hashes.size} hash script inline)`);
