/**
 * Skema konten (content collections). Front matter divalidasi Zod saat build:
 * bila ada field wajib yang hilang / salah tipe, `npm run build` GAGAL dengan pesan jelas.
 * Semua Markdown dibaca & dirender saat build — Worker tidak membaca file di runtime.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Path gambar di folder public/ (diawali "/") atau URL absolut. */
const imagePath = z
  .string()
  .regex(/^(\/|https?:\/\/)/, 'Gunakan path diawali "/" (folder public) atau URL lengkap');

export const BLOG_CATEGORIES = ['Teknologi', 'Kreatif', 'Studi Kasus', 'Tips'] as const;
export const PROJECT_CATEGORIES = ['Govtech', 'Bisnis', 'Mobile', 'Web', 'Kreatif'] as const;
export const PROJECT_STATUS = ['Live', 'Dalam Pengembangan', 'Selesai'] as const;

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(5).max(120),
    description: z.string().min(20).max(220),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Tim Cendera'),
    tags: z.array(z.string().regex(/^[a-z0-9-]+$/, 'Tag huruf kecil, angka, dan tanda "-" saja')).default([]),
    category: z.enum(BLOG_CATEGORIES),
    // Foto/gambar penulis (opsional). Cover bertema Cendera (gambar + judul + kategori)
    // dibuat OTOMATIS saat build → /covers/blog/<slug>.webp (scripts/build-images.mjs).
    image: imagePath.optional(),
    imageAlt: z.string().optional(),
    // Opsional: cover jadi buatan sendiri (menonaktifkan cover otomatis untuk artikel ini).
    cover: imagePath.optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const proyek = defineCollection({
  loader: glob({ base: './src/content/proyek', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    // Opsional: bila diisi, dipakai sebagai URL (/proyek/<slug>); bila tidak, nama file.
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    category: z.enum(PROJECT_CATEGORIES),
    type: z.array(z.string()).min(1),
    year: z.number().int().min(2000).max(2100),
    status: z.enum(PROJECT_STATUS),
    client: z.string(),
    summary: z.string().min(20).max(300),
    cover: imagePath,
    coverAlt: z.string().optional(),
    gallery: z.array(imagePath).default([]),
    tech: z.array(z.string()).default([]),
    links: z
      .object({
        live: z.union([z.url(), z.literal('')]).default(''),
        liveLabel: z.string().default('Kunjungi Situs'),
        repo: z.union([z.url(), z.literal('')]).default(''),
      })
      .default({ live: '', liveLabel: 'Kunjungi Situs', repo: '' }),
    related: z.array(z.string()).default([]),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    // Label kecil opsional di kartu (mis. "Internal", "Layanan Publik").
    audience: z.string().optional(),
    // Kelompok ekosistem (proyek dengan nilai sama ditampilkan berdampingan di beranda).
    ecosystem: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

const tim = defineCollection({
  loader: glob({ base: './src/content/tim', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: imagePath.optional(),
    order: z.number().default(99),
    socials: z
      .object({
        linkedin: z.string().optional(),
        github: z.string().optional(),
        instagram: z.string().optional(),
        website: z.string().optional(),
      })
      .default({}),
    placeholder: z.boolean().default(false),
  }),
});

const karier = defineCollection({
  loader: glob({ base: './src/content/karier', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['Penuh Waktu', 'Paruh Waktu', 'Kontrak', 'Magang', 'Freelance']),
    location: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    open: z.boolean().default(true),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, proyek, tim, karier };
