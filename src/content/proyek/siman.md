---
title: "SIMAN"
subtitle: "Sistem Informasi Manajemen Pemakaman"
slug: "siman"
category: "Govtech"
type: ["Aplikasi Web"]
year: 2025
status: "Live"
client: "UPTD Pertamanan & Pemakaman, Disperkim Kabupaten Cianjur"
summary: "Layanan publik pemakaman: data TPU dan makam, pencarian makam, QR code di lokasi, serta status mobil jenazah — warga bisa mencari dan menghubungi petugas tanpa login."
cover: "/images/proyek/siman.webp"
coverAlt: "Mockup halaman pencarian makam SIMAN dengan kartu hasil dan QR code (data dummy)"
gallery: ["/images/proyek/siman-1.webp"]
tech: ["Laravel", "Filament", "MySQL", "Docker", "Coolify"]
links:
  live: "https://siman.cianjur.space"
  liveLabel: "Kunjungi Situs"
  repo: ""
related: ["pertamak-hub"]
metrics:
  - { label: "Akses warga", value: "Tanpa login" }
  - { label: "Penanda lokasi", value: "QR code" }
audience: "Layanan Publik"
ecosystem: "Ekosistem Digital UPTD"
featured: true
order: 4
draft: false
---

## Latar Belakang

Keluarga yang mencari lokasi makam kerabat sering kali harus datang ke kantor atau bertanya langsung ke petugas di lapangan. Informasi ketersediaan lahan dan mobil jenazah juga belum mudah diakses publik.

## Tantangan

- **Data yang sensitif** — informasi ahli waris harus terlindungi, sementara informasi umum tetap mudah diakses.
- **Pengguna umum tanpa akun** — warga harus bisa mencari data tanpa proses pendaftaran.
- **Penanda di lapangan** yang menghubungkan makam fisik dengan data digital.

## Solusi

**SIMAN** dibangun dengan Laravel dan Filament sebagai panel admin yang kokoh, dengan halaman publik yang ringan untuk warga. Setiap makam dapat diberi QR code yang, ketika dipindai, menampilkan informasi publik makam tersebut.

SIMAN terhubung dengan [Pertamak Hub](/proyek/pertamak-hub): petugas yang bekerja di TPU tercatat di sistem internal, sementara layanan warga tersedia di SIMAN.

## Fitur Utama

- **Data TPU, makam, dan ahli waris** dengan hak akses bertingkat.
- **Pencarian makam** untuk publik.
- **QR code di lokasi makam.**
- **Status ketersediaan mobil jenazah.**
- **Kontak petugas** langsung dari halaman publik, tanpa login.

> [!NOTE]
> Data ahli waris hanya dapat dilihat oleh petugas berwenang. Gambar pada halaman ini menggunakan data dummy.

## Hasil

Warga dapat mencari lokasi makam dan menghubungi petugas kapan saja, sementara petugas mengelola data pemakaman di satu panel yang rapi.

## Teknologi

Laravel, Filament, MySQL, Docker, dan Coolify.
