---
title: "Arsitektur BFF untuk Aplikasi Pemerintah"
description: "Pola Backend for Frontend (BFF) membantu aplikasi pemerintah tetap cepat, aman, dan mudah dikembangkan. Ini cara kami menerapkannya dengan Hono dan Laravel."
date: 2026-09-10
author: "Tim Cendera"
tags: ["arsitektur", "govtech", "hono", "laravel"]
category: "Teknologi"
image: "/images/proyek/arumanis.webp"
imageAlt: "Mockup dashboard ARUMANIS (data dummy)"
draft: false
featured: false
---

Aplikasi pemerintah punya karakter yang unik: pengguna beragam (petugas lapangan, admin, pimpinan, kadang warga), data yang sensitif, integrasi dengan sistem lain, dan umur aplikasi yang panjang. Dalam proyek seperti [ARUMANIS](/proyek/arumanis), kami menggunakan pola **Backend for Frontend (BFF)** untuk menjawab tantangan tersebut.

## Masalah yang ingin diselesaikan

Tanpa BFF, antarmuka (misalnya aplikasi React) biasanya memanggil API backend secara langsung. Seiring waktu, muncul beberapa gejala:

- Satu halaman dashboard memanggil **8–10 endpoint** sekaligus, sehingga lambat di jaringan seluler.
- Logika penggabungan data pindah ke browser — sulit diuji dan rawan bocor.
- Token dan kunci API tersimpan di sisi klien.
- Mengubah backend berarti ikut mengubah banyak kode antarmuka.

## Apa itu BFF?

BFF adalah lapisan server tipis yang **dibuat khusus untuk satu antarmuka**. Ia berdiri di antara frontend dan layanan inti:

```text
[ React SPA ] ──► [ BFF: Hono di Bun ] ──► [ Laravel: domain & data ]
                          │                ├─► [ Layanan peta ]
                          │                └─► [ Penyimpanan berkas ]
                          └─ sesi (cookie HttpOnly), agregasi, cache
```

Frontend hanya berbicara dengan BFF. BFF-lah yang memanggil Laravel dan layanan lain, menggabungkan hasilnya, lalu mengirim data yang **sudah berbentuk sesuai kebutuhan layar**.

## Kenapa Hono + Laravel?

Kami memisahkan peran dengan tegas:

- **Laravel** memegang domain inti: aturan bisnis, otorisasi berbasis peran, antrean, dan pembuatan laporan Excel/PDF. Ekosistemnya matang dan mudah dilanjutkan tim lain.
- **Hono di atas Bun** menjadi BFF: sangat ringan, cepat, dan ditulis dengan TypeScript yang sama seperti frontend. Tipe data dapat dibagi dari ujung ke ujung.

```ts
// Satu endpoint BFF untuk satu kebutuhan layar
app.get('/bff/dashboard', async (c) => {
  const [ringkasan, peta, terbaru] = await Promise.all([
    core.get('/paket/ringkasan'),
    core.get('/paket/peta'),
    core.get('/dokumentasi?limit=5'),
  ]);
  return c.json({ ringkasan, peta, terbaru });
});
```

## Manfaat yang kami rasakan

1. **Lebih cepat.** Satu permintaan per layar alih-alih banyak permintaan kecil. Terasa sekali bagi petugas yang mengakses dari lokasi dengan sinyal lemah.
2. **Lebih aman.** Sesi disimpan dalam cookie `HttpOnly`; token layanan inti tidak pernah menyentuh browser.
3. **Lebih mudah berubah.** Backend inti bisa direfaktor tanpa mengganggu antarmuka, selama kontrak BFF tetap sama.
4. **Tepat guna.** Aplikasi mobile petugas dan dashboard pimpinan dapat memiliki BFF masing-masing dengan bentuk data yang berbeda.

> [!WARNING] Jangan jadikan BFF "backend kedua"
> Aturan bisnis tetap tinggal di layanan inti. BFF hanya mengagregasi, menyesuaikan bentuk data, dan mengelola sesi. Jika BFF mulai berisi logika domain, itu tanda perlu ditata ulang.

## Kapan BFF tidak diperlukan?

Untuk aplikasi kecil dengan satu jenis pengguna dan sedikit layar, BFF bisa menjadi beban tambahan. Panel admin sederhana berbasis Filament, misalnya, sudah cukup tanpa lapisan ini. Seperti semua pola arsitektur, gunakan ketika masalahnya memang ada.

## Penutup

BFF bukan teknologi baru, tetapi sangat cocok untuk aplikasi pemerintah yang melayani banyak peran dan harus bertahan bertahun-tahun. Kuncinya adalah disiplin: layanan inti menjaga kebenaran data, BFF menjaga kenyamanan antarmuka.
