---
title: "ARUMANIS"
subtitle: "Satu Data Air Minum & Sanitasi Kabupaten Cianjur"
slug: "arumanis"
category: "Govtech"
type: ["Aplikasi Web"]
year: 2026
status: "Live"
client: "Pemerintah Kabupaten Cianjur"
summary: "Portal operasional untuk perencanaan, pelaksanaan, dokumentasi lapangan, dan pengawasan program air minum dan sanitasi — dari kontrak hingga foto progres ber-GPS dalam satu tempat."
cover: "/images/proyek/arumanis.webp"
coverAlt: "Mockup dashboard ARUMANIS berisi peta, grafik progres, dan daftar paket pekerjaan (data dummy)"
gallery: ["/images/proyek/arumanis-1.webp"]
tech: ["React 19", "TypeScript", "Vite", "Hono", "Bun", "Laravel", "MySQL", "Docker"]
links:
  live: "https://arumanis.cianjur.space"
  repo: ""
related: ["master-produk"]
metrics:
  - { label: "Modul utama", value: "7" }
  - { label: "Format laporan", value: "Excel & PDF" }
  - { label: "Dokumentasi", value: "Geo-fence + GPS" }
featured: true
order: 1
draft: false
---

## Latar Belakang

Program air minum dan sanitasi melibatkan banyak pihak sekaligus: perencana, pelaksana, konsultan pengawas, hingga pimpinan yang butuh gambaran cepat. Sebelumnya data tersebar di spreadsheet, grup percakapan, dan folder foto yang sulit dilacak. Laporan progres harus dirangkum manual setiap kali diminta.

**ARUMANIS** (Satu Data Air Minum & Sanitasi) dibangun untuk menyatukan seluruh siklus program — dari perencanaan hingga serah terima — dalam satu portal yang bisa diakses sesuai peran masing-masing.

## Tantangan

- **Bukti lapangan yang bisa dipercaya.** Foto progres harus benar-benar diambil di lokasi pekerjaan, bukan diunggah ulang dari tempat lain.
- **Dokumen yang berlapis.** Satu paket pekerjaan punya kontrak, adendum, berita acara, dan lampiran yang terus bertambah.
- **Kebutuhan laporan yang beragam.** Pimpinan butuh ringkasan visual; staf teknis butuh rekap rinci yang bisa diolah lagi.
- **Konektivitas terbatas** di sebagian lokasi pekerjaan.

## Solusi

Kami merancang ARUMANIS sebagai aplikasi web modern dengan arsitektur *Backend for Frontend* (BFF): antarmuka React berbicara dengan lapisan Hono yang ringan di Bun, sementara Laravel menangani domain inti, otorisasi, dan pembuatan laporan.

> [!TIP] Kenapa BFF?
> Lapisan BFF membuat antarmuka tetap cepat dan sederhana, sekaligus menjaga aturan bisnis dan data sensitif tetap di sisi server.

## Fitur Utama

- **Foto progres dengan geo-fence dan watermark GPS** — foto hanya diterima bila diambil di radius lokasi pekerjaan, lalu diberi cap koordinat, waktu, dan identitas paket.
- **Manajemen kontrak & dokumen** — versi dokumen tercatat rapi per paket pekerjaan.
- **Panel pengawasan** — konsultan dan pengawas dapat memberi catatan dan verifikasi progres.
- **Dashboard peta & analitik** — sebaran paket, capaian fisik, dan status per wilayah dalam satu layar.
- **Laporan Excel & PDF** — satu klik untuk rekap sesuai format yang dibutuhkan.
- **Asisten AI** — membantu merangkum progres dan menjawab pertanyaan seputar data program.

![Tampilan halaman dokumentasi lapangan ARUMANIS (data dummy)](/images/proyek/arumanis-1.webp "Halaman dokumentasi lapangan dengan peta dan foto ber-watermark — semua data pada gambar adalah data dummy.")

## Hasil

Data program kini berada di satu sumber yang sama. Progres lapangan terdokumentasi dengan bukti lokasi, laporan yang sebelumnya dirangkum berhari-hari dapat diunduh seketika, dan pimpinan bisa memantau kondisi terkini tanpa menunggu rekap manual.

## Teknologi

| Lapisan | Teknologi |
| --- | --- |
| Antarmuka | React 19, TypeScript, Vite |
| BFF | Hono di atas Bun |
| Backend inti | Laravel, MySQL |
| Infrastruktur | Docker |
