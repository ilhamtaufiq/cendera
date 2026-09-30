/**
 * Wrapper Pagefind (indeks pencarian statis yang dibuat setelah build: `pagefind --site dist/client`).
 * Mengembalikan daftar URL hasil yang difilter berdasarkan tipe konten (blog/proyek),
 * atau `null` bila indeks belum tersedia (mis. saat `astro dev`).
 */
type PagefindResult = { url: string; meta: Record<string, string>; excerpt: string };
type Pagefind = {
  options: (o: Record<string, unknown>) => Promise<void>;
  search: (q: string, o?: Record<string, unknown>) => Promise<{ results: { data: () => Promise<PagefindResult> }[] }>;
};

let instance: Promise<Pagefind | null> | null = null;

export function loadPagefind(): Promise<Pagefind | null> {
  instance ??= (async () => {
    try {
      const url = '/pagefind/pagefind.js';
      const pf = (await import(/* @vite-ignore */ url)) as Pagefind;
      await pf.options({ excerptLength: 24 });
      return pf;
    } catch {
      return null;
    }
  })();
  return instance;
}

/** Cari dan kembalikan URL hasil (maks. `limit`). */
export async function pagefindSearch(query: string, type: 'blog' | 'proyek', limit = 50): Promise<string[] | null> {
  const pf = await loadPagefind();
  if (!pf) return null;
  const res = await pf.search(query, { filters: { tipe: type } });
  const data = await Promise.all(res.results.slice(0, limit).map((r) => r.data()));
  return data.map((d) => d.url.replace(/\/$/, ''));
}

/** Versi dengan metadata untuk ditampilkan sebagai daftar hasil. */
export async function pagefindResults(query: string, type: 'blog' | 'proyek', limit = 20): Promise<PagefindResult[] | null> {
  const pf = await loadPagefind();
  if (!pf) return null;
  const res = await pf.search(query, { filters: { tipe: type } });
  return Promise.all(res.results.slice(0, limit).map((r) => r.data()));
}
