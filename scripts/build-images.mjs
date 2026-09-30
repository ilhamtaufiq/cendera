/**
 * Gambar otomatis bertema Cendera, dibuat sebelum build/dev (`prebuild`, `predev`):
 *
 * 1. COVER ARTIKEL (WebP 1600×900) — public/covers/blog/<slug>.webp
 *    Disusun dari front matter: `image` (foto/gambar penulis, opsional), judul, kategori,
 *    tanggal, waktu baca, dan logo. Penulis cukup mengisi `image:`; tidak perlu desain manual.
 *    Dilewati bila artikel mengisi `cover:` sendiri (override manual).
 *
 * 2. KARTU OPEN GRAPH bergaya kartu GitHub (PNG 1200×630):
 *   public/og/blog/<slug>.png     — per artikel
 *   public/og/proyek/<slug>.png   — per proyek
 *   public/og/pages/<nama>.png    — beranda, blog, proyek, karier
 *
 * Teks dirender dengan Satori (teks → path SVG memakai font yang dibawa sendiri),
 * lalu dikonversi ke PNG dengan sharp. Jadi hasilnya sama persis di laptop maupun
 * di server Workers Builds yang tidak punya font terpasang.
 */
import { readdir, readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { parse as parseYaml } from 'yaml';

const W = 1200, H = 630;
const GREEN = '#00D40E';
const HOST = new URL(process.env.SITE_URL ?? 'https://cendera.cianjur.space').host;

const font = (pkg, file) => readFile(`node_modules/@fontsource/${pkg}/files/${file}`);
const fonts = [
  { name: 'Space Grotesk', data: await font('space-grotesk', 'space-grotesk-latin-700-normal.woff'), weight: 700 },
  { name: 'Space Grotesk', data: await font('space-grotesk', 'space-grotesk-latin-500-normal.woff'), weight: 500 },
  { name: 'Inter', data: await font('inter', 'inter-latin-400-normal.woff'), weight: 400 },
  { name: 'Inter', data: await font('inter', 'inter-latin-500-normal.woff'), weight: 500 },
  { name: 'JetBrains Mono', data: await font('jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff'), weight: 500 },
];

const logo = JSON.parse(await readFile('src/assets/brand/logo-path.json', 'utf8'));
const svgUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const logoUri = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${logo.viewBox}"><path fill="${GREEN}" fill-rule="evenodd" d="${logo.d}"/></svg>`);
const logoOutlineUri = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${logo.viewBox}"><path fill="none" stroke="${GREEN}" stroke-opacity="0.18" stroke-width="3" fill-rule="evenodd" d="${logo.d}"/></svg>`);
const [, , LW, LH] = logo.viewBox.split(' ').map(Number);

// Pola heksagonal (motif logo) sebagai latar
const r = 46, hw = r * Math.sqrt(3), hh = r * 3;
const hex = (cx, cy) => [0, 1, 2, 3, 4, 5].map((i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
let hexes = '';
for (let y = -1; y < H / hh + 1; y++) for (let x = -1; x < W / hw + 1; x++) {
  hexes += `<polygon points="${hex(x * hw + hw / 2, y * hh + r)}"/><polygon points="${hex(x * hw, y * hh + r * 2.5)}"/>`;
}
const patternUri = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><g fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1.5">${hexes}</g></svg>`);

/** Elemen ala JSX tanpa React. */
const h = (type, style = {}, children) => ({ type, props: { style, children } });
const img = (src, style) => ({ type: 'img', props: { src, style } });

const clip = (s = '', n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

/**
 * Kartu OG.
 * @param {{ section: string, title: string, description?: string, meta?: string[], chips?: string[] }} o
 */
function card({ section, title, description = '', meta = [], chips = [] }) {
  const size = title.length > 60 ? 50 : title.length > 36 ? 58 : 68;
  return h('div', { width: W, height: H, display: 'flex', position: 'relative', background: '#0A0A0A', fontFamily: 'Inter', color: '#F5F5F5' }, [
    img(patternUri, { position: 'absolute', left: 0, top: 0, width: W, height: H }),
    h('div', { position: 'absolute', right: -140, top: -160, width: 620, height: 620, borderRadius: 9999, background: 'radial-gradient(circle, rgba(0,212,14,0.22) 0%, rgba(0,212,14,0) 65%)' }),
    img(logoOutlineUri, { position: 'absolute', right: -60, top: -40, height: 720, width: (720 * LW) / LH }),

    h('div', { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '64px 80px 0 80px' }, [
      // Baris atas: domain / bagian
      h('div', { display: 'flex', alignItems: 'center', fontFamily: 'JetBrains Mono', fontSize: 24, color: '#8a8a8a' }, [
        h('div', { width: 12, height: 12, background: GREEN, transform: 'rotate(45deg)', marginRight: 18 }),
        h('span', {}, HOST),
        section ? h('span', { color: '#555', margin: '0 12px' }, '/') : null,
        section ? h('span', { color: '#d4d4d4' }, section) : null,
      ].filter(Boolean)),

      // Judul + deskripsi (kiri) & logo (kanan)
      h('div', { display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }, [
        h('div', { display: 'flex', flexDirection: 'column', width: 820 }, [
          h('div', { fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: -1.5 }, clip(title, 95)),
          description
            ? h('div', { marginTop: 24, fontSize: 27, lineHeight: 1.45, color: '#a3a3a3' }, clip(description, 150))
            : null,
        ].filter(Boolean)),
        img(logoUri, { height: 190, width: (190 * LW) / LH, marginRight: 8 }),
      ]),

      // Baris info bawah (seperti statistik repo di GitHub)
      h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 46 }, [
        h('div', { display: 'flex', alignItems: 'center', fontSize: 23, color: '#a3a3a3' },
          meta.flatMap((m, i) => [
            i ? h('div', { width: 6, height: 6, borderRadius: 9999, background: '#4a4a4a', margin: '0 18px' }) : null,
            h('span', { color: i === 0 ? GREEN : '#a3a3a3', fontWeight: 500 }, m),
          ]).filter(Boolean)),
        h('div', { display: 'flex' },
          chips.slice(0, 3).map((c) => h('div', {
            display: 'flex', marginLeft: 10, padding: '6px 14px', borderRadius: 999, border: '1.5px solid #2e2e2e',
            background: '#151515', fontFamily: 'JetBrains Mono', fontSize: 19, color: '#c4c4c4',
          }, c))),
      ]),
    ]),

    // Garis aksen bawah (seperti bar bahasa di kartu GitHub)
    h('div', { position: 'absolute', left: 0, bottom: 0, width: W, height: 10, display: 'flex' }, [
      h('div', { width: '62%', height: '100%', background: GREEN }),
      h('div', { width: '26%', height: '100%', background: '#067A10' }),
      h('div', { width: '12%', height: '100%', background: '#3a3a3a' }),
    ]),
  ]);
}

async function render(file, opts) {
  const svg = await satori(card(opts), { width: W, height: H, fonts });
  await mkdir(file.split('/').slice(0, -1).join('/'), { recursive: true });
  await writeFile(file, await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: false }).toBuffer());
}

const fmtDate = (d) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date(d));
const readTime = (body) => Math.max(1, Math.round(body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length / 200));

async function entries(dir) {
  const out = [];
  for (const f of await readdir(dir)) {
    if (!/\.mdx?$/.test(f)) continue;
    const src = await readFile(join(dir, f), 'utf8');
    const [, fm = '', ...rest] = src.split(/^---\s*$/m);
    out.push({ id: f.replace(/\.mdx?$/, ''), data: parseYaml(fm) ?? {}, body: rest.join('---') });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Cover artikel otomatis (1600×900)                                   */
/* ------------------------------------------------------------------ */
const CW = 1600, CH = 900;
const coverPatternUri = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}"><g fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1.5">${
  (() => { let s = ''; for (let y = -1; y < CH / hh + 1; y++) for (let x = -1; x < CW / hw + 1; x++) s += `<polygon points="${hex(x * hw + hw / 2, y * hh + r)}"/><polygon points="${hex(x * hw, y * hh + r * 2.5)}"/>`; return s; })()
}</g></svg>`);

/** Muat gambar penulis (path di public/ atau URL) → data URI JPEG yang sudah diperkecil. */
async function loadImage(src, where) {
  let buf;
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`[${where}] gagal mengunduh image "${src}" (${res.status})`);
    buf = Buffer.from(await res.arrayBuffer());
  } else {
    const file = join('public', src);
    try { await access(file); } catch { throw new Error(`[${where}] image tidak ditemukan: ${file} — taruh gambarnya di folder public/ (mis. public/images/blog/).`); }
    buf = await readFile(file);
  }
  const jpg = await sharp(buf).rotate().resize(1100, 900, { fit: 'cover', position: 'attention' }).jpeg({ quality: 86 }).toBuffer();
  return `data:image/jpeg;base64,${jpg.toString('base64')}`;
}

function coverCard({ title, category, date, minutes, author, photo }) {
  const len = title.length;
  const size = photo ? (len > 60 ? 62 : len > 38 ? 72 : 84) : (len > 70 ? 70 : len > 40 ? 82 : 96);
  const textWidth = photo ? 860 : 1180;
  return h('div', { width: CW, height: CH, display: 'flex', position: 'relative', background: '#0A0A0A', fontFamily: 'Inter', color: '#F5F5F5' }, [
    img(coverPatternUri, { position: 'absolute', left: 0, top: 0, width: CW, height: CH }),
    photo
      ? img(photo, { position: 'absolute', right: 0, top: 0, width: 1100, height: CH, objectFit: 'cover' })
      : img(logoOutlineUri, { position: 'absolute', right: -80, top: -60, height: 1020, width: (1020 * LW) / LH }),
    // Gradasi agar teks selalu terbaca di atas foto apa pun
    photo
      ? h('div', { position: 'absolute', left: 0, top: 0, width: CW, height: CH, background: 'linear-gradient(90deg, #0A0A0A 0%, #0A0A0A 34%, rgba(10,10,10,0.82) 50%, rgba(10,10,10,0.25) 78%, rgba(10,10,10,0.05) 100%)' })
      : h('div', { position: 'absolute', right: -200, top: -220, width: 900, height: 900, borderRadius: 9999, background: 'radial-gradient(circle, rgba(0,212,14,0.24) 0%, rgba(0,212,14,0) 65%)' }),
    h('div', { position: 'absolute', left: 0, bottom: 0, width: CW, height: 260, background: 'linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.85) 100%)' }),

    h('div', { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '90px 110px 0 110px' }, [
      h('div', { display: 'flex', alignItems: 'center' }, [
        img(logoUri, { height: 64, width: (64 * LW) / LH, marginRight: 22 }),
        h('span', { fontFamily: 'JetBrains Mono', fontSize: 26, letterSpacing: 4, color: '#a3a3a3' }, 'CENDERA · BLOG'),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', width: textWidth }, [
        h('div', { display: 'flex' }, [
          h('div', { display: 'flex', padding: '10px 22px', borderRadius: 999, background: 'rgba(0,212,14,0.14)', border: '1.5px solid rgba(0,212,14,0.45)', color: GREEN, fontFamily: 'JetBrains Mono', fontSize: 24, letterSpacing: 2 }, category.toUpperCase()),
        ]),
        h('div', { marginTop: 34, fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: -2 }, clip(title, 110)),
      ]),
      h('div', { display: 'flex', alignItems: 'center', paddingBottom: 80, fontSize: 28, color: '#c4c4c4' },
        [date, `${minutes} menit baca`, author].filter(Boolean).flatMap((m, i) => [
          i ? h('div', { width: 7, height: 7, borderRadius: 9999, background: GREEN, margin: '0 22px' }) : null,
          h('span', {}, m),
        ]).filter(Boolean)),
    ]),
    h('div', { position: 'absolute', left: 0, bottom: 0, width: CW, height: 12, display: 'flex' }, [
      h('div', { width: '62%', height: '100%', background: GREEN }),
      h('div', { width: '26%', height: '100%', background: '#067A10' }),
      h('div', { width: '12%', height: '100%', background: '#3a3a3a' }),
    ]),
  ]);
}

let n = 0;
const fmtLong = (d) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date(d));
for (const { id, data: d, body } of await entries('src/content/blog')) {
  if (d.cover) continue; // cover manual → tidak dibuat otomatis
  const photo = d.image ? await loadImage(d.image, `blog/${id}`) : null;
  const svg = await satori(coverCard({ title: d.title, category: d.category, date: fmtLong(d.date), minutes: readTime(body), author: d.author, photo }), { width: CW, height: CH, fonts });
  await mkdir('public/covers/blog', { recursive: true });
  await writeFile(`public/covers/blog/${id}.webp`, await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer());
  n++;
}

for (const { id, data: d, body } of await entries('src/content/blog')) {
  await render(`public/og/blog/${id}.png`, {
    section: 'blog', title: d.title, description: d.description,
    meta: [d.category, fmtDate(d.date), `${readTime(body)} menit baca`], chips: (d.tags ?? []).map((t) => `#${t}`),
  });
  n++;
}
for (const { id, data: d } of await entries('src/content/proyek')) {
  await render(`public/og/proyek/${d.slug ?? id}.png`, {
    section: 'proyek', title: d.title, description: d.subtitle,
    meta: [d.category, String(d.year), d.status], chips: d.tech ?? [],
  });
  n++;
}
const pages = {
  home: { section: '', title: 'Dari ide menjadi produk digital yang benar-benar dipakai.', description: 'Studio teknologi & kreatif di Cianjur — aplikasi mobile, web, sistem bisnis, dan govtech.', meta: ['Teknologi', 'Aplikasi', 'Kreatif'], chips: ['Cendera'] },
  blog: { section: 'blog', title: 'Catatan dari dapur Cendera', description: 'Pelajaran teknis, studi kasus, dan tips membangun produk digital.', meta: ['Blog'], chips: ['#teknologi', '#govtech'] },
  proyek: { section: 'proyek', title: 'Proyek & studi kasus', description: 'Sistem yang kami rancang, bangun, dan rawat — dari govtech hingga ERP.', meta: ['Portofolio'], chips: ['Govtech', 'Bisnis'] },
  karier: { section: 'karier', title: 'Tumbuh bersama Cendera', description: 'Lowongan engineer, desainer, dan kreator konten.', meta: ['Karier'], chips: [] },
};
for (const [name, o] of Object.entries(pages)) { await render(`public/og/pages/${name}.png`, o); n++; }
console.log(`✓ ${n} gambar dibuat (cover di public/covers/, kartu OG di public/og/)`);
