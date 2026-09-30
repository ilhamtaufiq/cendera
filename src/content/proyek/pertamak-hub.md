---
title: "Pertamak Hub"
subtitle: "Sistem Informasi UPTD Pertamanan & Pemakaman Kabupaten Cianjur"
slug: "pertamak-hub"
category: "Govtech"
type: ["Aplikasi Web", "Aplikasi Mobile"]
year: 2025
status: "Live"
client: "UPTD Pertamanan & Pemakaman, Disperkim Kabupaten Cianjur"
summary: "Platform operasional internal untuk petugas dan admin UPTD: jurnal kegiatan SKP harian ber-GPS, kepegawaian, jadwal piket, media library, peta petugas, dan ekspor rekap SKP ke DOCX."
cover: "/images/proyek/pertamak-hub.webp"
coverAlt: "Mockup dashboard Pertamak Hub dengan peta sebaran petugas dan daftar jurnal kegiatan (data dummy)"
gallery: ["/images/proyek/pertamak-hub-1.webp"]
tech: ["Laravel", "React", "Vite", "MySQL", "Docker", "Coolify"]
links:
  live: "https://pertamak.cianjur.space"
  liveLabel: "Kunjungi Situs"
  repo: ""
related: ["siman"]
metrics:
  - { label: "Jurnal kegiatan", value: "±3.900" }
  - { label: "Pegawai", value: "62" }
  - { label: "Pengguna sistem", value: "62" }
audience: "Internal"
ecosystem: "Ekosistem Digital UPTD"
featured: true
order: 3
draft: false
---

## Latar Belakang

UPTD Pertamanan dan Pemakaman — di bawah Dinas Perumahan dan Kawasan Permukiman (Disperkim) Kabupaten Cianjur — mengelola puluhan petugas yang bekerja tersebar di taman kota dan tempat pemakaman umum. Laporan kegiatan harian untuk Sasaran Kinerja Pegawai (SKP) sebelumnya dikumpulkan secara manual, sehingga rekap bulanan memakan waktu dan sulit diverifikasi.

## Tantangan

- **Bukti kegiatan yang valid** — setiap aktivitas perlu lokasi dan foto.
- **Rekap SKP yang berulang** setiap periode, dengan format dokumen yang sudah baku.
- **Koordinasi petugas lapangan** — jadwal piket, kehadiran, dan sebaran petugas.
- **Pengguna dengan literasi digital beragam**, sehingga antarmuka harus sangat sederhana.

## Solusi

**Pertamak Hub** hadir dalam dua wajah: dashboard web responsif untuk admin dan pimpinan, serta aplikasi mobile untuk petugas. Petugas cukup memotret kegiatan; lokasi GPS dan waktu tercatat otomatis. Admin memverifikasi, lalu rekap SKP dapat diekspor langsung ke dokumen DOCX sesuai format.

Pertamak Hub juga terintegrasi dengan [SIMAN](/proyek/siman), layanan publik pemakaman, sehingga data operasional dan layanan warga saling melengkapi.

## Fitur Utama

- **Jurnal kegiatan SKP harian** dengan lokasi GPS dan foto.
- **Manajemen data pegawai** dan akun pengguna berbasis peran.
- **Jadwal piket dan kehadiran.**
- **Media library berfolder** untuk dokumentasi kegiatan.
- **Peta online sebaran petugas.**
- **Laporan dan ekspor rekap SKP ke DOCX.**

> [!IMPORTANT] Akses terbatas
> Dashboard Pertamak Hub hanya dapat diakses oleh pegawai yang memiliki akun. Tautan di halaman ini mengarah ke situs publik aplikasi.

## Hasil

Sekitar **3.900 jurnal kegiatan** telah tercatat dari **62 pegawai** yang seluruhnya aktif sebagai pengguna sistem. Rekap SKP yang dulu disusun manual kini dapat dihasilkan dalam hitungan menit, dan pimpinan dapat melihat aktivitas lapangan secara langsung.

## Teknologi

Laravel dan MySQL di backend, antarmuka React + Vite, dikemas dengan Docker dan dideploy melalui Coolify.
