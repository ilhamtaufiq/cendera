/**
 * Sekali jalan: memvektorkan logo resmi (PNG) menjadi SVG tanpa mengubah bentuk.
 * Sumber : design/brand/cendera-logo-original.png
 * Output : src/assets/brand/logo-path.json (path + viewBox) → dipakai komponen <Logo />
 *          public/images/brand/*.svg (versi transparan, latar gelap, latar terang)
 *
 *   node scripts/trace-logo.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import potrace from 'potrace';

const SRC = 'design/brand/cendera-logo-original.png';
const GREEN = '#00D40E';

// 1) Ambil kanal "hijau vs putih" → bitmap hitam-putih, lalu crop ke bounding box logo.
// PNG asli memakai alpha: area "putih" sebenarnya transparan, jadi yang dihitung adalah alpha + warna.
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
const mask = Buffer.alloc(info.width * info.height);
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    const ink = a > 127 && g > 120 && r < 150 && b < 150; // piksel hijau & tidak transparan
    mask[y * info.width + x] = ink ? 0 : 255;
    if (ink) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  }
}
const pad = 2;
const left = minX - pad, top = minY - pad, width = maxX - minX + 1 + pad * 2, height = maxY - minY + 1 + pad * 2;
const bw = await sharp(mask, { raw: { width: info.width, height: info.height, channels: 1 } })
  .extract({ left, top, width, height }).toColourspace('srgb').flatten({ background: '#ffffff' }).png({ palette: false }).toBuffer();

// 2) Trace (potrace) — alphaMax rendah menjaga sudut tetap tegas seperti aslinya.
const svg = await new Promise((res, rej) =>
  potrace.trace(bw, { threshold: 128, turdSize: 20, alphaMax: 0.6, optCurve: true, optTolerance: 0.3, color: GREEN, background: 'transparent' },
    (err, out) => (err ? rej(err) : res(out))));
// Bulatkan ke 1 desimal agar ukuran path kecil (perbedaan < 0,1px, tidak terlihat).
const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(' ')
  .replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n) * 10) / 10));
const viewBox = `0 0 ${width} ${height}`;

await mkdir('src/assets/brand', { recursive: true });
await writeFile('src/assets/brand/logo-path.json', JSON.stringify({ viewBox, width, height, d }, null, 2));

const mk = (bg) => {
  const p = Math.round(height * 0.12), W = width + p * 2, H = height + p * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${bg ? W : width} ${bg ? H : height}" role="img" aria-label="Cendera">${
    bg ? `<rect width="${W}" height="${H}" fill="${bg}"/><g transform="translate(${p} ${p})">` : '<g>'
  }<path fill="${GREEN}" fill-rule="evenodd" d="${d}"/></g></svg>\n`;
};
await mkdir('public/images/brand', { recursive: true });
await writeFile('public/images/brand/cendera-logo.svg', mk(null));
await writeFile('public/images/brand/cendera-logo-dark.svg', mk('#0A0A0A'));
await writeFile('public/images/brand/cendera-logo-light.svg', mk('#FFFFFF'));
console.log('Logo traced:', viewBox, `${d.length} chars`);
