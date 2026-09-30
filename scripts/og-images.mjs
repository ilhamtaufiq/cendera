/**
 * Membuat gambar Open Graph (JPEG 1200×630) untuk setiap artikel & proyek dari `cover`-nya.
 * Dijalankan otomatis sebelum build (`prebuild`). Output: public/og/{blog,proyek}/<slug>.jpg
 * (folder ini di-.gitignore karena selalu dibuat ulang).
 *
 * Kenapa JPEG? WhatsApp, Facebook, LinkedIn, dan X paling andal menampilkan JPEG/PNG
 * berukuran 1200×630; cover WebP sering tidak muncul sebagai pratinjau.
 */
import { readdir, readFile, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const W = 1200, H = 630;
const collections = { blog: 'src/content/blog', proyek: 'src/content/proyek' };

const field = (src, name) => src.match(new RegExp(`^${name}:\\s*["']?([^"'\\n#]+?)["']?\\s*(#.*)?$`, 'm'))?.[1]?.trim();

let count = 0;
for (const [type, dir] of Object.entries(collections)) {
  await mkdir(`public/og/${type}`, { recursive: true });
  for (const file of await readdir(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const src = await readFile(join(dir, file), 'utf8');
    const fm = src.split(/^---$/m)[1] ?? '';
    const slug = (type === 'proyek' && field(fm, 'slug')) || file.replace(/\.mdx?$/, '');
    const cover = field(fm, 'cover');
    const input = cover && !/^https?:/.test(cover) ? join('public', cover) : 'public/images/og-default.png';
    try { await access(input); } catch { console.warn(`⚠ cover tidak ditemukan untuk ${type}/${slug}: ${input}`); continue; }
    await sharp(input)
      .resize(W, H, { fit: 'cover', position: 'attention' })
      .flatten({ background: '#0A0A0A' })
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(`public/og/${type}/${slug}.jpg`);
    count++;
  }
}
console.log(`✓ ${count} gambar OG dibuat di public/og/`);
