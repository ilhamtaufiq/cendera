---
title: "Mengapa Konten Situs Sebaiknya Disimpan di Git"
description: "Blog dan portofolio situs ini ditulis sebagai file Markdown di repositori Git. Inilah alasan kami, cara kerjanya, dan kapan pendekatan ini kurang cocok."
date: 2026-09-30
author: "Tim Cendera"
tags: ["astro", "cloudflare", "markdown", "git"]
category: "Tips"
# image: tidak diisi → cover otomatis bermotif heksagonal
draft: false
featured: false
---

Situs yang sedang Anda baca tidak memakai CMS dengan database. Setiap artikel dan studi kasus adalah **file Markdown** di repositori Git. Menambah artikel berarti menulis file, lalu `git push`. Beberapa menit kemudian, situs sudah diperbarui di jaringan edge Cloudflare.

Kedengarannya terlalu sederhana? Justru itu intinya.

## Cara kerjanya

1. Penulis membuat file `.md` dengan *front matter* (judul, tanggal, tag, dan sebagainya).
2. Perubahan di-*commit* dan di-*push* ke GitHub.
3. **Cloudflare Workers Builds** menjalankan `npm run build`. Astro membaca semua Markdown, memvalidasi *front matter*, dan menghasilkan halaman HTML statis.
4. `wrangler deploy` mengunggah hasilnya. Halaman disajikan sebagai aset statis; hanya form kontak yang dijalankan sebagai kode Worker.

```md
---
title: "Judul Artikel"
date: 2026-09-30
tags: ["astro", "tips"]
category: "Tips"
draft: false
---

Isi artikel dalam **Markdown**...
```

## Alasan 1: Riwayat lengkap, gratis

Git mencatat siapa mengubah apa, kapan, dan mengapa. Ingin melihat versi artikel bulan lalu? `git log`. Salah hapus paragraf? Kembalikan dengan satu perintah. Fitur yang di CMS biasa sering berbayar, di sini sudah bawaan.

## Alasan 2: Review sebelum terbit

Setiap perubahan bisa melalui *pull request*. Rekan tim dapat mengomentari kalimat tertentu, dan setiap branch otomatis mendapat **preview deployment** — URL sementara untuk melihat hasil akhir sebelum digabung ke `main`.

## Alasan 3: Validasi otomatis

Skema *front matter* divalidasi dengan Zod saat build. Lupa mengisi deskripsi atau salah menulis kategori? Build gagal dengan pesan yang jelas, sehingga kesalahan tidak pernah sampai ke pengunjung.

> [!TIP]
> Tandai artikel yang belum siap dengan `draft: true`. Artikel tersebut tetap tampil saat pengembangan lokal, tetapi tidak ikut ke situs produksi.

## Alasan 4: Cepat dan murah

Karena semua halaman dirender saat build, tidak ada kueri database ketika pengunjung datang. Halaman disajikan langsung dari edge terdekat. Tidak ada server CMS yang perlu di-*patch*, dan permukaan serangan jauh lebih kecil.

## Alasan 5: Konten Anda, format terbuka

Markdown adalah teks biasa. Tidak terkunci pada vendor tertentu, mudah dipindahkan, dan tetap terbaca puluhan tahun lagi.

## Kapan pendekatan ini kurang cocok?

Tidak ada solusi yang cocok untuk semua. Konten di Git kurang ideal bila:

- Penulis banyak dan tidak terbiasa dengan Git (meskipun bisa diatasi dengan editor berbasis Git seperti Decap CMS atau GitHub web editor).
- Konten berubah setiap menit, misalnya harga atau stok.
- Konten dibuat oleh pengguna, seperti komentar atau forum.

Untuk kasus seperti itu, database atau *headless CMS* tetap pilihan yang tepat — dan bisa dikombinasikan dengan pendekatan ini.

## Penutup

Untuk situs profil perusahaan, blog, dan portofolio, menyimpan konten di Git memberi kombinasi yang sulit dikalahkan: aman, cepat, murah, dan terdokumentasi dengan sendirinya. Panduan lengkap menambah konten tersedia di README repositori situs ini.
