---
title: "TPM Super App"
subtitle: "Sistem ERP Tiga Putra Motor"
slug: "tpm-super-app"
category: "Bisnis"
type: ["Aplikasi Mobile", "Aplikasi Web"]
year: 2026
status: "Live"
client: "Tiga Putra Motor"
summary: "ERP mini untuk bengkel, jual beli mobil, jasa angkut, SDM, dan keuangan double-entry — tetap berjalan saat offline dan tersinkron real-time begitu koneksi kembali."
cover: "/images/proyek/tpm-super-app.webp"
coverAlt: "Mockup aplikasi TPM Super App di ponsel dan dashboard web (data dummy)"
gallery: ["/images/proyek/tpm-super-app-1.webp"]
tech: ["React Native", "Expo", "FastAPI", "MySQL", "WebSocket", "Docker"]
links:
  live: ""
  repo: ""
related: []
metrics:
  - { label: "Unit bisnis", value: "5" }
  - { label: "Pembukuan", value: "Double-entry" }
  - { label: "Mode", value: "Offline-first" }
featured: true
order: 2
draft: false
---

## Latar Belakang

Tiga Putra Motor menjalankan beberapa lini usaha sekaligus: bengkel, jual beli mobil, dan jasa angkut. Masing-masing punya catatan sendiri, sehingga pemilik sulit melihat kondisi keuangan secara utuh. Stok sparepart, antrean servis, dan pembagian hasil dengan investor dihitung terpisah.

## Tantangan

- **Banyak unit usaha, satu pembukuan.** Setiap transaksi harus tercatat benar di akun yang tepat.
- **Sinyal yang tidak stabil** di area bengkel — kasir tidak boleh berhenti hanya karena internet putus.
- **Keamanan akses** untuk data keuangan dan penggajian.
- **Perhitungan yang rumit** seperti biaya persiapan mobil dan bagi hasil investor.

## Solusi

Kami membangun **TPM Super App**: aplikasi mobile (React Native + Expo) untuk operasional harian dan panel web untuk pemilik, dengan backend FastAPI dan MySQL. Setiap transaksi operasional otomatis menghasilkan jurnal akuntansi *double-entry*, sehingga laporan keuangan selalu seimbang.

> [!NOTE]
> Aplikasi menyimpan transaksi di perangkat saat offline, lalu menyinkronkannya lewat WebSocket begitu koneksi kembali — lengkap dengan penanganan konflik.

## Fitur Utama

- **Bengkel** — antrean servis, Surat Perintah Kerja (SPK), stok sparepart, kasir, dan cetak struk printer thermal.
- **Jual beli mobil** — pencatatan unit, biaya persiapan per mobil, dan perhitungan bagi hasil investor.
- **Jasa angkut** — order, armada, dan pendapatan per perjalanan.
- **SDM & payroll** — data karyawan, kehadiran, dan penggajian.
- **Keuangan double-entry** — jurnal otomatis, buku besar, laba rugi, dan neraca.
- **Keamanan** — login PIN dan biometrik di perangkat.

## Hasil

Semua lini usaha kini tercatat dalam satu sistem. Pemilik dapat melihat laba rugi dan neraca kapan saja, kasir tetap bekerja walau offline, dan perhitungan bagi hasil investor tidak lagi dikerjakan manual.

## Teknologi

React Native, Expo, FastAPI, MySQL, WebSocket, dan Docker. Kode bersifat *proprietary* milik klien, sehingga repositori tidak dipublikasikan.
