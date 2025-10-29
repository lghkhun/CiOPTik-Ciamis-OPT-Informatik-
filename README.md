# 🌿 CiOPTik - Ciamis OPT Informatik 🌿

Sistem informasi *kece* buat pelaporan, rekapitulasi, dan analisis data serangan hama (OPT) di Kabupaten Ciamis. Biar petani makin jago, data makin akurat!

<!-- Jangan lupa ganti GIF ini dengan demo aplikasi kamu yang keren! -->
![CiOPTik Demo](https://i.ibb.co/bF0Zz1p/peta-ciamis.png)

## 🤔 Kenalan Dulu, Kuy!

**CiOPTik** (Ciamis OPT Informatik) bukan sekadar aplikasi biasa. Ini adalah *super-tool* berbasis web yang ngebantu para petugas pertanian dan pemerintah buat mantau serangan hama secara *real-time*. Dilengkapi visualisasi data yang interaktif dan analisis canggih pake AI Google Gemini, CiOPTik siap bikin Ciamis makin tangguh hadapi hama!

## ✨ Fitur-Fitur Keren

-   📊 **Dashboard Publik Ciamik**: Liat data serangan hama yang udah valid dalam bentuk tabel dan grafik interaktif. Gampang dibaca, gampang dipahami!
-   🤖 **Analis AI Pribadi**: Bingung baca data? Tanya aja langsung ke Analis AI Gemini! Dapatkan ringkasan dan *insight* tersembunyi dari data yang ada.
-   🔒 **Dashboard Admin Aman**: Operator bisa ngelola data laporan (tambah, edit, hapus) dan setujui data mana yang boleh tayang buat publik.
-   ✍️ **Manajemen Konten Fleksibel**: Admin bisa update gambar dan info penting lainnya di halaman informasi hama & penyakit.
-   💌 **Kotak Masukan**: Pengguna publik bisa kirim *feedback*, saran, atau pertanyaan langsung ke admin.
-   🔑 **Login Aman Jaya**: Sistem login khusus buat operator/admin pake Supabase Auth. Data kamu aman!
-   ⬇️ **Download Data Sekali Klik**: Butuh data buat laporan? Download aja data yang udah difilter dalam format Excel (.xlsx) atau CSV.

## 🚀 Tech Stack Canggih

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)
-   **AI (Otaknya)**: Google Gemini API
-   **Grafik**: Recharts

---

## 🛠️ Tutorial Instalasi Gampang Banget! (Self-Hosting)

Mau install CiOPTik di server atau hosting-mu sendiri? Gampang banget! Ikuti langkah-langkah di bawah ini, dijamin anti pusing.

### 1. Siapin Amunisi Dulu, Bro!

Sebelum mulai, pastiin kamu udah punya ini:

1.  **Akun Supabase**: Buat akun gratis di [supabase.com](https://supabase.com/). Ini bakal jadi backend dan database kita.
2.  **API Key Google Gemini**: Dapetin API Key kamu dari [Google AI Studio](https://aistudio.google.com/).
3.  **Git**: Udah install Git di komputermu. Kalau belum, download dari [git-scm.com](https://git-scm.com/).

### 2. Langkah-Langkah Instalasi

#### **Langkah 1: Clone Repositori Ini**

Buka terminal atau command prompt, terus jalanin perintah ini:

```bash
git clone https://github.com/USERNAME/NAMA-REPO-KAMU.git
cd NAMA-REPO-KAMU
```

*(Jangan lupa ganti `USERNAME` dan `NAMA-REPO-KAMU` ya!)*

#### **Langkah 2: Setup Supabase (Backend Magic ✨)**

Ini bagian paling penting, jadi ikutin pelan-pelan ya!

1.  **Bikin Proyek Baru**: Login ke Supabase, terus bikin proyek baru.
2.  **Ambil Kunci API**:
    *   Masuk ke proyekmu, klik ikon gerigi (Settings) > **API**.
    *   Kamu butuh 2 hal dari sini: **Project URL** dan **Project API Keys** (pake yang `anon` `public`). Catat dulu di tempat aman.
3.  **Bikin Bucket Penyimpanan**:
    *   Di menu kiri, klik ikon Storage.
    *   Klik **"Create a new bucket"**.
    *   Kasih nama bucket: `opt-images` (harus persis ini ya!).
    *   Pastiin bucket-nya **Public**.
4.  **Jalanin Skrip SQL Sakti**:
    *   Di menu kiri, klik **SQL Editor**.
    *   Buka file `supasql.md` di proyek yang udah kamu clone.
    *   **Copy SEMUA isinya**, terus **paste** ke SQL Editor di Supabase.
    *   Klik tombol **"RUN"**. Selesai! Database, tabel, dan data awal kamu udah siap.

> **PENTING!** Kenapa langkah ke-4 ini krusial? Skrip ini nggak cuma bikin tabel, tapi juga ngatur **Row Level Security (RLS)**. Tanpa RLS yang bener, aplikasimu nggak akan bisa baca data dari database, alias bakal kosong melompong.

#### **Langkah 3: Konfigurasi Kunci Rahasia 🤫**

Sekarang, kita sambungin aplikasi dengan Supabase dan Gemini. Cuma ada 2 file yang perlu kamu edit.

1.  **Koneksi Supabase**:
    *   Buka file `services/supabaseClient.ts`.
    *   Ganti nilai `supabaseUrl` dan `supabaseAnonKey` dengan kredensial dari proyek Supabase-mu.

2.  **Koneksi Gemini AI**:
    *   Buka file `services/geminiClient.ts`.
    *   Ganti nilai `GEMINI_API_KEY` dengan API Key dari Google AI Studio milikmu.

> **Tips Keamanan**: Jangan pernah upload file-file ini dengan kunci rahasia ke repository publik seperti GitHub! Buat file `.gitignore` dan tambahkan baris `services/supabaseClient.ts` dan `services/geminiClient.ts` di dalamnya untuk mencegahnya ter-upload.

#### **Langkah 4: Bikin Akun Admin Pertama**

1.  Di dashboard Supabase, masuk ke **Authentication** > **Users**.
2.  Klik **"Invite user"** dan masukin alamat emailmu.
3.  Buka email undangan yang masuk, klik link-nya, dan atur password buat akun adminmu.

#### **Langkah 5: Upload ke Hosting & Go Live! 🚀**

Karena ini aplikasi statis (HTML, CSS, JS), kamu bisa hosting di mana aja dengan gampang!

1.  **Pilih Hosting**: Kamu bisa pake [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), [Firebase Hosting](https://firebase.google.com/docs/hosting), atau bahkan [GitHub Pages](https://pages.github.com/).
2.  **Upload File**:
    *   Cukup upload semua file dari folder proyekmu ke penyedia hosting pilihanmu.
    *   Banyak penyedia (kayak Netlify/Vercel) punya fitur drag-and-drop atau bisa langsung dihubungkan ke repositori Git-mu. Gampang banget!

**Selesai!** Aplikasi CiOPTik-mu sekarang udah online dan siap digunakan!

## 🤯 Sering Ketemu Masalah? (Troubleshooting)

-   **"Kok datanya nggak muncul di halaman publik/admin?"**
    *   Ini 99% masalah **Row Level Security (RLS)**. Solusinya: Pastiin kamu udah jalanin **SEMUA** skrip dari `supasql.md` tanpa error. Cek lagi kebijakan (Policies) di setiap tabel di dashboard Supabase-mu.
-   **"Gagal upload gambar!"**
    *   Cek lagi nama bucket di Supabase Storage, harus `opt-images`.
    *   Pastikan juga bucket-nya udah di-set ke **Public**.
-   **"Error terkait API Key Supabase atau Gemini"**
    *   Pastikan API Key yang kamu masukkan di file `supabaseClient.ts` dan `geminiClient.ts` sudah benar, tanpa spasi ekstra.

## 🤝 Mau Ikutan Kontribusi?

Tentu boleh! Kalau kamu punya ide buat bikin CiOPTik makin keren, jangan ragu buat *fork* repository ini, buat perubahanmu, dan kirim *pull request*. Semua kontribusi sangat kami hargai!

## 📜 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Bebas kamu gunakan dan modifikasi.

---
Dibuat dengan ❤️ untuk pertanian Ciamis yang lebih maju.
