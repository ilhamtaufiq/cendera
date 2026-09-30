/**
 * Generator gambar (dijalankan manual saat build-time, BUKAN di Worker):
 *   npm run images
 *
 * Menghasilkan:
 * - Cover & galeri proyek (mockup SVG → WebP) — SEMUA DATA DUMMY, bukan data asli klien.
 * (Cover artikel blog kini dibuat otomatis saat build oleh scripts/build-images.mjs.)
 * - Foto placeholder anggota tim.
 * - Gambar Open Graph default (PNG 1200×630), favicon (SVG/ICO/PNG), ikon manifest.
 *
 * Ganti gambar placeholder dengan screenshot/foto asli kapan saja — cukup timpa file WebP
 * di public/images/... dengan nama yang sama (rasio 16:10 untuk proyek, 16:9 untuk blog).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const logo = JSON.parse(await readFile('src/assets/brand/logo-path.json', 'utf8'));
const G = '#00D40E';
const BG = '#0A0A0A';
const FONT = "'Space Grotesk', 'Inter', 'DejaVu Sans', sans-serif";
const SANS = "'Inter', 'DejaVu Sans', sans-serif";
const MONO = "'DejaVu Sans Mono', monospace";

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const logoMark = (x, y, h, color = G) => {
  const [, , vw, vh] = logo.viewBox.split(' ').map(Number);
  const s = h / vh;
  return `<g transform="translate(${x} ${y}) scale(${s})"><path fill="${color}" fill-rule="evenodd" d="${logo.d}"/></g>`;
};
const hexPattern = (id, size = 64, stroke = '#ffffff', op = 0.05) => {
  const w = size * Math.sqrt(3), h = size * 3;
  const r = size;
  const pts = (cx, cy) => [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
    <g fill="none" stroke="${stroke}" stroke-opacity="${op}" stroke-width="1.5">
      <polygon points="${pts(w / 2, r)}"/><polygon points="${pts(0, r * 2.5)}"/><polygon points="${pts(w, r * 2.5)}"/>
    </g></pattern>`;
};
const text = (x, y, s, { size = 16, fill = '#E5E5E5', weight = 400, font = SANS, anchor = 'start', op = 1 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" fill-opacity="${op}" text-anchor="${anchor}">${esc(s)}</text>`;
const rect = (x, y, w, h, { r = 10, fill = '#151515', stroke = '#262626', sw = 1.5, op = 1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" fill-opacity="${op}" stroke="${stroke}" stroke-width="${sw}"/>`;

/** Kanvas dasar: latar gelap + pattern heksagonal + glow hijau. */
const canvas = (W, H, inner, { glow = [0.8, 0.1] } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${hexPattern('hex')}
    <radialGradient id="glow" cx="${glow[0]}" cy="${glow[1]}" r="0.6"><stop offset="0" stop-color="${G}" stop-opacity="0.28"/><stop offset="1" stop-color="${G}" stop-opacity="0"/></radialGradient>
    <linearGradient id="barg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${G}" stop-opacity="0.25"/><stop offset="1" stop-color="${G}"/></linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#000" flood-opacity="0.6"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#hex)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${inner}
</svg>`;

/** Jendela browser dengan sidebar aplikasi. */
const browser = (x, y, w, h, { url, app, body, nav = ['Dashboard', 'Peta', 'Laporan', 'Dokumen'] }) => `
  <g filter="url(#shadow)">${rect(x, y, w, h, { r: 18, fill: '#111111', stroke: '#2a2a2a', sw: 2 })}</g>
  <g>
    <circle cx="${x + 28}" cy="${y + 26}" r="7" fill="#ff5f57"/><circle cx="${x + 50}" cy="${y + 26}" r="7" fill="#febc2e"/><circle cx="${x + 72}" cy="${y + 26}" r="7" fill="#28c840"/>
    ${rect(x + 100, y + 12, w - 200, 28, { r: 8, fill: '#1c1c1c', stroke: 'none' })}
    ${text(x + 118, y + 31, url, { size: 14, fill: '#8a8a8a', font: MONO })}
    <line x1="${x}" y1="${y + 52}" x2="${x + w}" y2="${y + 52}" stroke="#262626" stroke-width="1.5"/>
    <rect x="${x}" y="${y + 53}" width="200" height="${h - 54}" fill="#0e0e0e"/>
    <line x1="${x + 200}" y1="${y + 53}" x2="${x + 200}" y2="${y + h}" stroke="#262626" stroke-width="1.5"/>
    ${logoMark(x + 22, y + 74, 34)}
    ${text(x + 50, y + 98, app, { size: 18, weight: 700, fill: '#F5F5F5', font: FONT })}
    ${nav.map((n, i) => `${i === 0 ? rect(x + 14, y + 134 + i * 44, 172, 34, { r: 8, fill: 'rgba(0,212,14,0.12)', stroke: 'none' }) : ''}
      <rect x="${x + 28}" y="${y + 146 + i * 44}" width="10" height="10" rx="2" fill="${i === 0 ? G : '#3a3a3a'}"/>
      ${text(x + 48, y + 156 + i * 44, n, { size: 14, fill: i === 0 ? G : '#a3a3a3' })}`).join('')}
    <g transform="translate(${x + 200} ${y + 53})">${body(w - 200, h - 53)}</g>
  </g>`;

/** Ponsel. */
const phone = (x, y, w, h, body) => `
  <g filter="url(#shadow)">${rect(x, y, w, h, { r: 36, fill: '#050505', stroke: '#3a3a3a', sw: 3 })}</g>
  ${rect(x + 10, y + 10, w - 20, h - 20, { r: 28, fill: '#111111', stroke: '#262626' })}
  <rect x="${x + w / 2 - 40}" y="${y + 20}" width="80" height="8" rx="4" fill="#262626"/>
  <g transform="translate(${x + 10} ${y + 40})">${body(w - 20, h - 50)}</g>`;

const stat = (x, y, w, label, value, accent = false) => `${rect(x, y, w, 88, { fill: '#171717' })}
  ${text(x + 18, y + 32, label.toUpperCase(), { size: 12, fill: '#8a8a8a', font: MONO })}
  ${text(x + 18, y + 70, value, { size: 30, weight: 700, fill: accent ? G : '#F5F5F5', font: FONT })}`;

const bars = (x, y, w, h, values) => {
  const bw = w / values.length;
  return values.map((v, i) => `<rect x="${(x + i * bw + 4).toFixed(1)}" y="${(y + h - (h * v) / 100).toFixed(1)}" width="${(bw - 8).toFixed(1)}" height="${((h * v) / 100).toFixed(1)}" rx="3" fill="url(#barg)"/>`).join('');
};
const mapBlock = (x, y, w, h, pins = [], { routes = true } = {}) => `${rect(x, y, w, h, { fill: '#141414' })}
  <clipPath id="mc${x}${y}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/></clipPath>
  <g clip-path="url(#mc${x}${y})" stroke-linecap="round">
    <path d="M${x - 20} ${y + h * 0.7} C ${x + w * 0.3} ${y + h * 0.5}, ${x + w * 0.5} ${y + h * 0.95}, ${x + w + 20} ${y + h * 0.55}" stroke="#2a2a2a" stroke-width="14" fill="none"/>
    <path d="M${x + w * 0.35} ${y - 20} L ${x + w * 0.45} ${y + h + 20}" stroke="#262626" stroke-width="8" fill="none"/>
    <path d="M${x + w * 0.7} ${y - 20} C ${x + w * 0.6} ${y + h * 0.4}, ${x + w * 0.85} ${y + h * 0.6}, ${x + w * 0.75} ${y + h + 20}" stroke="#222" stroke-width="6" fill="none"/>
    <path d="M${x + w * 0.1} ${y + h * 0.2} l ${w * 0.18} ${h * 0.05} l ${w * 0.05} ${h * 0.22} l ${-w * 0.2} ${h * 0.06} z" fill="${G}" fill-opacity="0.08" stroke="${G}" stroke-opacity="0.4"/>
    <path d="M${x + w * 0.55} ${y + h * 0.15} l ${w * 0.25} ${h * 0.08} l ${-w * 0.02} ${h * 0.25} l ${-w * 0.22} ${-h * 0.05} z" fill="${G}" fill-opacity="0.06" stroke="${G}" stroke-opacity="0.3"/>
    ${routes ? `<path d="M${x + w * 0.2} ${y + h * 0.75} L ${x + w * 0.5} ${y + h * 0.45} L ${x + w * 0.8} ${y + h * 0.6}" stroke="${G}" stroke-width="2.5" stroke-dasharray="6 8" fill="none" stroke-opacity="0.7"/>` : ''}
    ${pins.map(([px, py]) => `<circle cx="${x + w * px}" cy="${y + h * py}" r="16" fill="${G}" fill-opacity="0.15"/><circle cx="${x + w * px}" cy="${y + h * py}" r="7" fill="${G}"/>`).join('')}
  </g>`;
const tableRows = (x, y, w, rows, cols) => rows.map((r, i) => `
  <line x1="${x}" y1="${y + i * 46}" x2="${x + w}" y2="${y + i * 46}" stroke="#222" stroke-width="1.5"/>
  ${r.map((c, j) => typeof c === 'object'
    ? `${rect(x + cols[j], y + i * 46 + 12, 90, 24, { r: 12, fill: c.ok ? 'rgba(0,212,14,0.14)' : '#1f1f1f', stroke: 'none' })}${text(x + cols[j] + 45, y + i * 46 + 29, c.t, { size: 12, fill: c.ok ? G : '#a3a3a3', anchor: 'middle' })}`
    : c.startsWith?.('%')
      ? `${rect(x + cols[j], y + i * 46 + 20, 120, 8, { r: 4, fill: '#222', stroke: 'none' })}${rect(x + cols[j], y + i * 46 + 20, 1.2 * Number(c.slice(1)), 8, { r: 4, fill: G, stroke: 'none' })}`
      : text(x + cols[j], y + i * 46 + 30, c, { size: 14, fill: j === 0 ? '#E5E5E5' : '#a3a3a3', font: j === 0 ? SANS : SANS })).join('')}`).join('');
const photoTile = (x, y, w, h, caption, seed = 0) => {
  const hues = ['#1b2a1c', '#1e2419', '#1a221f', '#232018'];
  return `${rect(x, y, w, h, { fill: hues[seed % 4], stroke: '#2a2a2a' })}
  <path d="M${x} ${y + h * 0.7} Q ${x + w * 0.3} ${y + h * 0.45} ${x + w * 0.55} ${y + h * 0.62} T ${x + w} ${y + h * 0.5} V ${y + h} H ${x} Z" fill="#2c3a2a" fill-opacity="0.8"/>
  <circle cx="${x + w * 0.75}" cy="${y + h * 0.28}" r="${Math.min(w, h) * 0.09}" fill="#3b4a36"/>
  <rect x="${x}" y="${y + h - 34}" width="${w}" height="34" fill="#000" fill-opacity="0.55"/>
  ${text(x + 10, y + h - 13, caption, { size: 11, fill: '#d4d4d4', font: MONO })}`;
};
const qr = (x, y, s) => {
  // pola QR dekoratif (bukan QR sungguhan)
  const n = 21, c = s / n;
  let out = rect(x - 10, y - 10, s + 20, s + 20, { r: 10, fill: '#F5F5F5', stroke: 'none' });
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const finder = (i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7);
    const on = finder ? (i % 6 === 0 || j % 6 === 0 || (i % 14 > 1 && i % 14 < 5 && j % 14 > 1 && j % 14 < 5) || (i > 13 && (i - 14) % 6 === 0) || (j > 13 && (j - 14) % 6 === 0)) : rnd() > 0.52;
    if (on) out += `<rect x="${(x + j * c).toFixed(1)}" y="${(y + i * c).toFixed(1)}" width="${c.toFixed(1)}" height="${c.toFixed(1)}" fill="#0A0A0A"/>`;
  }
  return out;
};

/* ------------------------------------------------------------------ */
/* Mockup proyek (1600×1000) — DATA DUMMY                              */
/* ------------------------------------------------------------------ */
const W = 1600, H = 1000;
const projects = {
  arumanis: () => canvas(W, H, browser(110, 90, 1380, 820, {
    url: 'arumanis.contoh.id/dashboard', app: 'ARUMANIS',
    nav: ['Dashboard', 'Paket Pekerjaan', 'Dokumentasi', 'Kontrak', 'Pengawasan', 'Laporan', 'Asisten AI'],
    body: (w) => `
      ${text(36, 56, 'Dashboard Program', { size: 26, weight: 700, fill: '#F5F5F5', font: FONT })}
      ${text(36, 84, 'Data dummy untuk ilustrasi', { size: 14, fill: '#8a8a8a' })}
      ${stat(36, 110, 250, 'Paket aktif', '128')}${stat(302, 110, 250, 'Progres fisik', '76,4%', true)}${stat(568, 110, 250, 'Foto lapangan', '4.215')}${stat(834, 110, 300, 'Nilai kontrak', 'Rp 00,0 M')}
      ${mapBlock(36, 220, 640, 330, [[0.2, 0.3], [0.42, 0.55], [0.63, 0.35], [0.78, 0.7], [0.3, 0.78]])}
      ${text(56, 252, 'Sebaran paket', { size: 14, weight: 600, fill: '#E5E5E5' })}
      ${rect(696, 220, 438, 330, { fill: '#141414' })}
      ${text(716, 252, 'Realisasi bulanan', { size: 14, weight: 600, fill: '#E5E5E5' })}
      ${bars(716, 290, 398, 230, [30, 42, 38, 55, 50, 64, 70, 66, 78, 82, 88, 94])}
      ${rect(36, 570, 1098, 190, { fill: '#141414' })}
      ${tableRows(56, 590, 1058, [
        ['Paket A — Jaringan perpipaan desa', 'Kec. Contoh Utara', '%82', { t: 'Berjalan', ok: true }],
        ['Paket B — Sanitasi komunal', 'Kec. Contoh Selatan', '%64', { t: 'Berjalan', ok: true }],
        ['Paket C — Hidran umum', 'Kec. Contoh Barat', '%100', { t: 'Selesai', ok: false }],
      ], [0, 420, 700, 900])}`,
  })),
  'arumanis-1': () => canvas(W, H, browser(110, 90, 1380, 820, {
    url: 'arumanis.contoh.id/dokumentasi', app: 'ARUMANIS',
    nav: ['Dashboard', 'Paket Pekerjaan', 'Dokumentasi', 'Kontrak', 'Pengawasan', 'Laporan'],
    body: () => `
      ${text(36, 56, 'Dokumentasi Lapangan', { size: 26, weight: 700, fill: '#F5F5F5', font: FONT })}
      ${rect(36, 80, 280, 34, { r: 17, fill: 'rgba(0,212,14,0.12)', stroke: 'none' })}${text(56, 102, '● Dalam geo-fence (radius 100 m)', { size: 13, fill: G })}
      ${[0, 1, 2, 3, 4, 5].map((i) => photoTile(36 + (i % 3) * 250, 136 + Math.floor(i / 3) * 250, 234, 234, `-6.8${i}12, 107.1${i}40 · 0${i + 1}/09 10:2${i}`, i)).join('')}
      ${mapBlock(800, 136, 334, 484, [[0.5, 0.45]], { routes: false })}
      <circle cx="967" cy="354" r="90" fill="none" stroke="${G}" stroke-width="2" stroke-dasharray="8 6"/>
      ${text(820, 168, 'Titik lokasi paket', { size: 14, weight: 600, fill: '#E5E5E5' })}
      ${rect(36, 650, 1098, 110, { fill: '#141414' })}
      ${text(60, 690, 'Watermark otomatis', { size: 16, weight: 600, fill: '#F5F5F5' })}
      ${text(60, 720, 'Koordinat GPS · waktu · kode paket · nama petugas (dummy)', { size: 14, fill: '#a3a3a3' })}
      ${rect(900, 682, 210, 44, { r: 10, fill: G, stroke: 'none' })}${text(1005, 710, 'Unggah foto', { size: 15, weight: 600, fill: BG, anchor: 'middle' })}`,
  })),
  'tpm-super-app': () => canvas(W, H, `
    ${browser(420, 110, 1080, 780, {
      url: 'erp.contoh.id/keuangan', app: 'TPM', nav: ['Ringkasan', 'Bengkel', 'Jual Beli', 'Angkutan', 'SDM', 'Keuangan'],
      body: () => `
        ${text(36, 56, 'Buku Besar', { size: 26, weight: 700, fill: '#F5F5F5', font: FONT })}
        ${stat(36, 84, 250, 'Pendapatan', 'Rp 000 jt', true)}${stat(302, 84, 250, 'Beban', 'Rp 000 jt')}${stat(568, 84, 250, 'Laba', 'Rp 00 jt')}
        ${rect(36, 196, 812, 330, { fill: '#141414' })}
        ${tableRows(56, 212, 772, [
          ['Kas', '12.500.000', '—', { t: 'Debit', ok: true }],
          ['Pendapatan Jasa', '—', '7.500.000', { t: 'Kredit', ok: false }],
          ['Penjualan Sparepart', '—', '5.000.000', { t: 'Kredit', ok: false }],
          ['Persediaan Kendaraan', '85.000.000', '—', { t: 'Debit', ok: true }],
          ['Utang Investor', '—', '85.000.000', { t: 'Kredit', ok: false }],
          ['Total', '97.500.000', '97.500.000', { t: 'Seimbang', ok: true }],
        ], [0, 320, 500, 660])}
        ${rect(36, 546, 812, 170, { fill: '#141414' })}${text(56, 578, 'Laba rugi 12 bulan (dummy)', { size: 14, weight: 600, fill: '#E5E5E5' })}
        ${bars(56, 596, 772, 100, [40, 48, 45, 60, 58, 66, 72, 69, 80, 76, 88, 92])}`,
    })}
    ${phone(90, 170, 360, 720, (w) => `
      ${text(24, 40, 'Antrean Servis', { size: 22, weight: 700, fill: '#F5F5F5', font: FONT })}
      ${['B 1234 XX · Ganti oli', 'D 5678 YY · Tune up', 'F 9012 ZZ · Rem', 'B 3456 AA · Kelistrikan'].map((t, i) => `
        ${rect(20, 64 + i * 92, w - 40, 78, { r: 14, fill: '#171717' })}
        ${text(40, 96 + i * 92, t, { size: 14, fill: '#E5E5E5' })}
        ${rect(40, 108 + i * 92, 84, 22, { r: 11, fill: i === 0 ? 'rgba(0,212,14,0.14)' : '#222', stroke: 'none' })}
        ${text(82, 124 + i * 92, i === 0 ? 'Dikerjakan' : 'Menunggu', { size: 11, fill: i === 0 ? G : '#a3a3a3', anchor: 'middle' })}
        ${text(w - 40, 96 + i * 92, `SPK-0${i + 1}`, { size: 12, fill: '#8a8a8a', font: MONO, anchor: 'end' })}`).join('')}
      ${rect(20, 450, w - 40, 110, { r: 14, fill: '#171717' })}
      ${text(40, 484, 'Kasir · Total', { size: 13, fill: '#8a8a8a' })}${text(40, 526, 'Rp 000.000', { size: 30, weight: 700, fill: '#F5F5F5', font: FONT })}
      ${rect(20, 580, w - 40, 56, { r: 14, fill: G, stroke: 'none' })}${text(w / 2, 614, 'Bayar & cetak struk', { size: 16, weight: 700, fill: BG, anchor: 'middle' })}
      ${text(w / 2, 660, '● Offline · 3 transaksi menunggu sinkron', { size: 12, fill: '#a3a3a3', anchor: 'middle' })}`)}
  `, { glow: [0.2, 0.2] }),
  'tpm-super-app-1': () => canvas(W, H, `
    ${[0, 1, 2].map((i) => phone(170 + i * 440, 110 + (i === 1 ? -20 : 20), 380, 780, (w) => {
      const titles = ['Stok Sparepart', 'Unit Mobil', 'Masuk dengan PIN'];
      if (i === 2) return `${logoMark(w / 2 - 40, 60, 130)}${text(w / 2, 250, 'TPM Super App', { size: 24, weight: 700, fill: '#F5F5F5', font: FONT, anchor: 'middle' })}
        ${[0, 1, 2, 3].map((k) => `<circle cx="${w / 2 - 75 + k * 50}" cy="310" r="10" fill="${k < 2 ? G : '#333'}"/>`).join('')}
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((k, j) => `${k === '' ? '' : `<circle cx="${w / 2 - 100 + (j % 3) * 100}" cy="${400 + Math.floor(j / 3) * 80}" r="32" fill="#1a1a1a" stroke="#2a2a2a"/>${text(w / 2 - 100 + (j % 3) * 100, 410 + Math.floor(j / 3) * 80, k, { size: 24, fill: '#E5E5E5', anchor: 'middle', font: FONT })}`}`).join('')}`;
      const rows = i === 0
        ? [['Oli mesin 1L', '24 pcs'], ['Filter oli', '8 pcs'], ['Kampas rem', '3 set'], ['Busi', '40 pcs'], ['Aki 45Ah', '2 unit']]
        : [['Unit #01 · Hatchback', 'Siap jual'], ['Unit #02 · MPV', 'Persiapan'], ['Unit #03 · SUV', 'Terjual'], ['Unit #04 · Sedan', 'Persiapan']];
      return `${text(24, 40, titles[i], { size: 22, weight: 700, fill: '#F5F5F5', font: FONT })}
        ${rows.map((r, k) => `${rect(20, 66 + k * 84, w - 40, 70, { r: 14, fill: '#171717' })}${text(40, 108 + k * 84, r[0], { size: 14, fill: '#E5E5E5' })}${text(w - 40, 108 + k * 84, r[1], { size: 13, fill: k === 2 && i === 0 ? '#f59e0b' : G, anchor: 'end' })}`).join('')}`;
    })).join('')}`),
  'pertamak-hub': () => canvas(W, H, browser(110, 90, 1380, 820, {
    url: 'pertamak.contoh.id/peta', app: 'Pertamak', nav: ['Beranda', 'Jurnal SKP', 'Pegawai', 'Piket', 'Media', 'Peta Petugas', 'Laporan'],
    body: () => `
      ${text(36, 56, 'Peta Sebaran Petugas', { size: 26, weight: 700, fill: '#F5F5F5', font: FONT })}
      ${stat(36, 84, 250, 'Jurnal hari ini', '48', true)}${stat(302, 84, 250, 'Petugas aktif', '31')}${stat(568, 84, 250, 'Lokasi', '12')}
      ${mapBlock(36, 196, 700, 564, [[0.18, 0.25], [0.3, 0.6], [0.52, 0.35], [0.6, 0.72], [0.8, 0.28], [0.75, 0.52], [0.4, 0.85]])}
      ${rect(756, 84, 378, 676, { fill: '#141414' })}
      ${text(776, 120, 'Jurnal terbaru', { size: 16, weight: 600, fill: '#F5F5F5' })}
      ${['Pemeliharaan taman kota', 'Pembersihan area TPU', 'Penyiraman tanaman', 'Pemangkasan pohon', 'Perbaikan bangku taman', 'Patroli area makam'].map((t, i) => `
        ${rect(772, 140 + i * 100, 346, 86, { r: 12, fill: '#191919' })}
        ${photoTile(784, 152 + i * 100, 62, 62, '', i)}
        ${text(860, 178 + i * 100, t, { size: 14, fill: '#E5E5E5' })}
        ${text(860, 202 + i * 100, `Petugas ${String.fromCharCode(65 + i)} · 0${7 + (i % 3)}.${i}5 WIB`, { size: 12, fill: '#8a8a8a' })}`).join('')}`,
  })),
  'pertamak-hub-1': () => canvas(W, H, `
    ${phone(220, 90, 380, 820, (w) => `
      ${text(24, 40, 'Tambah Kegiatan', { size: 22, weight: 700, fill: '#F5F5F5', font: FONT })}
      ${photoTile(20, 64, w - 40, 240, 'GPS -6.8xxx, 107.1xxx · 08.12', 1)}
      ${['Jenis kegiatan', 'Uraian', 'Lokasi'].map((l, i) => `${text(24, 344 + i * 90, l, { size: 13, fill: '#8a8a8a' })}${rect(20, 356 + i * 90, w - 40, 50, { r: 12, fill: '#171717' })}${text(40, 387 + i * 90, ['Pemeliharaan taman', 'Pemangkasan & penyiraman', '● Lokasi terdeteksi'][i], { size: 14, fill: i === 2 ? G : '#E5E5E5' })}`).join('')}
      ${rect(20, 650, w - 40, 56, { r: 14, fill: G, stroke: 'none' })}${text(w / 2, 684, 'Simpan jurnal', { size: 16, weight: 700, fill: BG, anchor: 'middle' })}`)}
    ${browser(680, 170, 820, 660, {
      url: 'pertamak.contoh.id/laporan', app: 'Pertamak', nav: ['Laporan', 'Rekap SKP', 'Ekspor'],
      body: (w) => `
        ${text(30, 50, 'Rekap SKP Bulanan', { size: 22, weight: 700, fill: '#F5F5F5', font: FONT })}
        ${rect(30, 74, w - 60, 400, { fill: '#141414' })}
        ${tableRows(46, 88, w - 92, [['Pegawai A', '62 jurnal', { t: 'Lengkap', ok: true }], ['Pegawai B', '58 jurnal', { t: 'Lengkap', ok: true }], ['Pegawai C', '41 jurnal', { t: 'Proses', ok: false }], ['Pegawai D', '60 jurnal', { t: 'Lengkap', ok: true }], ['Pegawai E', '55 jurnal', { t: 'Lengkap', ok: true }]], [0, 200, 380])}
        ${rect(30, 500, 220, 50, { r: 12, fill: G, stroke: 'none' })}${text(140, 532, 'Ekspor DOCX', { size: 15, weight: 700, fill: BG, anchor: 'middle' })}`,
    })}`, { glow: [0.3, 0.1] }),
  siman: () => canvas(W, H, browser(110, 90, 1380, 820, {
    url: 'siman.contoh.id', app: 'SIMAN', nav: ['Cari Makam', 'Data TPU', 'Mobil Jenazah', 'Kontak Petugas'],
    body: (w) => `
      ${text(36, 64, 'Cari Data Makam', { size: 30, weight: 700, fill: '#F5F5F5', font: FONT })}
      ${text(36, 94, 'Layanan publik — tanpa login. Semua data pada gambar adalah dummy.', { size: 14, fill: '#8a8a8a' })}
      ${rect(36, 118, 860, 60, { r: 14, fill: '#171717', stroke: G })}${text(64, 155, 'Nama almarhum/almarhumah atau blok makam…', { size: 16, fill: '#8a8a8a' })}
      ${rect(912, 118, 222, 60, { r: 14, fill: G, stroke: 'none' })}${text(1023, 155, 'Cari', { size: 17, weight: 700, fill: BG, anchor: 'middle' })}
      ${[0, 1, 2].map((i) => `${rect(36, 204 + i * 150, 740, 132, { r: 14, fill: '#141414' })}
        ${text(64, 248 + i * 150, ['Nama Contoh A', 'Nama Contoh B', 'Nama Contoh C'][i], { size: 20, weight: 600, fill: '#F5F5F5', font: FONT })}
        ${text(64, 278 + i * 150, `TPU Contoh ${i + 1} · Blok ${String.fromCharCode(65 + i)} · No. 0${i + 1}${i + 4}`, { size: 14, fill: '#a3a3a3' })}
        ${text(64, 306 + i * 150, 'Wafat: 00/00/0000', { size: 13, fill: '#8a8a8a', font: MONO })}
        ${rect(600, 236 + i * 150, 150, 40, { r: 10, fill: 'none', stroke: '#3a3a3a' })}${text(675, 262 + i * 150, 'Lihat lokasi', { size: 13, fill: '#E5E5E5', anchor: 'middle' })}`).join('')}
      ${rect(796, 204, 338, 432, { r: 14, fill: '#141414' })}
      ${text(820, 244, 'QR di lokasi makam', { size: 16, weight: 600, fill: '#F5F5F5' })}
      ${qr(870, 280, 190)}
      ${text(965, 520, 'Pindai untuk info publik', { size: 13, fill: '#a3a3a3', anchor: 'middle' })}
      ${rect(820, 548, 290, 64, { r: 12, fill: 'rgba(0,212,14,0.12)', stroke: 'none' })}${text(840, 586, '● Mobil jenazah: Tersedia', { size: 15, fill: G })}
      ${rect(36, 666, 1098, 94, { r: 14, fill: '#141414' })}${text(64, 720, 'Butuh bantuan? Hubungi petugas TPU langsung via WhatsApp.', { size: 16, fill: '#E5E5E5' })}`,
  })),
  'siman-1': () => canvas(W, H, `
    ${phone(160, 90, 380, 820, (w) => `
      ${text(24, 40, 'Info Makam', { size: 22, weight: 700, fill: '#F5F5F5', font: FONT })}
      ${rect(20, 64, w - 40, 220, { r: 14, fill: '#171717' })}
      ${text(40, 104, 'Nama Contoh A', { size: 20, weight: 600, fill: '#F5F5F5', font: FONT })}
      ${['TPU Contoh 1', 'Blok A · No. 014', 'Status: Terdata'].map((t, i) => text(40, 140 + i * 32, t, { size: 14, fill: i === 2 ? G : '#a3a3a3' })).join('')}
      ${mapBlock(20, 304, w - 40, 240, [[0.55, 0.5]], { routes: false })}
      ${rect(20, 570, w - 40, 56, { r: 14, fill: G, stroke: 'none' })}${text(w / 2, 604, 'Petunjuk arah', { size: 16, weight: 700, fill: BG, anchor: 'middle' })}
      ${rect(20, 640, w - 40, 56, { r: 14, fill: 'none', stroke: '#3a3a3a' })}${text(w / 2, 674, 'Hubungi petugas', { size: 16, fill: '#E5E5E5', anchor: 'middle' })}`)}
    ${browser(620, 150, 880, 700, {
      url: 'siman.contoh.id/admin', app: 'SIMAN', nav: ['Dasbor', 'TPU', 'Makam', 'Ahli Waris', 'Armada'],
      body: (w) => `
        ${text(30, 50, 'Status Mobil Jenazah', { size: 22, weight: 700, fill: '#F5F5F5', font: FONT })}
        ${[0, 1, 2].map((i) => `${rect(30, 78 + i * 120, w - 60, 100, { r: 14, fill: '#141414' })}
          ${text(56, 120 + i * 120, `Armada 0${i + 1}`, { size: 18, weight: 600, fill: '#F5F5F5', font: FONT })}
          ${text(56, 150 + i * 120, `Pengemudi ${String.fromCharCode(88 + i)} · Plat F 00${i}0 XX`, { size: 13, fill: '#8a8a8a' })}
          ${rect(w - 210, 110 + i * 120, 150, 34, { r: 17, fill: i === 1 ? '#2a1f0a' : 'rgba(0,212,14,0.14)', stroke: 'none' })}
          ${text(w - 135, 132 + i * 120, i === 1 ? 'Bertugas' : 'Tersedia', { size: 13, fill: i === 1 ? '#f59e0b' : G, anchor: 'middle' })}`).join('')}
        ${text(30, 470, 'Data ahli waris hanya terlihat oleh petugas berwenang.', { size: 13, fill: '#8a8a8a' })}`,
    })}`, { glow: [0.25, 0.15] }),
  'master-produk': () => canvas(W, H, browser(110, 90, 1380, 820, {
    url: 'master-produk.contoh.id', app: 'Master', nav: ['Pencarian', 'Pencarian Massal', 'Ekspor', 'Ekstraksi PDF'],
    body: (w) => `
      ${text(36, 56, 'Pencarian Master Data Produk', { size: 26, weight: 700, fill: '#F5F5F5', font: FONT })}
      ${text(36, 84, '6.190 item · SE DJBK 47/2026', { size: 14, fill: '#8a8a8a', font: MONO })}
      ${rect(36, 104, 740, 56, { r: 12, fill: '#171717', stroke: G })}${text(62, 139, 'pipa hdpe|', { size: 17, fill: '#F5F5F5', font: MONO })}
      ${text(760, 139, '24 hasil · 3 ms', { size: 13, fill: '#8a8a8a', anchor: 'end' })}
      ${rect(36, 178, 740, 582, { fill: '#141414' })}
      ${tableRows(52, 190, 708, [
        ['1.1.2.01 · Pipa HDPE D 50 mm', 'm', { t: 'Air Minum', ok: true }],
        ['1.1.2.02 · Pipa HDPE D 63 mm', 'm', { t: 'Air Minum', ok: true }],
        ['1.1.2.03 · Pipa HDPE D 90 mm', 'm', { t: 'Air Minum', ok: true }],
        ['1.1.2.04 · Pipa HDPE D 110 mm', 'm', { t: 'Air Minum', ok: true }],
        ['2.3.1.07 · Sambungan HDPE Tee', 'bh', { t: 'Aksesoris', ok: false }],
        ['2.3.1.08 · Elbow HDPE 90°', 'bh', { t: 'Aksesoris', ok: false }],
        ['3.2.4.01 · Pipa PVC D 110 mm', 'm', { t: 'Sanitasi', ok: false }],
        ['3.2.4.02 · Pipa PVC D 160 mm', 'm', { t: 'Sanitasi', ok: false }],
        ['3.2.4.03 · Pipa PVC D 200 mm', 'm', { t: 'Sanitasi', ok: false }],
        ['3.2.5.11 · Bak kontrol precast', 'bh', { t: 'Sanitasi', ok: false }],
        ['3.2.5.12 · Manhole cover', 'bh', { t: 'Sanitasi', ok: false }],
        ['4.1.1.01 · Meter air 1/2"', 'bh', { t: 'Air Minum', ok: true }],
      ], [0, 470, 580])}
      <rect x="${w - 390}" y="104" width="390" height="656" fill="#101010"/><line x1="${w - 390}" y1="104" x2="${w - 390}" y2="760" stroke="#2a2a2a" stroke-width="2"/>
      ${text(w - 360, 144, 'Detail item', { size: 13, fill: '#8a8a8a', font: MONO })}
      ${text(w - 360, 180, 'Pipa HDPE D 63 mm', { size: 22, weight: 700, fill: '#F5F5F5', font: FONT })}
      ${[['Kode', '1.1.2.02'], ['Bidang', 'Cipta Karya'], ['Satuan', 'm (meter)'], ['Klasifikasi', 'Air Minum'], ['Lingkup teknis', 'Pengadaan & pemasangan']].map(([k, v], i) => `
        ${text(w - 360, 230 + i * 62, k, { size: 12, fill: '#8a8a8a' })}${text(w - 360, 254 + i * 62, v, { size: 16, fill: '#E5E5E5' })}`).join('')}
      ${rect(w - 360, 560, 160, 46, { r: 10, fill: G, stroke: 'none' })}${text(w - 280, 590, 'Salin kode', { size: 14, weight: 700, fill: BG, anchor: 'middle' })}
      ${rect(w - 188, 560, 140, 46, { r: 10, fill: 'none', stroke: '#3a3a3a' })}${text(w - 118, 590, 'Ekspor', { size: 14, fill: '#E5E5E5', anchor: 'middle' })}`,
  })),
  'master-produk-1': () => canvas(W, H, browser(110, 90, 1380, 820, {
    url: 'master-produk.contoh.id/massal', app: 'Master', nav: ['Pencarian', 'Pencarian Massal', 'Ekspor', 'Ekstraksi PDF'],
    body: (w) => `
      ${text(36, 56, 'Pencarian Massal', { size: 26, weight: 700, fill: '#F5F5F5', font: FONT })}
      ${text(36, 84, 'Tempel daftar dari clipboard — kode dideteksi & deskripsi dicocokkan otomatis', { size: 14, fill: '#8a8a8a' })}
      ${rect(36, 108, 440, 650, { r: 12, fill: '#101010' })}
      ${['1.1.2.02', 'pipa hdpe 90mm', 'elbow hdpe 90 derajat', '3.2.4.01', 'meter air setengah inci', 'bak kontrol', 'manhole cover besi', 'pipa pvc 160'].map((l, i) => text(60, 150 + i * 36, `${String(i + 1).padStart(2, '0')}  ${l}`, { size: 15, fill: '#a3a3a3', font: MONO })).join('')}
      ${rect(496, 108, 638, 650, { r: 12, fill: '#141414' })}
      ${tableRows(512, 120, 606, [
        ['1.1.2.02 · Pipa HDPE D 63 mm', { t: 'Kode', ok: true }],
        ['1.1.2.03 · Pipa HDPE D 90 mm', { t: '96%', ok: true }],
        ['2.3.1.08 · Elbow HDPE 90°', { t: '91%', ok: true }],
        ['3.2.4.01 · Pipa PVC D 110 mm', { t: 'Kode', ok: true }],
        ['4.1.1.01 · Meter air 1/2"', { t: '88%', ok: true }],
        ['3.2.5.11 · Bak kontrol precast', { t: '93%', ok: true }],
        ['3.2.5.12 · Manhole cover', { t: '84%', ok: false }],
        ['3.2.4.02 · Pipa PVC D 160 mm', { t: '95%', ok: true }],
      ], [0, 480])}
      ${rect(512, 690, 180, 48, { r: 10, fill: G, stroke: 'none' })}${text(602, 721, 'Ekspor Excel', { size: 15, weight: 700, fill: BG, anchor: 'middle' })}
      ${rect(706, 690, 150, 48, { r: 10, fill: 'none', stroke: '#3a3a3a' })}${text(781, 721, 'Ekspor CSV', { size: 15, fill: '#E5E5E5', anchor: 'middle' })}`,
  })),
};

/* ------------------------------------------------------------------ */
/* Tim, OG, favicon                                                    */
/* ------------------------------------------------------------------ */
const avatar = (n) => canvas(600, 600, `
  <polygon points="300,90 480,195 480,405 300,510 120,405 120,195" fill="#141414" stroke="${G}" stroke-opacity="0.5" stroke-width="3"/>
  <circle cx="300" cy="260" r="70" fill="#2a2a2a"/>
  <path d="M170 440 C 190 350, 410 350, 430 440 L 400 458 L 300 510 L 200 458 Z" fill="#2a2a2a"/>
  ${text(300, 570, `FOTO ${n}`, { size: 22, fill: '#6b6b6b', anchor: 'middle', font: MONO })}`, { glow: [0.5, 0.2] });

const og = () => canvas(1200, 630, `
  ${logoMark(90, 150, 330)}
  ${text(380, 290, 'Cendera', { size: 110, weight: 700, fill: '#F5F5F5', font: FONT })}
  ${text(386, 360, 'Teknologi • Aplikasi • Kreatif', { size: 34, fill: G, font: FONT })}
  ${text(386, 420, 'Dari ide menjadi produk digital yang benar-benar dipakai.', { size: 26, fill: '#a3a3a3' })}
`, { glow: [0.15, 0.4] });

const iconSvg = (size, pad = 0.14, bg = BG) => {
  const [, , vw, vh] = logo.viewBox.split(' ').map(Number);
  const h = size * (1 - pad * 2), s = h / vh, w = vw * s;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${bg ? `<rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${bg}"/>` : ''}
    <g transform="translate(${(size - w) / 2} ${size * pad}) scale(${s})"><path fill="${G}" fill-rule="evenodd" d="${logo.d}"/></g></svg>`;
};

/* ------------------------------------------------------------------ */
const out = async (file, svg, fmt, opts = {}) => {
  await mkdir(file.split('/').slice(0, -1).join('/'), { recursive: true });
  let img = sharp(Buffer.from(svg), { density: 72 });
  if (opts.resize) img = img.resize(opts.resize);
  if (fmt === 'webp') img = img.webp({ quality: 82, effort: 5 });
  if (fmt === 'png') img = img.png({ compressionLevel: 9 });
  await img.toFile(file);
  console.log('✓', file);
};

const force = process.argv.includes('--force');
const skip = (f) => !force && existsSync(f) && process.argv.includes('--missing');

for (const [name, make] of Object.entries(projects)) {
  const f = `public/images/proyek/${name}.webp`;
  if (!skip(f)) await out(f, make(), 'webp');
}
for (const n of [1, 2, 3, 4]) await out(`public/images/tim/anggota-${n}.webp`, avatar(n), 'webp');
await out('public/images/tim/placeholder.webp', avatar(''), 'webp');
await out('public/images/og-default.png', og(), 'png');

// Favicon & ikon aplikasi
await writeFile('public/favicon.svg', iconSvg(64, 0.1, null).replace('<svg ', '<svg role="img" aria-label="Cendera" '));
await out('public/apple-touch-icon.png', iconSvg(180, 0.16), 'png');
await out('public/icon-192.png', iconSvg(192, 0.16), 'png');
await out('public/icon-512.png', iconSvg(512, 0.16), 'png');
// favicon.ico (PNG 32×32 dibungkus ICO)
const png32 = await sharp(Buffer.from(iconSvg(32, 0.08))).png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(0, 0); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);
ico.writeUInt8(32, 6); ico.writeUInt8(32, 7); ico.writeUInt8(0, 8); ico.writeUInt8(0, 9);
ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12); ico.writeUInt32LE(png32.length, 14); ico.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([ico, png32]));
console.log('✓ public/favicon.ico');
