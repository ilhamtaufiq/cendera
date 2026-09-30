/**
 * Copy halaman beranda (Bahasa Indonesia).
 * Untuk versi Inggris kelak: salin file ini menjadi `home.en.ts` dan terjemahkan.
 * Nilai bertanda PLACEHOLDER wajib diganti dengan data asli.
 */

/*
 * Alternatif headline hero (dipilih: #1)
 * 1. "Dari ide menjadi produk digital yang benar-benar dipakai."   ← dipakai
 *    Alasan: fokus pada hasil bagi klien (dipakai, bukan sekadar jadi), percaya diri tanpa berlebihan.
 * 2. "Teknologi yang presisi. Karya yang berkarakter."
 * 3. "Kami merancang, membangun, dan merawat produk digital Anda."
 */
export const hero = {
  badge: 'Teknologi • Aplikasi • Kreatif',
  titleLead: 'Dari ide menjadi produk digital yang',
  titleAccent: 'benar-benar dipakai.',
  subtitle:
    'Cendera membantu instansi dan bisnis merancang, membangun, dan merawat aplikasi mobile, web, dan sistem kustom — rapi di balik layar, nyaman di tangan pengguna.',
  highlights: ['Tim kecil, komunikasi langsung', 'Kode milik Anda', 'Dukungan pasca-rilis'],
};

/** PLACEHOLDER — ganti dengan angka asli. `suffix` ditampilkan setelah angka. */
export const stats = [
  { value: 25, suffix: '+', label: 'Proyek selesai' },
  { value: 15, suffix: '+', label: 'Klien & mitra' },
  { value: 5, suffix: '+', label: 'Tahun pengalaman' },
  { value: 19, suffix: '', label: 'Teknologi dikuasai' },
];

/** PLACEHOLDER — ganti dengan nama/logo klien asli (taruh SVG di public/images/klien/). */
export const clients = ['Mitra Satu', 'Instansi Dua', 'Studio Tiga', 'Koperasi Empat', 'Usaha Lima', 'Yayasan Enam'];

export const services = [
  {
    icon: 'smartphone',
    title: 'Aplikasi Mobile',
    desc: 'Aplikasi Android & iOS dari satu basis kode dengan React Native dan Expo — lengkap dengan mode offline, notifikasi, dan biometrik.',
    tags: ['React Native', 'Expo', 'Offline-first'],
  },
  {
    icon: 'monitor-smartphone',
    title: 'Website & Web App',
    desc: 'Situs profil yang cepat dan aplikasi web responsif yang nyaman dipakai harian, dari landing page hingga portal operasional.',
    tags: ['React', 'Astro', 'Tailwind'],
  },
  {
    icon: 'server-cog',
    title: 'Backend/API & Integrasi',
    desc: 'API yang aman dan terdokumentasi, integrasi dengan sistem lama, payment gateway, WhatsApp, hingga layanan pemerintah.',
    tags: ['Laravel', 'FastAPI', 'Hono'],
  },
  {
    icon: 'layout-dashboard',
    title: 'Sistem Bisnis Kustom',
    desc: 'ERP, POS, inventori, dan dashboard yang mengikuti alur kerja Anda — bukan sebaliknya. Termasuk akuntansi double-entry.',
    tags: ['ERP', 'POS', 'Dashboard'],
  },
  {
    icon: 'landmark',
    title: 'Solusi Govtech & Data',
    desc: 'Aplikasi layanan publik dan sistem internal instansi: satu data, pelaporan, dokumentasi lapangan berbasis GPS, dan peta.',
    tags: ['Satu Data', 'GIS', 'Pelaporan'],
  },
  {
    icon: 'pen-tool',
    title: 'UI/UX Design & Branding',
    desc: 'Riset pengguna, wireframe, prototipe, hingga design system dan identitas visual yang konsisten di semua kanal.',
    tags: ['Figma', 'Design System', 'Brand'],
  },
  {
    icon: 'clapperboard',
    title: 'Konten Kreatif & Media Digital',
    desc: 'Konten visual, motion, dan materi kampanye yang menjelaskan produk Anda dengan jelas dan menarik.',
    tags: ['Motion', 'Konten', 'Kampanye'],
  },
];

export const process = [
  {
    icon: 'messages-square',
    title: 'Diskusi',
    desc: 'Kami mendengarkan tujuan, kendala, dan pengguna Anda. Hasilnya: ruang lingkup awal dan estimasi yang jujur.',
    output: 'Brief & estimasi',
  },
  {
    icon: 'drafting-compass',
    title: 'Perencanaan & Desain',
    desc: 'Alur pengguna, wireframe, dan desain antarmuka divalidasi bersama sebelum satu baris kode ditulis.',
    output: 'Prototipe & rencana sprint',
  },
  {
    icon: 'code-xml',
    title: 'Pengembangan',
    desc: 'Dikerjakan dalam sprint pendek dengan demo rutin, sehingga Anda melihat kemajuan nyata setiap minggu.',
    output: 'Build berkala',
  },
  {
    icon: 'shield-check',
    title: 'Pengujian',
    desc: 'Uji fungsional, performa, dan keamanan, termasuk uji terima bersama pengguna sebenarnya di lapangan.',
    output: 'Laporan uji & perbaikan',
  },
  {
    icon: 'rocket',
    title: 'Peluncuran & Dukungan',
    desc: 'Rilis yang terencana, pelatihan pengguna, dokumentasi, serta pemantauan dan dukungan setelah aplikasi berjalan.',
    output: 'Rilis, pelatihan & SLA',
  },
];

/** Stack yang benar-benar dipakai. `icon` = slug Simple Icons; kosong → monogram. */
export const tech = [
  { name: 'React', icon: 'react', group: 'Frontend' },
  { name: 'React Native', icon: 'react', group: 'Mobile' },
  { name: 'Expo', icon: 'expo', group: 'Mobile' },
  { name: 'TypeScript', icon: 'typescript', group: 'Bahasa' },
  { name: 'Vite', icon: 'vite', group: 'Frontend' },
  { name: 'Astro', icon: 'astro', group: 'Frontend' },
  { name: 'Tailwind', icon: 'tailwindcss', group: 'Frontend' },
  { name: 'Bun', icon: 'bun', group: 'Backend' },
  { name: 'Hono', icon: 'hono', group: 'Backend' },
  { name: 'Laravel', icon: 'laravel', group: 'Backend' },
  { name: 'Filament', icon: '', group: 'Backend' },
  { name: 'FastAPI', icon: 'fastapi', group: 'Backend' },
  { name: 'Python', icon: 'python', group: 'Bahasa' },
  { name: 'MySQL', icon: 'mysql', group: 'Data' },
  { name: 'SQLite', icon: 'sqlite', group: 'Data' },
  { name: 'Redis', icon: 'redis', group: 'Data' },
  { name: 'Docker', icon: 'docker', group: 'Infrastruktur' },
  { name: 'Coolify', icon: 'coolify', group: 'Infrastruktur' },
  { name: 'Cloudflare', icon: 'cloudflare', group: 'Infrastruktur' },
];

export const about = {
  story: [
    'Cendera lahir dari pengalaman membangun sistem yang dipakai setiap hari — oleh petugas lapangan, kasir bengkel, hingga warga yang mencari informasi layanan publik. Dari situ kami belajar bahwa perangkat lunak yang baik bukan yang paling rumit, melainkan yang paling bisa diandalkan.',
    'Kami menggabungkan rekayasa perangkat lunak yang presisi dengan kepekaan desain dan konten. Hasilnya adalah produk digital yang kokoh di balik layar, jelas di depan pengguna, dan mudah dikembangkan bersama tim Anda.',
  ],
  vision: 'Menjadi mitra teknologi dan kreatif yang dipercaya untuk membawa layanan, bisnis, dan komunitas di Indonesia melangkah ke era digital dengan percaya diri.',
  mission: [
    'Membangun produk digital yang tepat guna, aman, dan mudah dirawat.',
    'Mendampingi klien dari ide hingga produk berjalan — dan setelahnya.',
    'Membuka akses teknologi berkualitas bagi instansi dan usaha di daerah.',
    'Terus belajar dan berbagi pengetahuan secara terbuka.',
  ],
  values: [
    { icon: 'crosshair', title: 'Presisi', desc: 'Detail kecil menentukan pengalaman besar. Kami mengukur sebelum memotong.' },
    { icon: 'sparkles', title: 'Kreatif', desc: 'Solusi yang sederhana untuk masalah yang rumit, dikemas dengan karakter.' },
    { icon: 'handshake', title: 'Transparan', desc: 'Estimasi jujur, progres terbuka, dan kode yang menjadi milik Anda.' },
    { icon: 'infinity', title: 'Berkelanjutan', desc: 'Kami merancang untuk jangka panjang: terdokumentasi, teruji, mudah dirawat.' },
  ],
};

/** PLACEHOLDER — ganti dengan testimoni asli (dengan izin klien). */
export const testimonials = [
  {
    quote:
      'Tim Cendera cepat memahami alur kerja kami di lapangan. Laporan yang dulu dirangkum berhari-hari kini tersedia dalam hitungan menit.',
    name: 'Nama Klien',
    role: 'Kepala Bidang, Instansi Pemerintah',
  },
  {
    quote:
      'Aplikasinya tetap jalan walau sinyal di bengkel putus-putus. Kasir, stok, dan laporan keuangan akhirnya menyatu di satu tempat.',
    name: 'Nama Klien',
    role: 'Pemilik Usaha Otomotif',
  },
  {
    quote:
      'Komunikasinya enak dan transparan. Setiap minggu ada demo, jadi kami tidak pernah menebak-nebak progres proyek.',
    name: 'Nama Klien',
    role: 'Manajer Operasional',
  },
];

export const faq = [
  {
    q: 'Layanan apa saja yang ditangani Cendera?',
    a: 'Kami menangani aplikasi mobile (Android/iOS), website dan aplikasi web, backend/API dan integrasi, sistem bisnis kustom seperti ERP dan POS, solusi govtech, hingga UI/UX, branding, dan konten kreatif. Anda bisa memakai satu layanan atau paket menyeluruh.',
  },
  {
    q: 'Berapa lama waktu pengerjaan sebuah proyek?',
    a: 'Tergantung cakupan. Sebagai gambaran: landing page 1–2 minggu, aplikasi web atau mobile tahap awal (MVP) 6–12 minggu, dan sistem bisnis yang lebih luas dikerjakan bertahap per modul. Estimasi rinci kami berikan setelah sesi diskusi.',
  },
  {
    q: 'Bagaimana cara menentukan biaya?',
    a: 'Biaya dihitung dari ruang lingkup, kompleksitas, dan durasi. Kami menyusun penawaran yang dirinci per fitur atau per tahap sehingga Anda bisa memprioritaskan sesuai anggaran. Konsultasi awal tidak dipungut biaya.',
  },
  {
    q: 'Apakah ada dukungan setelah aplikasi diluncurkan?',
    a: 'Ada. Setiap proyek mendapat masa garansi perbaikan bug, lalu tersedia paket pemeliharaan bulanan untuk pemantauan, pembaruan keamanan, penyesuaian kecil, dan bantuan teknis.',
  },
  {
    q: 'Siapa yang memiliki kode sumber?',
    a: 'Setelah pelunasan, kode sumber, aset desain, dan dokumentasi menjadi milik Anda sepenuhnya sesuai perjanjian. Kami menyerahkan repositori beserta panduan deployment.',
  },
  {
    q: 'Apakah Cendera bisa melanjutkan atau memperbaiki aplikasi yang sudah ada?',
    a: 'Bisa. Kami mulai dengan audit singkat terhadap kode, infrastruktur, dan kebutuhan, lalu merekomendasikan apakah sistem cukup diperbaiki, dikembangkan bertahap, atau perlu dibangun ulang.',
  },
  {
    q: 'Apakah melayani instansi pemerintah?',
    a: 'Ya. Kami berpengalaman membangun sistem internal dan layanan publik untuk perangkat daerah, termasuk integrasi antar-aplikasi, pelaporan, dan dokumentasi lapangan berbasis lokasi.',
  },
  {
    q: 'Bagaimana proses kerjanya jika kami berada di luar kota?',
    a: 'Sebagian besar kolaborasi berjalan daring: diskusi via video call, papan tugas bersama, dan demo rutin. Untuk kebutuhan tertentu seperti pelatihan atau uji lapangan, kami bisa hadir langsung.',
  },
];

export const serviceOptions = [
  'Aplikasi Mobile',
  'Website & Web App',
  'Backend/API & Integrasi',
  'Sistem Bisnis Kustom',
  'Solusi Govtech & Data',
  'UI/UX Design & Branding',
  'Konten Kreatif & Media Digital',
  'Lainnya / belum yakin',
] as const;

export const budgetOptions = [
  'Belum ditentukan',
  '< Rp10 juta',
  'Rp10 – 50 juta',
  'Rp50 – 150 juta',
  '> Rp150 juta',
] as const;
