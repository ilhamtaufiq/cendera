/** Skema validasi server (Zod) — pesan error dalam Bahasa Indonesia. */
import { z } from 'astro/zod';
import { serviceOptions, budgetOptions } from '@/data/home.id';

const email = z.string({ error: 'Email wajib diisi.' }).trim().toLowerCase().pipe(z.email({ error: 'Format email tidak valid.' }).max(254));

export const contactSchema = z.object({
  name: z.string({ error: 'Nama wajib diisi.' }).trim().min(2, 'Nama minimal 2 karakter.').max(100, 'Nama terlalu panjang.'),
  email,
  service: z.enum(serviceOptions, { error: 'Pilih jenis layanan.' }),
  budget: z.enum(budgetOptions).optional().or(z.literal('')).transform((v) => v || undefined),
  message: z.string({ error: 'Pesan wajib diisi.' }).trim().min(20, 'Pesan minimal 20 karakter agar kami bisa memahami kebutuhan Anda.').max(4000, 'Pesan maksimal 4.000 karakter.'),
  turnstileToken: z.string({ error: 'Verifikasi keamanan wajib diselesaikan.' }).min(1, 'Verifikasi keamanan wajib diselesaikan.').max(2048),
  // Honeypot: harus kosong
  company_website: z.string().max(0).optional().or(z.literal('')),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email,
  turnstileToken: z.string({ error: 'Verifikasi keamanan wajib diselesaikan.' }).min(1, 'Verifikasi keamanan wajib diselesaikan.').max(2048),
  website: z.string().max(0).optional().or(z.literal('')),
});
