/**
 * Data perusahaan yang dipakai di banyak tempat (navbar, footer, kontak, JSON-LD).
 * ⚠️  Nilai bertanda PLACEHOLDER wajib diganti dengan data asli sebelum rilis.
 */
export const SITE = {
  name: 'Cendera',
  legalName: 'Cendera', // PLACEHOLDER: mis. "PT Cendera Teknologi Kreatif"
  tagline: 'Teknologi • Aplikasi • Kreatif',
  description:
    'Cendera, studio teknologi & kreatif di Cianjur: jasa pembuatan aplikasi mobile, website, sistem bisnis (ERP/POS), solusi govtech, UI/UX, dan branding.',
  // Judul & kata kunci SEO beranda (lokal: Cianjur)
  homeTitle: 'Cendera — Jasa Pembuatan Aplikasi, Website & Sistem Informasi di Cianjur',
  keywords: [
    'jasa pembuatan aplikasi',
    'jasa pembuatan website',
    'aplikasi mobile',
    'sistem informasi pemerintah',
    'govtech',
    'ERP',
    'UI/UX design',
    'branding',
  ],
  locale: 'id-ID',
  lang: 'id',
  foundingYear: 2021, // PLACEHOLDER
  // Kartu OG dibuat saat build oleh scripts/og-images.mjs
  ogImage: '/og/pages/home.png',
  logo: '/images/brand/cendera-logo.svg',
  themeColor: '#0A0A0A',
} as const;

export const CONTACT = {
  email: 'halo@cendera.id', // PLACEHOLDER
  whatsapp: '6281200000000', // PLACEHOLDER — format internasional tanpa "+"
  whatsappDisplay: '+62 812-0000-0000', // PLACEHOLDER
  whatsappMessage: 'Halo Cendera, saya ingin berdiskusi tentang proyek.',
  address: {
    street: 'Bumi Marhamah Blok P2 No. 7',
    village: 'Sindangasih',
    district: 'Karangtengah',
    city: 'Kabupaten Cianjur',
    region: 'Jawa Barat',
    postalCode: '43281', // periksa kembali kode pos
    country: 'ID',
  },
  // Ganti dengan tautan "Bagikan" dari Google Maps (pin tepat) bila sudah ada.
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Bumi Marhamah Blok P2 No. 7, Sindangasih, Karangtengah, Cianjur, Jawa Barat'),
  hours: [
    { days: 'Senin – Jumat', time: '09.00 – 17.00 WIB' },
    { days: 'Sabtu', time: '09.00 – 13.00 WIB' },
    { days: 'Minggu & libur', time: 'Tutup' },
  ],
} as const;

/** PLACEHOLDER — kosongkan (hapus baris) untuk menyembunyikan ikon. */
export const SOCIALS = [
  { name: 'Instagram', href: 'https://instagram.com/cendera.id', icon: 'instagram' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/cendera', icon: 'linkedin' },
  { name: 'GitHub', href: 'https://github.com/cendera', icon: 'github' },
  { name: 'YouTube', href: 'https://youtube.com/@cendera', icon: 'youtube' },
] as const;

export const NAV = [
  { label: 'Layanan', href: '/#layanan' },
  { label: 'Proyek', href: '/#proyek' },
  { label: 'Proses', href: '/#proses' },
  { label: 'Tentang', href: '/#tentang' },
  { label: 'Blog', href: '/blog' },
  { label: 'Kontak', href: '/#kontak' },
] as const;

export const whatsappLink = (text: string = CONTACT.whatsappMessage) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

/** Jumlah artikel per halaman di /blog. */
export const POSTS_PER_PAGE = 6;
