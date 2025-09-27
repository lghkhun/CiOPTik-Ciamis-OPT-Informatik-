
# 🌳 CiOPTik: Ciamis OPT Informatik

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=for-the-badge&logo=vite)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Google-orange?style=for-the-badge&logo=google-gemini)

**CiOPTik** adalah sebuah aplikasi web modern yang berfungsi sebagai Sistem Pelaporan, Rekapitulasi, dan Analisis Data Serangan Organisme Pengganggu Tumbuhan (OPT) di Kabupaten Ciamis. Dibangun dengan React, TypeScript, dan didukung oleh Google Gemini AI, platform ini dirancang untuk memodernisasi alur kerja, meningkatkan akurasi data, dan menyediakan wawasan mendalam bagi para pemangku kepentingan di bidang pertanian.

---

### Daftar Isi
1. [Latar Belakang & Tujuan](#-latar-belakang--tujuan)
2. [Tampilan Aplikasi](#-tampilan-aplikasi)
3. [Fitur Unggulan](#-fitur-unggulan)
4. [Tumpukan Teknologi](#️-tumpukan-teknologi)
5. [Arsitektur Proyek](#-arsitektur-proyek)
6. [Panduan Instalasi Lokal](#-panduan-instalasi-lokal)
7. [Kredensial Admin Lokal](#-kredensial-admin-lokal)
8. [Berkontribusi](#-berkontribusi)
9. [Lisensi](#-lisensi)

---

## 🎯 Latar Belakang & Tujuan

Pengelolaan data serangan OPT di Kabupaten Ciamis secara tradisional seringkali menghadapi tantangan seperti proses pelaporan yang lambat, rekapitulasi manual yang rentan kesalahan, dan analisis data yang terbatas. Hal ini dapat menghambat pengambilan keputusan yang cepat dan tepat dalam strategi pengendalian OPT.

**CiOPTik hadir untuk menyelesaikan masalah ini dengan tujuan:**
-   **Digitalisasi & Sentralisasi**: Menciptakan satu sumber data terpusat yang mudah diakses dan dikelola.
-   **Efisiensi**: Mempercepat proses pelaporan dan rekapitulasi data dari berbagai kecamatan.
-   **Akurasi**: Mengurangi human error melalui input terstruktur dan validasi data.
-   **Wawasan Mendalam**: Menyediakan alat analisis canggih berbasis AI untuk mengidentifikasi tren, pola serangan, dan memberikan rekomendasi strategis.
-   **Transparansi**: Menyajikan data yang telah disetujui kepada publik untuk meningkatkan kesadaran dan partisipasi.

---

## 🖥️ Tampilan Aplikasi

Berikut adalah tampilan antarmuka utama dari aplikasi CiOPTik, menampilkan dasbor publik dengan visualisasi data interaktif.

** 
*(Catatan: Ganti dengan URL screenshot aplikasi Anda)*

---

## ✨ Fitur Unggulan

Platform ini dirancang dengan dua peran utama: **Pengguna Publik** dan **Operator Admin**.

### Untuk Pengguna Publik:
-   **Dasbor Ringkasan Dinamis**: Halaman utama secara otomatis menyajikan ringkasan data terkini dari periode laporan terbaru, menampilkan metrik kunci seperti total serangan, OPT paling dominan, dan jumlah kecamatan terdampak.
-   **Visualisasi Interaktif**: Data disajikan dalam bentuk tabel hierarkis yang detail serta grafik batang dan garis. Pengguna dapat mengklik elemen grafik untuk memfilter data di tabel secara *real-time*.
-   **Filter Data Cerdas (Cascading Filters)**: Sistem filter bertingkat di mana pilihan pada satu filter (misal: Tahun) akan secara otomatis menyesuaikan opsi yang tersedia pada filter lainnya (misal: Periode), membuat eksplorasi data lebih cepat dan intuitif.
-   **Analisis AI Cepat**: Menghasilkan ringkasan teks dan grafik secara otomatis dari data yang sedang ditampilkan dengan satu klik, didukung oleh Gemini AI.
-   **AI Chat Analyzer**: Sebuah *chat assistant* di dalam modal yang memungkinkan pengguna untuk bertanya tentang data yang ditampilkan menggunakan bahasa natural (Bahasa Indonesia).
-   **Pusat Informasi OPT**: Halaman edukatif yang berisi materi mengenai jenis-jenis OPT umum beserta visualisasi siklus hidupnya untuk membantu pemahaman.

### Untuk Operator Admin:
-   **Manajemen Data (CRUD)**: Dasbor khusus untuk membuat, membaca, memperbarui, dan menghapus data laporan serangan OPT.
-   **Sistem Persetujuan Data**: Alur kerja untuk meninjau dan menyetujui data yang masuk sebelum dipublikasikan ke dasbor publik, memastikan validitas data.
-   **Upload Massal via CSV**: Fitur untuk mengimpor banyak data sekaligus dari file CSV, mempercepat proses entri data secara signifikan.
-   **Input Data Tervalidasi**: Formulir input dilengkapi dengan dropdown dan validasi numerik untuk meminimalkan kesalahan input dan menjaga konsistensi data.

---

## 🛠️ Tumpukan Teknologi

-   **Frontend**: React `19`, TypeScript
-   **Styling**: Tailwind CSS
-   **AI & Machine Learning**: Google Gemini AI API (`@google/genai`)
-   **Routing**: React Router `v6`
-   **Visualisasi Data**: Recharts
-   **Bundler**: Vite

---

## 🏛️ Arsitektur Proyek

Struktur direktori proyek dirancang agar modular dan mudah dikelola:

```
/src
├── /components   # Komponen UI yang dapat digunakan kembali (Header, Modal, Ikon, dll.)
├── /contexts     # Global state management (contoh: AuthContext)
├── /hooks        # Custom React hooks (contoh: useDebounce, useSortableData)
├── /pages        # Komponen utama untuk setiap halaman/rute aplikasi
├── /services     # Logika bisnis, interaksi dengan API & localStorage (dataService, geminiService)
├── App.tsx       # Komponen root aplikasi dan konfigurasi routing
├── index.tsx     # Titik masuk utama aplikasi React
└── types.ts      # Definisi tipe TypeScript global (interface)
```

---

## 🚀 Panduan Instalasi Lokal

Untuk menjalankan proyek ini di lingkungan lokal, ikuti langkah-langkah berikut:

### Prasyarat
-   Node.js (versi 18 atau lebih tinggi direkomendasikan)
-   NPM atau Yarn
-   API Key dari **Google AI Studio (Gemini)**

### Langkah-langkah Instalasi

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/username/cioptik.git
    cd cioptik
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variable**
    -   Buat sebuah file baru di root direktori proyek dengan nama `.env`.
    -   Tambahkan API Key Gemini Anda ke dalam file `.env` seperti berikut. Ganti `YOUR_GEMINI_API_KEY` dengan kunci API Anda yang sebenarnya.
    ```
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
    > **Penting**: Dalam proyek berbasis Vite, nama variabel harus diawali dengan `VITE_` agar dapat diakses di kode frontend.

4.  **Menjalankan Aplikasi**
    Setelah instalasi dan konfigurasi selesai, jalankan server pengembangan lokal:
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan dan dapat diakses di `http://localhost:5173` (atau port lain yang tersedia).

---

## 🔑 Kredensial Admin Lokal

> Untuk mengakses dasbor admin pada lingkungan pengembangan lokal, gunakan kredensial berikut pada halaman login:
> -   **Username**: `operator_ciamis`
> -   **Password**: `password123`

---

## 🤝 Berkontribusi

Kami menyambut kontribusi untuk meningkatkan CiOPTik. Jika Anda menemukan bug atau memiliki ide untuk fitur baru, silakan buka *Issue* di repositori GitHub. Untuk kontribusi kode, silakan buat *Pull Request* dengan deskripsi yang jelas mengenai perubahan yang Anda buat.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Lihat file `LICENSE` untuk detail lebih lanjut.
