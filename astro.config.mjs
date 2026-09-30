// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';
import { unified } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkCallouts } from './src/lib/markdown/remark-callouts.mjs';
import { rehypeFigures } from './src/lib/markdown/rehype-figures.mjs';
import { rehypeExternalLinks } from './src/lib/markdown/rehype-external-links.mjs';

// URL produksi. Ganti lewat env SITE_URL (mis. di Workers Builds → Variables) bila domain berubah.
const SITE = process.env.SITE_URL ?? 'https://cendera.cianjur.space';

if (process.argv.includes('build') && !process.env.PUBLIC_TURNSTILE_SITE_KEY) {
  console.warn(
    '\n⚠  PUBLIC_TURNSTILE_SITE_KEY belum diset → form memakai kunci UJI Turnstile ("Hanya untuk pengujian").\n' +
      '   Isi di Workers Builds → Settings → Build → Variables and secrets, lalu build ulang.\n',
  );
}

/** lastmod sitemap: tanggal `updated`/`date` artikel blog (dibaca dari front matter). */
const lastmod = new Map();
for (const f of readdirSync('./src/content/blog')) {
  const fm = readFileSync(`./src/content/blog/${f}`, 'utf8').split(/^---$/m)[1] ?? '';
  const d = fm.match(/^updated:\s*([\d-]+)/m)?.[1] ?? fm.match(/^date:\s*([\d-]+)/m)?.[1];
  if (d) lastmod.set(`/blog/${f.replace(/\.mdx?$/, '')}`, new Date(d).toISOString());
}

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  // format 'file' → /blog/slug.html disajikan di /blog/slug tanpa redirect trailing slash di Workers Assets.
  build: { format: 'file' },

  // Semua halaman di-prerender (static). Hanya /api/* yang `prerender = false` → dijalankan Worker.
  output: 'static',
  adapter: cloudflare({
    // Gambar sudah dioptimasi saat build (scripts/generate-images.mjs); runtime tidak memproses gambar.
    imageService: 'passthrough',
    // Semua halaman statis dirender saat build di Node (membaca Markdown dari disk);
    // Worker di produksi hanya menjalankan /api/*.
    prerenderEnvironment: 'node',
  }),
  // Situs tidak memakai Astro Sessions → tidak perlu KV SESSION.
  session: false,

  // Siap multi-bahasa: tambahkan 'en' ke `locales` lalu buat halaman di src/pages/en/.
  i18n: {
    defaultLocale: 'id',
    locales: ['id'],
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    sitemap({
      // Halaman tag (konten tipis, noindex) tidak dimasukkan ke sitemap.
      filter: (page) => !page.includes('/api/') && !page.includes('/blog/tag/'),
      serialize: (item) => {
        const path = new URL(item.url).pathname.replace(/\/$/, '');
        const mod = lastmod.get(path);
        if (mod) item.lastmod = mod;
        if (path === '' || path === '/') item.priority = 1.0;
        return item;
      },
      i18n: { defaultLocale: 'id', locales: { id: 'id-ID' } },
    }),
  ],

  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: false,
    },
    // Pipeline remark/rehype: callout, anchor heading, figure+caption+lazy image, tautan eksternal.
    processor: unified({
      remarkPlugins: [remarkCallouts],
      rehypePlugins: [
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: { className: ['heading-anchor'], ariaHidden: 'true', tabIndex: -1 },
            content: { type: 'text', value: '#' },
          },
        ],
        rehypeFigures,
        rehypeExternalLinks,
      ],
    }),
  },

  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },

  vite: {
    plugins: [tailwindcss()],
  },
});
