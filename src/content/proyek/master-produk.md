---
title: "Master Produk"
subtitle: "Pencarian Master Data SE DJBK 47 Tahun 2026"
slug: "master-produk"
category: "Govtech"
type: ["Aplikasi Web"]
year: 2026
status: "Live"
client: "Internal — pendukung perencanaan pekerjaan umum"
summary: "Dashboard pencarian 6.190 item master data produk pekerjaan umum dengan pencarian instan, pencarian massal dari clipboard, panel detail, dan ekspor CSV/Excel."
cover: "/images/proyek/master-produk.webp"
coverAlt: "Mockup dashboard Master Produk dengan kolom pencarian dan tabel hasil (data dummy)"
gallery: ["/images/proyek/master-produk-1.webp"]
tech: ["FastAPI", "Python", "SQLite", "Docker"]
links:
  live: "https://ssh-arumanis.cianjur.space"
  repo: ""
related: ["arumanis"]
metrics:
  - { label: "Item master data", value: "6.190" }
  - { label: "Ekspor", value: "CSV & Excel" }
featured: false
order: 5
draft: false
---

## Latar Belakang

Penyusun anggaran dan perencana pekerjaan umum perlu mencocokkan item pekerjaan dengan master data produk resmi dari Surat Edaran DJBK Nomor 47 Tahun 2026. Data aslinya berupa dokumen PDF yang panjang, sehingga pencarian manual lambat dan rawan salah kode.

## Tantangan

- **Sumber data berupa PDF** yang harus diekstraksi menjadi data terstruktur.
- **Pencarian ratusan item sekaligus** saat menyusun daftar kebutuhan.
- **Deskripsi yang mirip-mirip** sehingga pencocokan harus cerdas.

## Solusi

Kami mengekstraksi **6.190 item** dari PDF ke SQLite, lalu membangun API FastAPI yang cepat dan antarmuka dashboard yang langsung merespons saat pengguna mengetik.

## Fitur Utama

- **Pencarian instan (as-you-type).**
- **Pencarian massal** — tempel daftar dari clipboard; sistem mendeteksi kode dan mencocokkan deskripsi secara otomatis.
- **Panel detail slide-out** berisi klasifikasi bidang, satuan, dan lingkup teknis.
- **Ekspor CSV dan Excel.**
- **Ekstraksi ulang data dari PDF** saat ada pembaruan dokumen sumber.

```python
# Cuplikan ide pencocokan massal (disederhanakan)
def cocokkan(baris: str) -> Item | None:
    if kode := deteksi_kode(baris):
        return cari_by_kode(kode)
    return cari_terdekat(normalisasi(baris), ambang=0.82)
```

## Hasil

Pencocokan ratusan item yang sebelumnya memakan waktu berjam-jam kini selesai dalam hitungan detik, dengan hasil yang siap diekspor ke spreadsheet.

## Teknologi

FastAPI, Python, SQLite, dan Docker.
