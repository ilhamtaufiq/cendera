# Cendera — Situs Company Profile

Situs profil perusahaan **Cendera** (Teknologi • Aplikasi • Kreatif).
Dibangun dengan **Astro 7** + **Tailwind CSS 4**, konten blog & proyek berupa **file Markdown di Git**,
dan dijalankan di **Cloudflare Workers** (halaman statis via Workers Static Assets, form via kode Worker).

```
tulis Markdown → git push → Workers Builds: npm run build + wrangler deploy → live di edge Cloudflare
```

---

## Daftar isi

1. [Struktur proyek](#struktur-proyek)
2. [Setup lokal](#setup-lokal)
3. [Menambah & mengedit konten](#menambah--mengedit-konten)
4. [Secret & variabel environment](#secret--variabel-environment)
5. [Deploy ke Cloudflare Workers](#deploy-ke-cloudflare-workers)
6. [Arsitektur & keputusan teknis](#arsitektur--keputusan-teknis)
7. [Yang perlu diganti sebelum rilis](#yang-perlu-diganti-sebelum-rilis)

---

## Struktur proyek

```
cendera/
├── src/
│   ├── content/                 # ← KONTEN (Markdown + front matter YAML)
│   │   ├── blog/                #   1 file .md per artikel
│   │   ├── proyek/              #   1 file .md per proyek / studi kasus
│   │   ├── tim/                 #   anggota tim (placeholder)
│   │   └── karier/              #   lowongan
│   ├── content.config.ts        # skema validasi front matter (Zod) — build gagal bila salah
│   ├── data/
│   │   ├── site.ts              # nama, kontak, WhatsApp, alamat, sosial media, menu
│   │   └── home.id.ts           # copy beranda: hero, layanan, proses, FAQ, testimoni, statistik
│   ├── i18n/ui.ts               # teks antarmuka (siap ditambah Bahasa Inggris)
│   ├── pages/
│   │   ├── index.astro          # beranda (single page + anchor)
│   │   ├── proyek/              # /proyek, /proyek/[slug]
│   │   ├── blog/                # /blog, /blog/[slug], /blog/tag/[tag], /blog/kategori/[k], /blog/halaman/[n]
│   │   ├── karier/              # /karier, /karier/[slug]
│   │   ├── api/                 # ← kode Worker: kontak.ts, newsletter.ts (prerender = false)
│   │   ├── kebijakan-privasi.md, syarat-ketentuan.md, 404.astro
│   │   └── rss.xml.ts, robots.txt.ts
│   ├── components/  layouts/  styles/  scripts/
│   └── lib/
│       ├── content.ts           # helper konten (draft, waktu baca, artikel terkait)
│       ├── markdown/            # plugin remark/rehype: callout, figure+caption, lazy image, tabel, video
│       └── api/                 # validasi, Turnstile, rate limit, adapter notifikasi (Resend/webhook)
├── public/
│   ├── _headers                 # header cache & keamanan (CSP diisi otomatis saat build)
│   ├── .assetsignore
│   ├── images/                  # brand/, proyek/, blog/, tim/, og-default.png
│   └── favicon.svg, favicon.ico, apple-touch-icon.png, site.webmanifest
├── templates/                   # template kosong: blog.md, proyek.md, karier.md
├── scripts/
│   ├── trace-logo.mjs           # vektorisasi logo resmi PNG → SVG (sekali jalan)
│   ├── generate-images.mjs      # mockup proyek, cover blog, OG image, favicon (data dummy)
│   └── postbuild.mjs            # indeks Pagefind + hash CSP
├── design/brand/                # file logo resmi (sumber)
├── .github/workflows/deploy.yml # alternatif deploy via GitHub Actions
├── astro.config.mjs
├── wrangler.jsonc
├── .dev.vars.example            # secret lokal (Worker)
└── .env.example                 # variabel build-time (Astro)
```

---

## Setup lokal

Prasyarat: **Node.js 22+** dan npm.

```bash
npm install
cp .env.example .env              # variabel build-time (site key Turnstile uji, dsb.)
cp .dev.vars.example .dev.vars    # secret Worker lokal (kunci uji Turnstile, dsb.)

npm run dev       # Astro dev server → http://localhost:4321 (halaman; draft ikut tampil)
npm run preview   # build produksi + wrangler dev → http://localhost:8787 (halaman + /api/* di workerd)
npm run check     # cek tipe TypeScript & Astro
npm run build     # build produksi ke dist/ (+ Pagefind + CSP)
npm run deploy    # build + wrangler deploy (butuh `npx wrangler login`)
```

> Pencarian (Pagefind) hanya bekerja setelah build (`npm run preview`). Di `npm run dev`,
> halaman /proyek otomatis memakai pencarian teks sederhana sebagai fallback.

Kunci uji Turnstile di `.env.example` / `.dev.vars.example` **selalu lolos** sehingga form bisa diuji
tanpa akun. Dengan `CONTACT_NOTIFIERS=console`, isi pesan hanya dicetak ke log terminal.

---

## Menambah & mengedit konten

Semua konten dibaca dan dirender **saat build** (Worker tidak membaca file saat runtime).
Setiap perubahan cukup di-commit & push — situs akan rebuild otomatis.

### Menambah artikel blog

1. Salin `templates/blog.md` → `src/content/blog/judul-artikel.md`.
   Nama file = URL: `/blog/judul-artikel`.
2. Isi front matter:

   | Field | Wajib | Keterangan |
   | --- | --- | --- |
   | `title` | ✓ | 5–120 karakter |
   | `description` | ✓ | 20–220 karakter; dipakai untuk SEO & kartu |
   | `date` | ✓ | `YYYY-MM-DD` |
   | `updated` | | tanggal pembaruan |
   | `author` | | default "Tim Cendera" |
   | `tags` | | huruf kecil/angka/`-`, mis. `["laravel", "govtech"]` → halaman `/blog/tag/laravel` |
   | `category` | ✓ | `Teknologi` \| `Kreatif` \| `Studi Kasus` \| `Tips` |
   | `cover` | ✓ | path di `public/`, mis. `/images/blog/judul.webp` (16:9, ±1600×900) |
   | `draft` | | `true` = tidak ikut build produksi (tetap tampil di `npm run dev`) |
   | `featured` | | penanda artikel unggulan |

3. Letakkan gambar di `public/images/blog/` (WebP/AVIF disarankan).
4. Commit & push. Bila front matter salah, build **gagal** dengan pesan yang menyebut file & field-nya.

Fitur Markdown yang didukung:

- Heading `##`/`###` → anchor otomatis + daftar isi (TOC)
- Blok kode dengan syntax highlighting (tema terang/gelap) + tombol **Salin**
- Tabel (bisa di-scroll di layar kecil)
- Callout: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` (judul opsional setelah tag)
- Gambar lazy-load; `![alt](/img.webp "Keterangan")` → `<figure>` dengan caption
- Embed video: tulis `<iframe src="https://www.youtube-nocookie.com/embed/ID" title="..."></iframe>`
- Otomatis: waktu baca, artikel terkait (berdasarkan tag/kategori), tombol bagikan, navigasi sebelumnya/berikutnya

### Menambah proyek

1. Salin `templates/proyek.md` → `src/content/proyek/nama-proyek.md`.
2. Field penting: `category` (`Govtech | Bisnis | Mobile | Web | Kreatif`), `status` (`Live | Dalam Pengembangan | Selesai`),
   `links.live`/`links.repo` (kosongkan bila privat), `related` (slug proyek lain — build gagal bila slug tidak ada),
   `featured: true` agar tampil di beranda (maks. 4), `order` untuk urutan.
3. Opsional: `audience` (label kecil di kartu, mis. "Internal") dan `ecosystem`
   (proyek dengan nilai sama tampil berdampingan di beranda — dipakai untuk Pertamak Hub + SIMAN).
4. Cover rasio 16:10 (±1600×1000) di `public/images/proyek/`.

### Tim & karier

- Tim: `src/content/tim/*.md` (`name`, `role`, `photo`, `order`, `socials`). Hapus `placeholder: true` setelah diisi data asli.
- Karier: salin `templates/karier.md` → `src/content/karier/`. `open: false` menandai lowongan ditutup.

### Teks halaman beranda, kontak, dan legal

- Copy beranda (hero, layanan, proses, tentang, testimoni, FAQ, statistik, logo klien): `src/data/home.id.ts`
- Kontak, WhatsApp, alamat, jam kerja, sosial media, menu: `src/data/site.ts`
- Kebijakan Privasi & Syarat Ketentuan: `src/pages/kebijakan-privasi.md`, `src/pages/syarat-ketentuan.md`

### Menambah Bahasa Inggris (nanti)

1. `astro.config.mjs` → `i18n.locales: ['id', 'en']`.
2. Isi `ui.en` di `src/i18n/ui.ts`, buat `src/data/home.en.ts`.
3. Buat halaman di `src/pages/en/` dan (opsional) folder konten `src/content/blog/en/`.
4. Tambahkan `<link rel="alternate" hreflang="en">` di `BaseHead.astro`.

---

## Secret & variabel environment

| Nama | Jenis | Dipakai | Cara set di produksi |
| --- | --- | --- | --- |
| `TURNSTILE_SECRET_KEY` | secret | Worker | `npx wrangler secret put TURNSTILE_SECRET_KEY` |
| `RESEND_API_KEY` | secret | Worker | `npx wrangler secret put RESEND_API_KEY` |
| `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_TOKEN` | secret | Worker (opsional) | `npx wrangler secret put ...` |
| `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | var | Worker | `vars` di `wrangler.jsonc` |
| `CONTACT_NOTIFIERS` | var | Worker | `resend`, `webhook`, `console` (pisah koma) |
| `ALLOWED_ORIGINS` | var | Worker | origin yang boleh POST ke `/api/*` |
| `SITE_URL` | build | Astro | Workers Builds → *Variables and secrets* (build) |
| `PUBLIC_TURNSTILE_SITE_KEY` | build | halaman | idem |
| `PUBLIC_CF_BEACON_TOKEN` | build | analitik (opsional) | idem |
| `PUBLIC_UMAMI_SRC`, `PUBLIC_UMAMI_WEBSITE_ID` | build | analitik (opsional) | idem |

Tidak ada secret yang di-commit: `.env` dan `.dev.vars` sudah ada di `.gitignore`.

**Turnstile:** Dashboard Cloudflare → Turnstile → *Add widget* → masukkan domain (dan domain `*.workers.dev` untuk preview)
→ salin *site key* ke `PUBLIC_TURNSTILE_SITE_KEY` (build) dan *secret key* ke `TURNSTILE_SECRET_KEY` (Worker secret).

**Resend:** verifikasi domain pengirim di Resend, lalu set `CONTACT_FROM_EMAIL` ke alamat di domain itu.

**Adapter notifikasi:** lihat `src/lib/api/notifiers/`. Untuk menambah kanal lain (Telegram, Slack, gateway WhatsApp
seperti Fonnte/Wablas), buat adapter yang mengimplementasikan `Notifier`, daftarkan di `notifiers/index.ts`, lalu tambahkan
namanya ke `CONTACT_NOTIFIERS`. Adapter `webhook` sudah mengirim field `text` yang siap diteruskan ke WhatsApp.

**Newsletter:** email disimpan di Workers KV (binding `NEWSLETTER`, dibuat otomatis saat deploy pertama).
Ekspor daftar: `npx wrangler kv key list --binding NEWSLETTER --prefix sub: --remote`.

**Rate limit:** binding Workers Rate Limiting `FORM_RATE_LIMITER` (5 permintaan / 60 detik per IP per form),
diatur di `wrangler.jsonc` → `ratelimits`.

---

## Deploy ke Cloudflare Workers

### Opsi A — Workers Builds (disarankan)

1. Push repositori ini ke GitHub.
2. Dashboard Cloudflare → **Workers & Pages → Create → Import a repository** → pilih repo.
3. Pengaturan build:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Non-production branch deploy command:** `npx wrangler versions upload` (menghasilkan *preview URL* per branch)
   - **Root directory:** `/`
4. *Settings → Build → Variables and secrets*: isi `SITE_URL`, `PUBLIC_TURNSTILE_SITE_KEY`, dan (opsional) analitik.
5. Set secret Worker (sekali saja):
   ```bash
   npx wrangler login
   npx wrangler secret put TURNSTILE_SECRET_KEY
   npx wrangler secret put RESEND_API_KEY
   ```
6. Setiap push ke `main` → build + deploy produksi. Push ke branch lain → preview deployment untuk direview.

Nama Worker di dashboard harus sama dengan `name` di `wrangler.jsonc` (`cendera-web`).

### Opsi B — GitHub Actions

Workflow siap pakai di `.github/workflows/deploy.yml` (produksi dari `main`, preview untuk PR/branch lain).
Tambahkan secret repo `CLOUDFLARE_API_TOKEN` dan `CLOUDFLARE_ACCOUNT_ID`, serta variables `SITE_URL` dan
`PUBLIC_TURNSTILE_SITE_KEY`. **Pakai salah satu opsi saja** agar tidak deploy ganda (hapus/disable workflow bila memakai Opsi A).

### Domain kustom

Dashboard → Worker `cendera-web` → *Settings → Domains & Routes → Add → Custom Domain* (SSL otomatis),
atau aktifkan blok `routes` di `wrangler.jsonc`:

```jsonc
"routes": [
  { "pattern": "cendera.cianjur.space", "custom_domain": true }
]
```

Jangan lupa perbarui `SITE_URL`, `ALLOWED_ORIGINS`, dan domain di widget Turnstile.

---

## Arsitektur & keputusan teknis

- **Semua halaman di-prerender** (`export const prerender = true`) ke `dist/client/` dan disajikan Workers Static Assets.
  Hanya `/api/*` (`prerender = false`) yang dijalankan sebagai kode Worker (`run_worker_first: ["/api/*"]`).
- **Adapter terbaru (`@astrojs/cloudflare` v14).** Mulai Astro 6, adapter memakai Cloudflare Vite plugin: entrypoint
  Worker ditulis sebagai `"main": "@astrojs/cloudflare/entrypoints/server"`, hasil build berada di `dist/server/`
  (Worker) dan `dist/client/` (aset), dan konfigurasi hasil build `dist/server/wrangler.json` otomatis dipakai
  `wrangler deploy`. Karena itu `main: "./dist/_worker.js/index.js"` dan `assets.directory: "./dist"` (pola lama Astro ≤5)
  **tidak lagi berlaku**; `public/.assetsignore` tetap disertakan untuk kompatibilitas (tidak berbahaya).
- **Env di Worker** diakses dengan `import { env } from 'cloudflare:workers'` (cara resmi sejak Astro 6).
- **Tanpa API Node-only saat runtime.** Endpoint hanya memakai `fetch`, `crypto`, `Request/Response`.
  `sharp` hanya dipakai skrip build lokal (`npm run images`).
- **Markdown** memakai pipeline unified (`@astrojs/markdown-remark`) dengan plugin di `src/lib/markdown/`.
- **Pencarian**: Pagefind dijalankan setelah build atas `dist/client` dan hanya mengindeks halaman blog & proyek
  (`data-pagefind-body`, filter `tipe`).
- **SEO**: sitemap (`/sitemap-index.xml`), `robots.txt`, RSS (`/rss.xml`), canonical, Open Graph & Twitter Card
  (gambar dari `cover`), JSON-LD (Organization, WebSite, BlogPosting, CreativeWork, BreadcrumbList, FAQPage, JobPosting).
- **Keamanan**: `_headers` berisi CSP (hash script inline dihitung otomatis oleh `scripts/postbuild.mjs`),
  HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options.
  Form: validasi Zod di server, Turnstile, honeypot, rate limit per IP, cek Origin, batas ukuran body.
- **Aksesibilitas**: satu `<h1>` per halaman, skip link, fokus keyboard terlihat, label form, `aria-live` untuk status,
  kontras AA (teks hijau di tema terang memakai `--brand-green-700`), `prefers-reduced-motion` dihormati.
- **Desain**: token warna di `src/styles/global.css` (`:root` / `[data-theme='light']`), dark mode default dengan toggle.
  Font di-*self-host* (Fontsource): Space Grotesk (heading), Inter (body), JetBrains Mono (kode).
- **Logo**: `design/brand/cendera-logo-original.png` divektorkan persis dengan `scripts/trace-logo.mjs` →
  `src/assets/brand/logo-path.json` (dipakai inline via `<symbol>`), serta `public/images/brand/cendera-logo{,-dark,-light}.svg`.
  Bila ada file SVG resmi dari desainer, timpa `logo-path.json`/file SVG tersebut.

---

## Troubleshooting

**Form menampilkan kotak "Berhasil! — Hanya untuk pengujian. Jika terlihat, laporkan ke pemilik situs".**
Itu widget Turnstile yang memakai *kunci uji* karena `PUBLIC_TURNSTILE_SITE_KEY` belum diisi saat build.
Buat widget di Dashboard → Turnstile (hostname: `cendera.cianjur.space`), isi *site key* di
Workers Builds → Settings → Build → Variables and secrets, set *secret key* dengan
`npx wrangler secret put TURNSTILE_SECRET_KEY`, lalu build ulang. Build menampilkan peringatan bila kunci belum diisi.
Widget memakai mode `interaction-only`, jadi normalnya tidak terlihat sama sekali.

**Tautan share / canonical berakhiran `.html`.** Sudah ditangani: halaman dibangun sebagai `slug.html`
(`build.format: 'file'`, agar tidak ada redirect trailing slash), dan semua URL publik dibersihkan lewat `src/lib/url.ts`.

**Pratinjau (OG image) tidak muncul saat dibagikan.** Setiap artikel & proyek otomatis mendapat JPEG 1200×630
di `/og/{blog,proyek}/<slug>.jpg` (dibuat `scripts/og-images.mjs` saat `prebuild` dari `cover`). Bila pratinjau lama
masih tersimpan di platform, segarkan cache-nya:
[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/),
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/). WhatsApp menyimpan cache beberapa hari;
untuk uji cepat tambahkan query, mis. `?v=2`.

**Domain.** URL produksi diatur lewat `SITE_URL` (default `https://cendera.cianjur.space`) dan `ALLOWED_ORIGINS`
di `wrangler.jsonc`. Ganti keduanya bila domain berubah.

## SEO

- Judul & deskripsi beranda berfokus lokal (Cianjur): `SITE.homeTitle`, `SITE.description` di `src/data/site.ts`.
- JSON-LD `Organization` + `ProfessionalService` dengan alamat, jam buka, area layanan, dan kontak.
- `robots` dengan `max-image-preview:large`; halaman tag `noindex, follow` dan tidak masuk sitemap (konten tipis).
- Sitemap memuat `lastmod` dari tanggal artikel. Setelah rilis, daftarkan `https://cendera.cianjur.space/sitemap-index.xml`
  di Google Search Console & Bing Webmaster Tools, dan buat/klaim **Google Business Profile** dengan alamat yang sama
  persis (NAP konsisten) untuk pencarian lokal.

## Yang perlu diganti sebelum rilis

Cari kata **`PLACEHOLDER`** di repo untuk menemukan semuanya.

| Bagian | Lokasi |
| --- | --- |
| Email, WhatsApp, pin peta, jam kerja, sosial media (alamat sudah diisi) | `src/data/site.ts` |
| Nama badan hukum & tahun berdiri | `src/data/site.ts` (`legalName`, `foundingYear`) |
| Angka statistik, logo klien, testimoni | `src/data/home.id.ts` |
| Anggota tim + foto | `src/content/tim/*.md`, `public/images/tim/` |
| Screenshot/mockup proyek (sekarang mockup data dummy) | `public/images/proyek/*.webp` |
| Cover artikel | `public/images/blog/*.webp` |
| Domain produksi | `SITE_URL`, `ALLOWED_ORIGINS`, `vars` & `routes` di `wrangler.jsonc` |
| Secret | `wrangler secret put ...` (lihat tabel di atas) |
| Teks legal (konsultasikan dengan penasihat hukum) | `src/pages/kebijakan-privasi.md`, `src/pages/syarat-ketentuan.md` |
