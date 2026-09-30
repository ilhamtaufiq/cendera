/**
 * Helper konten (dipakai saat build/prerender).
 * - Draft (`draft: true`) disembunyikan di build produksi, tetap tampil di `npm run dev`.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type Project = CollectionEntry<'proyek'>;

const isVisible = (data: { draft?: boolean }) => (import.meta.env.PROD ? !data.draft : true);

/** Artikel terbit, terbaru dulu. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => isVisible(data));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Proyek terbit; urut `order` lalu tahun terbaru. */
export async function getProjects(): Promise<Project[]> {
  const items = await getCollection('proyek', ({ data }) => isVisible(data));
  return items.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

export async function getTeam() {
  const items = await getCollection('tim');
  return items.sort((a, b) => a.data.order - b.data.order);
}

export async function getJobs() {
  const items = await getCollection('karier', ({ data }) => isVisible(data));
  return items.sort((a, b) => Number(b.data.open) - Number(a.data.open) || b.data.date.valueOf() - a.data.date.valueOf());
}

/** Slug URL proyek: field `slug` bila ada, selain itu id (nama file). */
export const projectSlug = (p: Project) => p.data.slug ?? p.id;

/** Estimasi waktu baca (±200 kata/menit, cukup akurat untuk Bahasa Indonesia). */
export function readingTime(markdown = ''): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`\[\]()!-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(date: Date, style: 'long' | 'short' = 'long') {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** Semua tag beserta jumlah artikel. */
export function collectTags(posts: Post[]) {
  const map = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) map.set(t, (map.get(t) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** Artikel terkait: skor = jumlah tag yang sama (+1 bila kategori sama). */
export function relatedPosts(current: Post, posts: Post[], limit = 3) {
  return posts
    .filter((p) => p.id !== current.id)
    .map((p) => ({
      p,
      score:
        p.data.tags.filter((t) => current.data.tags.includes(t)).length * 2 +
        (p.data.category === current.data.category ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.date.valueOf() - a.p.data.date.valueOf())
    .slice(0, limit)
    .map((x) => x.p);
}
