/**
 * Kamus teks antarmuka (label tombol, navigasi, pesan form).
 * Untuk menambah Bahasa Inggris: isi objek `en`, tambahkan 'en' di astro.config.mjs → i18n.locales,
 * lalu buat halaman di src/pages/en/. Kunci yang belum diterjemahkan otomatis jatuh ke `id`.
 */
export const languages = { id: 'Bahasa Indonesia', en: 'English' } as const;
export const defaultLang = 'id' as const;
export type Lang = keyof typeof languages;

export const ui = {
  id: {
    'nav.cta': 'Hubungi Kami',
    'nav.menu': 'Menu',
    'nav.close': 'Tutup menu',
    'nav.skip': 'Lewati ke konten utama',
    'theme.toggle': 'Ganti tema terang/gelap',
    'cta.startProject': 'Mulai Proyek',
    'cta.viewProjects': 'Lihat Proyek',
    'cta.allProjects': 'Lihat Semua Proyek',
    'cta.allPosts': 'Lihat Semua Artikel',
    'cta.readMore': 'Baca selengkapnya',
    'cta.caseStudy': 'Lihat studi kasus',
    'blog.readingTime': 'menit baca',
    'blog.toc': 'Daftar isi',
    'blog.share': 'Bagikan',
    'blog.related': 'Artikel terkait',
    'blog.prev': 'Sebelumnya',
    'blog.next': 'Berikutnya',
    'blog.updated': 'Diperbarui',
    'search.placeholder': 'Cari artikel…',
    'search.noResults': 'Tidak ada hasil yang cocok.',
    'form.sending': 'Mengirim…',
    'form.success': 'Terima kasih! Pesan Anda sudah kami terima. Kami akan membalas dalam 1×24 jam kerja.',
    'form.error': 'Maaf, pesan gagal terkirim. Coba lagi atau hubungi kami lewat WhatsApp.',
    'footer.rights': 'Seluruh hak dilindungi.',
    'copy.code': 'Salin',
    'copy.done': 'Tersalin',
  },
  en: {},
} as const;

export type UIKey = keyof (typeof ui)['id'];

export function useTranslations(lang: Lang = defaultLang) {
  return (key: UIKey): string => (ui[lang] as Partial<Record<UIKey, string>>)[key] ?? ui[defaultLang][key];
}
