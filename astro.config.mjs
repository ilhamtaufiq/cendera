// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkCallouts } from './src/lib/markdown/remark-callouts.mjs';
import { rehypeFigures } from './src/lib/markdown/rehype-figures.mjs';
import { rehypeExternalLinks } from './src/lib/markdown/rehype-external-links.mjs';

// URL produksi. Ganti lewat env SITE_URL (mis. di Workers Builds → Variables) bila domain berubah.
const SITE = process.env.SITE_URL ?? 'https://cendera.id';

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
      filter: (page) => !page.includes('/api/'),
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
