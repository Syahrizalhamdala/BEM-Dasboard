
# MAKALAH

## SISTEM INFORMASI MANAJEMEN ORGANISASI KEMAHASISWAAN BERBASIS WEB: STUDI KASUS BADAN EKSEKUTIF MAHASISWA KABINET NAWASENA UNIVERSITAS NUSA PUTRA

---

Disusun Oleh:

---

**PROGRAM STUDI TEKNIK INFORMATIKA**
**FAKULTAS TEKNIK**
**UNIVERSITAS NUSA PUTRA**
**2026**

---

## DAFTAR ISI

**HALAMAN JUDUL ............................................................................................................. i**
**DAFTAR ISI ...................................................................................................................... ii**
**DAFTAR GAMBAR .......................................................................................................... iii**
**DAFTAR TABEL ............................................................................................................... iv**

**BAB I PENDAHULUAN**
1.1 Latar Belakang ........................................................................................................ 1
1.2 Rumusan Masalah .................................................................................................... 3
1.3 Tujuan Penelitian ...................................................................................................... 3
1.4 Ruang Lingkup ......................................................................................................... 4

**BAB II TINJAUAN PUSTAKA**
2.1 Sistem Informasi Manajemen ................................................................................... 5
2.2 Organisasi Kemahasiswaan ....................................................................................... 6
2.3 Framework Laravel .................................................................................................. 7
2.4 React.js ................................................................................................................... 8
2.5 Basis Data PostgreSQL ............................................................................................ 9
2.6 QR Code untuk Presensi Kehadiran ........................................................................ 10
2.7 GPS dan Haversine Formula ................................................................................... 11
2.8 Kecerdasan Buatan dalam Pengecekan Proposal ..................................................... 12
2.9 Penelitian Terdahulu ............................................................................................... 13

**BAB III METODOLOGI PENELITIAN**
3.1 Metode Penelitian .................................................................................................. 14
3.2 Tahapan Penelitian ................................................................................................. 15
3.3 Teknik Pengumpulan Data ...................................................................................... 17
3.4 Alat dan Bahan Penelitian ....................................................................................... 18
3.5 Arsitektur Sistem ................................................................................................... 19
3.6 Diagram Alir Sistem (Flowchart) ............................................................................ 20
3.7 Entity Relationship Diagram (ERD) ........................................................................ 21

**BAB IV HASIL DAN PEMBAHASAN**
4.1 Gambaran Umum Sistem ........................................................................................ 22
4.2 Implementasi Sistem ............................................................................................... 23
4.2.1 Autentikasi dan Manajemen Pengguna ................................................................ 23
4.2.2 Dashboard ......................................................................................................... 24
4.2.3 Manajemen Anggota Kabinet ............................................................................ 25
4.2.4 Manajemen Agenda ........................................................................................... 26
4.2.5 Sistem Absensi dengan QR Code dan GPS ........................................................ 27
4.2.6 Pengecekan Proposal Berbasis AI ...................................................................... 29
4.2.7 Chatbot Asisten Virtual ...................................................................................... 31
4.2.8 Manajemen Laporan .......................................................................................... 32
4.2.9 Import Data Excel ............................................................................................. 33
4.2.10 Role-Based Access Control .............................................................................. 33
4.3 Tampilan Antarmuka Sistem .................................................................................. 34
4.4 Pengujian Sistem ................................................................................................... 35

**BAB V KESIMPULAN DAN SARAN**
5.1 Kesimpulan ........................................................................................................... 36
5.2 Saran ...................................................................................................................... 37

**DAFTAR PUSTAKA ......................................................................................................... 38**

---

## DAFTAR GAMBAR

Gambar 3.1 Tahapan Penelitian ..................................................................................... 16
Gambar 3.2 Arsitektur Sistem ....................................................................................... 19
Gambar 3.3 Flowchart Sistem ....................................................................................... 20
Gambar 3.4 Entity Relationship Diagram ....................................................................... 21
Gambar 4.1 Halaman Login ........................................................................................... 34
Gambar 4.2 Halaman Dashboard ................................................................................... 34
Gambar 4.3 Halaman Manajemen Anggota ...................................................................... 34
Gambar 4.4 Halaman Agenda dan QR Code .................................................................... 34
Gambar 4.5 Halaman Absensi ........................................................................................ 34
Gambar 4.6 Halaman Pengecekan Proposal .................................................................... 34
Gambar 4.7 Halaman Chatbot ....................................................................................... 34

## DAFTAR TABEL

Tabel 3.1 Alat dan Bahan Penelitian ............................................................................. 18
Tabel 4.1 Hasil Pengujian Fungsional Sistem .................................................................. 35

---

## BAB I
## PENDAHULUAN

### 1.1 Latar Belakang

Perkembangan teknologi informasi dan komunikasi telah membawa perubahan signifikan dalam berbagai aspek kehidupan, termasuk dalam pengelolaan organisasi. Organisasi kemahasiswaan di perguruan tinggi merupakan wadah pengembangan diri mahasiswa yang memerlukan sistem pengelolaan yang efektif dan efisien. Badan Eksekutif Mahasiswa (BEM) sebagai organisasi kemahasiswaan tertinggi di tingkat universitas memiliki tanggung jawab besar dalam mengelola berbagai kegiatan, anggota, dan administrasi organisasi.

Universitas Nusa Putra memiliki BEM dengan Kabinet Nawasena yang menjalankan berbagai program kerja dan kegiatan kemahasiswaan. Dalam pelaksanaannya, BEM menghadapi berbagai tantangan operasional, antara lain manajemen data anggota yang masih dilakukan secara manual, pencatatan kehadiran rapat dan kegiatan yang belum terintegrasi, proses pengajuan dan pengecekan proposal yang memakan waktu lama, serta kurangnya sistem informasi yang memudahkan akses informasi organisasi bagi seluruh anggota. Permasalahan-permasalahan tersebut mengakibatkan inefisiensi dalam pengelolaan organisasi dan menghambat produktivitas kerja kepengurusan BEM.

Proses absensi yang masih menggunakan metode konvensional seperti tanda tangan manual rentan terhadap kecurangan dan sulit diverifikasi. Selain itu, pengecekan proposal kegiatan yang dilakukan secara manual memerlukan waktu yang cukup lama karena harus diperiksa satu per satu oleh pengurus yang berwenang. Belum adanya sistem informasi terpusat juga menyulitkan anggota untuk mengakses informasi terkini mengenai agenda, anggota, dan program kerja BEM.

Berdasarkan permasalahan tersebut, diperlukan sebuah Sistem Informasi Manajemen (SIM) berbasis web yang dapat mengintegrasikan seluruh proses bisnis organisasi BEM. Sistem ini diharapkan mampu mengelola data anggota, agenda kegiatan, absensi berbasis QR Code dan validasi GPS, pengecekan proposal berbasis kecerdasan buatan (AI), serta menyediakan asisten virtual untuk memudahkan akses informasi organisasi.

Penelitian ini bertujuan untuk mengembangkan Sistem Informasi Manajemen BEM Dashboard yang dibangun menggunakan framework Laravel sebagai backend dan React.js sebagai frontend, dengan basis data PostgreSQL pada platform Supabase. Pendekatan arsitektur Controller-Service-Repository digunakan untuk memisahkan concerns dan memudahkan pemeliharaan sistem. Teknologi QR Code dan formula Haversine diterapkan untuk sistem absensi yang akurat, sementara API Groq dengan model Llama 3.3 70B digunakan untuk pengecekan proposal dan chatbot asisten virtual.

### 1.2 Rumusan Masalah

Berdasarkan latar belakang yang telah diuraikan, maka rumusan masalah dalam penelitian ini adalah sebagai berikut:

1. Bagaimana merancang dan membangun Sistem Informasi Manajemen organisasi kemahasiswaan yang terintegrasi untuk BEM Kabinet Nawasena Universitas Nusa Putra?
2. Bagaimana menerapkan sistem absensi berbasis QR Code dengan validasi GPS menggunakan formula Haversine untuk meningkatkan akurasi presensi kehadiran?
3. Bagaimana mengimplementasikan kecerdasan buatan untuk proses pengecekan proposal kegiatan organisasi secara otomatis?
4. Bagaimana membangun asisten virtual berbasis AI yang dapat memberikan informasi organisasi secara real-time kepada anggota?
5. Bagaimana menerapkan sistem manajemen pengguna dengan Role-Based Access Control (RBAC) untuk membedakan hak akses admin dan anggota?

### 1.3 Tujuan Penelitian

Tujuan dari penelitian ini adalah:

1. Merancang dan membangun Sistem Informasi Manajemen BEM berbasis web yang terintegrasi menggunakan framework Laravel dan React.js.
2. Mengimplementasikan sistem absensi berbasis QR Code dengan validasi geolokasi menggunakan formula Haversine untuk memastikan kehadiran fisik di lokasi kegiatan.
3. Mengintegrasikan kecerdasan buatan melalui API Groq (Llama 3.3 70B) untuk pengecekan proposal secara otomatis berdasarkan pedoman yang telah ditetapkan.
4. Mengembangkan chatbot asisten virtual yang mampu menjawab pertanyaan seputar organisasi berbasis data anggota, program kerja, dan jadwal rapat.
5. Menerapkan sistem kontrol akses berbasis peran (Role-Based Access Control) yang membedakan hak akses antara admin dan anggota biasa.

### 1.4 Ruang Lingkup

Ruang lingkup penelitian ini meliputi:

1. **Pengguna sistem**: Admin (pengurus inti BEM) dan Anggota (seluruh anggota BEM Kabinet Nawasena Universitas Nusa Putra).
2. **Modul sistem**: Manajemen anggota kabinet, manajemen agenda kegiatan, sistem absensi dengan QR Code dan validasi GPS, pengecekan proposal berbasis AI, chatbot asisten virtual, manajemen laporan, import data Excel, dashboard statistik, dan manajemen pengaturan.
3. **Teknologi**: Backend menggunakan Laravel 13 dengan PHP 8.3, frontend menggunakan React 19 dengan Vite dan Tailwind CSS v4, basis data menggunakan PostgreSQL pada platform Supabase, autentikasi menggunakan Laravel Sanctum, AI menggunakan Groq API model Llama 3.3 70B.
4. **Lokasi**: Lingkungan kampus Universitas Nusa Putra dengan koordinat -6.8564, 107.5889 dan radius validasi 100 meter.
5. **Batasan**: Sistem tidak mencakup modul keuangan, sistem pemilihan (voting), atau integrasi dengan sistem akademik universitas. Pengembangan terbatas pada perangkat lunak dan tidak mencakup infrastruktur jaringan atau perangkat keras.

---

## BAB II
## TINJAUAN PUSTAKA

### 2.1 Sistem Informasi Manajemen

Sistem Informasi Manajemen (SIM) adalah sistem yang menyediakan informasi yang dibutuhkan oleh manajemen untuk pengambilan keputusan operasional, taktis, dan strategis dalam suatu organisasi (Laudon & Laudon, 2020). SIM mengintegrasikan pengumpulan, pemrosesan, penyimpanan, dan penyebaran informasi untuk mendukung operasi, manajemen, dan fungsi pengambilan keputusan dalam suatu organisasi.

Dalam konteks organisasi kemahasiswaan, SIM berperan penting dalam mengelola data anggota, kegiatan, absensi, dan administrasi lainnya. Penerapan SIM dalam organisasi kemahasiswaan dapat meningkatkan transparansi, akuntabilitas, dan efisiensi pengelolaan organisasi.

Sistem Informasi Manajemen BEM Dashboard yang dikembangkan dalam penelitian ini merupakan aplikasi SIM berbasis web yang mencakup berbagai modul fungsional untuk mendukung operasional BEM, termasuk manajemen anggota, agenda, absensi, proposal, dan pelaporan.

### 2.2 Organisasi Kemahasiswaan

Organisasi kemahasiswaan adalah wadah pengembangan diri mahasiswa di perguruan tinggi yang bertujuan untuk mengembangkan potensi, minat, bakat, dan kepribadian mahasiswa (Permendikbud No. 3 Tahun 2020). Badan Eksekutif Mahasiswa (BEM) merupakan organisasi kemahasiswaan intra-universitas yang berfungsi sebagai lembaga eksekutif dalam struktur pemerintahan mahasiswa.

BEM Kabinet Nawasena Universitas Nusa Putra memiliki struktur organisasi yang terdiri dari Presiden Mahasiswa (Presma), Wakil Presiden Mahasiswa, beberapa kementerian (seperti Kementerian Dalam Negeri, Kementerian Luar Negeri, Kementerian Ekonomi Kreatif, dll.), serta anggota yang tersebar di berbagai divisi. Setiap kementerian memiliki program kerja yang harus direncanakan, dilaksanakan, dan dilaporkan dalam periode kepengurusan.

### 2.3 Framework Laravel

Laravel adalah framework aplikasi web berbasis PHP yang open-source dengan arsitektur Model-View-Controller (MVC). Laravel menyediakan berbagai fitur yang memudahkan pengembangan aplikasi web modern, termasuk routing, middleware, ORM (Object-Relational Mapping), autentikasi, dan migrasi basis data (Stauffer, 2019).

Laravel 13 yang digunakan dalam penelitian ini merupakan versi terbaru dari framework Laravel yang mendukung PHP 8.3. Beberapa fitur unggulan Laravel yang digunakan dalam pengembangan sistem ini antara lain:

- **Eloquent ORM**: Memudahkan interaksi dengan basis data melalui sintaks yang ekspresif dan intuitif.
- **Laravel Sanctum**: Menyediakan sistem autentikasi token-based yang ringan untuk aplikasi SPA (Single Page Application).
- **Middleware**: Memungkinkan penerapan filter HTTP request untuk keperluan autentikasi dan otorisasi.
- **Migration**: Memudahkan manajemen skema basis data secara version-controlled.
- **Service Container**: Mendukung dependency injection untuk arsitektur yang lebih terstruktur.

### 2.4 React.js

React.js adalah library JavaScript untuk membangun antarmuka pengguna (UI) yang dikembangkan oleh Facebook. React menggunakan konsep komponen yang dapat digunakan kembali (reusable components) dan virtual DOM untuk meningkatkan performa rendering (Banks & Porcello, 2020).

React 19 yang digunakan dalam penelitian ini mendukung berbagai fitur modern seperti:

- **Hooks**: useState, useEffect, useContext untuk manajemen state dan efek samping.
- **React Router**: Untuk navigasi client-side dalam aplikasi SPA dengan konsep lazy loading.
- **Context API**: Untuk manajemen state global seperti autentikasi dan sidebar.
- **Framer Motion**: Untuk animasi transisi halaman dan komponen.
- **Tailwind CSS v4**: Framework CSS utility-first untuk styling yang responsif dan konsisten.

### 2.5 Basis Data PostgreSQL

PostgreSQL adalah sistem manajemen basis data relasional (RDBMS) open-source yang terkenal dengan keandalan, performa, dan kepatuhan terhadap standar SQL. PostgreSQL mendukung berbagai fitur lanjutan seperti ACID (Atomicity, Consistency, Isolation, Durability), indexing yang canggih, dan ekstensibilitas.

Dalam penelitian ini, PostgreSQL dijalankan pada platform Supabase, yaitu Firebase alternatif open-source yang menyediakan basis data PostgreSQL dengan fitur real-time, autentikasi, dan penyimpanan file. Penggunaan Supabase memudahkan pengelolaan basis data dengan menyediakan antarmuka web, API otomatis, dan fitur Row-Level Security (RLS).

### 2.6 QR Code untuk Presensi Kehadiran

QR Code (Quick Response Code) adalah kode matriks dua dimensi yang dapat menyimpan data dalam jumlah besar dan dapat dibaca dengan cepat menggunakan kamera smartphone. QR Code telah banyak digunakan dalam berbagai aplikasi, termasuk sistem presensi kehadiran.

Dalam sistem absensi BEM Dashboard, QR Code digunakan sebagai token unik untuk setiap agenda kegiatan. Setiap agenda yang dibuat akan menghasilkan QR Code yang berisi informasi agenda. Anggota melakukan scan QR Code menggunakan kamera smartphone melalui aplikasi web, kemudian sistem memvalidasi kehadiran dan mencatat waktu presensi.

Penggunaan QR Code untuk absensi memiliki beberapa keunggulan: mengurangi kecurangan (tidak dapat dititipkan seperti tanda tangan), proses cepat dan efisien, serta data tercatat secara digital.

### 2.7 GPS dan Haversine Formula

Global Positioning System (GPS) adalah sistem navigasi berbasis satelit yang menyediakan informasi lokasi dan waktu. Dalam sistem absensi, GPS digunakan untuk memvalidasi bahwa pengguna berada di lokasi kegiatan saat melakukan presensi.

Formula Haversine digunakan untuk menghitung jarak antara dua titik koordinat geografis (lintang dan bujur). Formula ini dinyatakan sebagai:

```
a = sin²(Δlat/2) + cos(lat1) · cos(lat2) · sin²(Δlon/2)
c = 2 · atan2(√a, √(1-a))
d = R · c
```

Dimana R adalah jari-jari bumi (rata-rata 6371 km), Δlat dan Δlon adalah selisih lintang dan bujur dalam radian, dan d adalah jarak antara kedua titik.

Dalam sistem ini, jarak antara lokasi pengguna dan lokasi kampus (titik koordinat yang telah ditentukan) dihitung menggunakan formula Haversine. Jika jarak berada dalam radius yang diizinkan (default 100 meter), maka presensi dinyatakan valid.

### 2.8 Kecerdasan Buatan dalam Pengecekan Proposal

Kecerdasan Buatan (Artificial Intelligence/AI) telah banyak diterapkan dalam berbagai bidang, termasuk dalam analisis dokumen dan teks. Large Language Models (LLM) seperti Llama 3.3 70B yang dikembangkan oleh Meta mampu memahami, menganalisis, dan menghasilkan teks dengan kualitas tinggi.

Dalam sistem BEM Dashboard, AI digunakan untuk dua fungsi utama:

1. **Pengecekan Proposal**: Pengguna mengunggah proposal kegiatan, kemudian sistem mengekstrak teks dari file PDF atau DOCX dan mengirimkannya bersama pedoman proposal ke API Groq yang menjalankan model Llama 3.3 70B. AI kemudian menganalisis kesesuaian proposal dengan pedoman dan mengembalikan daftar isu atau kesalahan yang ditemukan.

2. **Chatbot Asisten Virtual**: Anggota dapat bertanya seputar informasi organisasi melalui chatbot. Sistem membangun konteks dari data anggota kabinet, program kerja, dan jadwal rapat, kemudian mengirimkan pertanyaan bersama konteks ke AI untuk mendapatkan jawaban yang relevan dalam Bahasa Indonesia.

### 2.9 Penelitian Terdahulu

Beberapa penelitian terkait yang menjadi acuan dalam pengembangan sistem ini antara lain:

1. Penelitian oleh Pratama dkk. (2022) tentang "Sistem Informasi Manajemen Organisasi Kemahasiswaan Berbasis Web Menggunakan Framework Laravel" yang membahas pengembangan sistem informasi untuk organisasi kemahasiswaan dengan fitur manajemen anggota dan kegiatan.

2. Penelitian oleh Saputra dan Wijaya (2023) tentang "Implementasi QR Code dan Geolokasi pada Sistem Presensi Kegiatan Mahasiswa" yang menerapkan QR Code dan validasi GPS untuk presensi kegiatan kemahasiswaan.

3. Penelitian oleh Hidayat dkk. (2024) tentang "Pemanfaatan Large Language Model untuk Otomatisasi Pengecekan Dokumen Proposal" yang mengeksplorasi penggunaan AI dalam analisis dokumen proposal.

Perbedaan penelitian ini dengan penelitian sebelumnya terletak pada integrasi seluruh modul (manajemen anggota, agenda, absensi QR+GPS, AI proposal check, chatbot) dalam satu sistem yang terpadu.

---

## BAB III
## METODOLOGI PENELITIAN

### 3.1 Metode Penelitian

Penelitian ini menggunakan metode Research and Development (R&D) yang berfokus pada pengembangan dan pengujian produk perangkat lunak. Model pengembangan yang digunakan adalah model waterfall yang dimodifikasi dengan tahapan analisis kebutuhan, perancangan, implementasi, pengujian, dan pemeliharaan.

Pendekatan pengembangan perangkat lunak menggunakan arsitektur Controller-Service-Repository (CSR) pada sisi backend dan arsitektur komponen pada sisi frontend. Pola arsitektur ini memisahkan logika bisnis (Service), akses data (Repository), dan kontrol request (Controller) untuk memudahkan pengujian dan pemeliharaan kode.

### 3.2 Tahapan Penelitian

Tahapan penelitian dilakukan melalui langkah-langkah sebagai berikut:

1. **Studi Literatur**: Mempelajari konsep Sistem Informasi Manajemen, teknologi web development (Laravel, React.js, PostgreSQL), QR Code, formula Haversine, dan kecerdasan buatan dari berbagai sumber seperti buku, jurnal, dan dokumentasi resmi.

2. **Analisis Kebutuhan**: Melakukan observasi dan wawancara dengan pengurus BEM untuk mengidentifikasi kebutuhan sistem, termasuk kebutuhan fungsional dan non-fungsional.

3. **Perancangan Sistem**: Merancang arsitektur sistem, basis data, antarmuka pengguna, dan alur kerja sistem menggunakan diagram UML (Use Case Diagram, Activity Diagram, Sequence Diagram) dan ERD.

4. **Implementasi**: Menulis kode program untuk backend (Laravel 13) dan frontend (React 19) berdasarkan perancangan yang telah dibuat.

5. **Pengujian**: Melakukan pengujian fungsional untuk memastikan setiap modul berfungsi sesuai dengan yang diharapkan.

6. **Evaluasi**: Menganalisis hasil pengujian dan melakukan perbaikan jika diperlukan.

```
                    ┌──────────────┐
                    │ Studi       │
                    │ Literatur   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Analisis    │
                    │ Kebutuhan   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Perancangan │
                    │ Sistem      │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Implementasi│
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Pengujian   │
                    │ Sistem      │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Evaluasi &  │
                    │ Pemeliharaan│
                    └──────────────┘
```

Gambar 3.1 Tahapan Penelitian

### 3.3 Teknik Pengumpulan Data

Teknik pengumpulan data yang digunakan dalam penelitian ini meliputi:

1. **Observasi**: Melakukan pengamatan langsung terhadap proses bisnis organisasi BEM Kabinet Nawasena, termasuk mekanisme absensi, pengajuan proposal, dan pengelolaan data anggota.

2. **Wawancara**: Melakukan wawancara dengan pengurus inti BEM untuk menggali kebutuhan sistem dan kendala yang dihadapi dalam pengelolaan organisasi.

3. **Studi Dokumentasi**: Mempelajari dokumen organisasi seperti pedoman penulisan proposal, struktur organisasi, dan program kerja.

4. **Studi Literatur**: Mengumpulkan referensi dari jurnal, buku, dan dokumentasi teknologi yang relevan dengan penelitian.

### 3.4 Alat dan Bahan Penelitian

Tabel 3.1 Alat dan Bahan Penelitian

| Kategori | Alat/Bahan | Spesifikasi |
|----------|-------------|-------------|
| Perangkat Keras | Laptop | Prosesor minimal Intel Core i5, RAM 8GB, SSD 256GB |
| Perangkat Keras | Smartphone | Android/iOS dengan kamera dan GPS |
| Perangkat Lunak | Sistem Operasi | macOS / Windows / Linux |
| Perangkat Lunak | Text Editor | Visual Studio Code |
| Perangkat Lunak | Version Control | Git + GitHub |
| Perangkat Lunak | Backend Framework | Laravel 13, PHP 8.3 |
| Perangkat Lunak | Frontend Framework | React 19, Vite 8 |
| Perangkat Lunak | Database | PostgreSQL (Supabase) |
| Perangkat Lunak | API Testing | Postman |
| Bahan | Groq API | Model Llama 3.3 70B |
| Bahan | Supabase | Project dengan PostgreSQL |

### 3.5 Arsitektur Sistem

Arsitektur sistem BEM Dashboard menggunakan pola client-server dengan pemisahan frontend dan backend. Frontend merupakan Single Page Application (SPA) yang dibangun dengan React 19 dan Vite, sedangkan backend merupakan RESTful API yang dibangun dengan Laravel 13. Komunikasi antara frontend dan backend dilakukan melalui protokol HTTP dengan format data JSON.

```
┌─────────────────────┐      HTTP/JSON      ┌──────────────────────┐
│   Frontend          │ ◄──────────────────► │   Backend            │
│   React 19 + Vite   │                      │   Laravel 13 API     │
│   Tailwind CSS v4   │    ───────────►      │   PHP 8.3            │
│   localhost:5173    │                      │   localhost:8000     │
└─────────────────────┘                      └─────────┬────────────┘
                                                       │
                                                       ↓
                                               ┌──────────────────────┐
                                               │   Database           │
                                               │   PostgreSQL         │
                                               │   (Supabase)         │
                                               └──────────────────────┘
                                                       │
                                                       ↓
                                               ┌──────────────────────┐
                                               │   External API       │
                                               │   Groq AI            │
                                               │   (Llama 3.3 70B)    │
                                               └──────────────────────┘
```

Gambar 3.2 Arsitektur Sistem

Backend mengikuti pola arsitektur Controller-Service-Repository:
- **Controller**: Menangani request HTTP, validasi input, dan mengembalikan response.
- **Service**: Berisi logika bisnis aplikasi.
- **Repository**: Mengelola interaksi dengan basis data melalui Eloquent ORM.

### 3.6 Diagram Alir Sistem (Flowchart)

Alur kerja sistem secara umum dapat digambarkan sebagai berikut:

1. Pengguna membuka aplikasi dan diarahkan ke halaman login.
2. Pengguna melakukan autentikasi dengan email dan password.
3. Sistem memverifikasi kredensial dan mengembalikan token akses.
4. Pengguna diarahkan ke dashboard sesuai dengan role-nya.
5. Pengguna dapat mengakses modul-modul yang tersedia sesuai hak akses.

```
       ┌─────────────┐
       │    Start    │
       └──────┬──────┘
              ↓
       ┌─────────────┐
       │  Halaman    │
       │   Login     │
       └──────┬──────┘
              ↓
       ┌─────────────┐      Tidak
       │  Validasi   │ ──────────► ┌─────────────┐
       │ Kredensial  │             │  Pesan      │
       └──────┬──────┘             │  Error      │
              │ Ya                 └─────────────┘
              ↓
       ┌─────────────┐
       │   Dashboard │
       └──────┬──────┘
              ↓
       ┌─────────────┐
       │   Pilih     │
       │   Modul     │
       └──────┬──────┘
              ↓
       ┌─────────────┐
       │  Kelola     │
       │  Data       │
       └──────┬──────┘
              ↓
       ┌─────────────┐
       │   Logout    │
       └──────┬──────┘
              ↓
       ┌─────────────┐
       │    End      │
       └─────────────┘
```

Gambar 3.3 Flowchart Sistem

### 3.7 Entity Relationship Diagram (ERD)

Entity Relationship Diagram (ERD) sistem BEM Dashboard menggambarkan hubungan antar tabel dalam basis data. Tabel-tabel utama yang digunakan meliputi:

1. **users**: Menyimpan data pengguna sistem (admin dan anggota).
2. **kabinets**: Menyimpan data anggota kabinet.
3. **program_kerjas**: Menyimpan data program kerja setiap kementerian.
4. **jadwal_rapats**: Menyimpan data agenda dan jadwal rapat.
5. **attendances**: Menyimpan data presensi kehadiran.
6. **laporans**: Menyimpan data laporan kegiatan.
7. **proposal_guidelines**: Menyimpan pedoman penulisan proposal.
8. **proposal_checks**: Menyimpan hasil pengecekan proposal.
9. **activity_logs**: Menyimpan log aktivitas pengguna.
10. **settings**: Menyimpan pengaturan aplikasi.

Relasi antar tabel:
- users memiliki relasi one-to-many dengan activity_logs.
- kabinets memiliki relasi one-to-many dengan attendances melalui user_id.
- jadwal_rapats memiliki relasi one-to-many dengan attendances.
- proposal_guidelines memiliki relasi one-to-many dengan proposal_checks.

Gambar 3.4 Entity Relationship Diagram (lihat lampiran ERD.md untuk detail lengkap)

---

## BAB IV
## HASIL DAN PEMBAHASAN

### 4.1 Gambaran Umum Sistem

Sistem Informasi Manajemen BEM Dashboard yang telah dikembangkan merupakan aplikasi web berbasis Single Page Application (SPA) yang menyediakan 13 modul utama: Autentikasi, Dashboard, Manajemen Anggota Kabinet, Manajemen Agenda, Sistem Absensi, Pengecekan Proposal, Review Proposal, Tanda Tangan Digital, Chatbot AI, Manajemen Laporan, Import Data Excel, Manajemen Pengaturan, dan Activity Log.

Sistem ini dibangun dengan arsitektur client-server dimana frontend React 19 berkomunikasi dengan backend Laravel 13 melalui REST API. Autentikasi menggunakan Laravel Sanctum dengan token-based authentication. Basis data menggunakan PostgreSQL pada platform Supabase yang menyediakan fitur real-time dan penyimpanan file.

### 4.2 Implementasi Sistem

#### 4.2.1 Autentikasi dan Manajemen Pengguna

Sistem autentikasi dibangun menggunakan Laravel Sanctum yang menyediakan mekanisme token-based authentication. Proses autentikasi meliputi registrasi, login, logout, dan manajemen profil.

**Registrasi**: Pengguna baru mendaftar dengan mengisi nama, NIM, email, password, divisi, dan jabatan. Data pengguna disimpan dalam tabel `users` dengan status default "aktif".

**Login**: Pengguna melakukan login dengan email dan password. Sistem memverifikasi kredensial dan memeriksa status akun (aktif/nonaktif/pending). Jika valid, sistem mengembalikan token Sanctum yang disimpan di localStorage frontend sebagai `bem_token`.

**Manajemen Profil**: Pengguna yang telah login dapat memperbarui profil (nama, email, NIM, divisi, jabatan) dan mengubah password.

**Keamanan**: Token akses dikirimkan melalui header `Authorization: Bearer <token>` pada setiap request. Token dapat di-revoke melalui proses logout. Frontend secara otomatis mengarahkan pengguna ke halaman login jika menerima response HTTP 401.

#### 4.2.2 Dashboard

Halaman dashboard merupakan halaman utama setelah login yang menampilkan ringkasan statistik organisasi, meliputi:

- **Total Anggota**: Jumlah seluruh anggota kabinet yang terdaftar.
- **Total Agenda**: Jumlah agenda yang telah dan akan dilaksanakan.
- **Presensi Hari Ini**: Jumlah dan persentase kehadiran pada hari tersebut.
- **Chart Bulanan**: Grafik tren kehadiran per bulan (menggunakan Recharts).
- **Distribusi Divisi**: Diagram pie sebaran anggota per divisi.
- **Agenda Mendatang**: 5 agenda terdekat yang akan dilaksanakan.
- **Aktivitas Terbaru**: Log aktivitas terbaru pengguna.
- **Anggota Terbaru**: Daftar anggota yang baru ditambahkan.

Dashboard diimplementasikan dengan endpoint `/api/dashboard/stats` yang mengagregasi data dari berbagai tabel menggunakan DashboardService.

#### 4.2.3 Manajemen Anggota Kabinet

Modul manajemen anggota kabinet menyediakan fungsi CRUD (Create, Read, Update, Delete) untuk data anggota. Fitur-fitur yang tersedia meliputi:

- **Daftar Anggota**: Menampilkan seluruh anggota dalam tabel dengan informasi NIM, nama, prodi, divisi, jabatan, dan foto.
- **Tambah Anggota**: Menambahkan anggota baru dengan data lengkap.
- **Edit Anggota**: Memperbarui data anggota yang sudah ada.
- **Hapus Anggota**: Menghapus data anggota dari sistem.
- **Aktif/Nonaktif**: Mengubah status anggota (aktif/nonaktif).

Setiap perubahan data anggota dicatat dalam activity_logs untuk keperluan audit. Implementasi menggunakan KabinetApiController dengan KabinetService dan KabinetRepository.

#### 4.2.4 Manajemen Agenda

Modul manajemen agenda mengelola jadwal kegiatan dan rapat BEM. Fitur-fitur yang tersedia meliputi:

- **Daftar Agenda**: Menampilkan seluruh agenda dengan informasi agenda, lingkup, tanggal, waktu, tempat, pemimpin, dan status QR.
- **Tambah Agenda**: Membuat agenda baru dengan data lengkap.
- **Edit Agenda**: Memperbarui data agenda.
- **Hapus Agenda**: Menghapus agenda dari sistem.
- **Generate QR Code**: Setiap agenda yang dibuat secara otomatis menghasilkan QR Code unik yang disimpan sebagai gambar.
- **Toggle QR**: Mengaktifkan atau menonaktifkan QR Code untuk agenda tertentu.

QR Code di-generate menggunakan library simplesoftwareio/simple-qrcode pada backend dan disimpan di penyimpanan lokal. Setiap agenda memiliki token unik (`qr_token`) yang digunakan sebagai payload QR Code.

#### 4.2.5 Sistem Absensi dengan QR Code dan GPS

Sistem absensi merupakan fitur utama yang mengintegrasikan QR Code dan validasi GPS menggunakan formula Haversine. Alur kerja absensi adalah sebagai berikut:

1. **Persiapan**: Admin/anggota membuka halaman absensi pada perangkat smartphone.
2. **Scan QR Code**: Kamera smartphone digunakan untuk memindai QR Code yang ditampilkan pada agenda.
3. **Validasi QR**: Sistem memvalidasi token QR Code yang di-scan dengan data agenda di basis data.
4. **Validasi GPS**: Sistem mengambil koordinat GPS pengguna melalui browser API dan menghitung jarak ke lokasi kampus menggunakan formula Haversine.
5. **Pengecekan Duplikasi**: Sistem memeriksa apakah pengguna sudah melakukan presensi untuk agenda yang sama.
6. **Pencatatan**: Jika semua validasi lolos, sistem mencatat kehadiran dengan data agenda, pengguna, waktu check-in, koordinat GPS, jarak, dan metode verifikasi.

**Implementasi Formula Haversine**:

```php
class GPSService
{
    public function haversine($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // meter
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon/2) * sin($dLon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        return $earthRadius * $c;
    }

    public function isWithinRadius($userLat, $userLon, $radius = 100)
    {
        $campusLat = -6.8564;
        $campusLon = 107.5889;
        $distance = $this->haversine($userLat, $userLon, $campusLat, $campusLon);
        return $distance <= $radius;
    }
}
```

Nilai radius dan koordinat kampus dapat dikonfigurasi melalui modul Pengaturan. Secara default, radius validasi adalah 100 meter dari titik koordinat Universitas Nusa Putra (-6.8564, 107.5889).

#### 4.2.6 Pengecekan Proposal Berbasis AI

Modul pengecekan proposal mengintegrasikan kecerdasan buatan melalui API Groq dengan model Llama 3.3 70B untuk menganalisis proposal kegiatan secara otomatis. Alur kerja pengecekan proposal adalah sebagai berikut:

1. **Upload Pedoman**: Admin mengunggah dokumen pedoman penulisan proposal (format PDF/DOCX).
2. **Parsing Teks**: Sistem mengekstrak teks dari dokumen pedoman menggunakan library smalot/pdfparser (untuk PDF) dan phpoffice/phpword (untuk DOCX).
3. **Upload Proposal**: Anggota mengunggah proposal kegiatan yang akan diperiksa.
4. **AI Check**: Sistem mengirimkan konten proposal dan pedoman ke API Groq dengan prompt khusus yang meminta AI untuk menganalisis kesesuaian proposal dengan pedoman dan mengembalikan daftar isu dalam format JSON.
5. **Hasil Check**: Sistem menyimpan hasil pengecekan dengan status "lulus_ai" atau "fail" dan daftar isu yang ditemukan.
6. **Review Admin**: Admin dapat meninjau hasil AI dan memberikan catatan, kemudian menyetujui (approve) atau menolak (reject) proposal.
7. **Tanda Tangan Digital**: Jika proposal disetujui, Presiden Mahasiswa (Presma) dapat menandatangani proposal secara digital melalui fitur signature canvas pada frontend.
8. **Generate PDF**: Sistem menghasilkan dokumen Surat Pengesahan dalam format PDF menggunakan library DomPDF yang memuat tanda tangan digital dan hasil pengecekan.

#### 4.2.7 Chatbot Asisten Virtual

Chatbot asisten virtual dibangun menggunakan API Groq dengan model Llama 3.3 70B yang dikonfigurasi sebagai asisten organisasi BEM dalam Bahasa Indonesia. Fitur chatbot meliputi:

- **Tanya Jawab**: Anggota dapat mengajukan pertanyaan seputar organisasi, seperti daftar anggota, program kerja, jadwal rapat, dan informasi lainnya.
- **Context Building**: Sistem membangun konteks dari database yang mencakup data anggota kabinet, program kerja, dan jadwal rapat, kemudian mengirimkannya bersama pertanyaan ke AI.
- **Import Data**: Admin dapat mengimpor data dari Excel untuk memperkaya konteks chatbot.

**System Prompt** yang digunakan:

```
Anda adalah asisten virtual untuk BEM (Badan Eksekutif Mahasiswa) Kabinet Nawasena Universitas Nusa Putra. Jawab pertanyaan dengan ramah dan informatif dalam Bahasa Indonesia. Gunakan data berikut untuk menjawab pertanyaan: [context]
```

#### 4.2.8 Manajemen Laporan

Modul manajemen laporan menyediakan fungsi CRUD untuk berbagai jenis laporan organisasi, termasuk laporan bulanan, laporan kegiatan, laporan keuangan, proposal, dan laporan evaluasi.

Fitur-fitur yang tersedia:
- Upload file laporan dalam format PDF, DOC, DOCX, XLS, XLSX.
- Tracking informasi file (tipe, ukuran, tanggal upload).
- Download file laporan.
- Filter berdasarkan tipe laporan dan status.

Setiap laporan dikaitkan dengan pengguna yang mengupload dan dilengkapi metadata seperti judul, deskripsi, dan tanggal.

#### 4.2.9 Import Data Excel

Modul import data Excel memungkinkan admin untuk mengimpor data dalam jumlah besar menggunakan file Excel dengan format multi-sheet:

- **Sheet 1 - Kabinet**: Data anggota kabinet (NIM, nama, prodi, divisi, jabatan, angkatan).
- **Sheet 2 - Program Kerja**: Data program kerja per kementerian.
- **Sheet 3 - Jadwal Rapat**: Data jadwal dan agenda.

Import menggunakan library maatwebsite/excel (Laravel Excel) dengan validasi data dan logging untuk setiap operasi.

#### 4.2.10 Role-Based Access Control

Sistem kontrol akses dibangun menggunakan Spatie Laravel Permission dan Laravel Sanctum. Terdapat dua role utama:

1. **Admin**: Memiliki akses penuh ke seluruh modul, termasuk manajemen anggota, agenda, absensi, review proposal, import data, dan pengaturan.
2. **Anggota**: Memiliki akses terbatas, meliputi dashboard, melihat agenda, melakukan absensi, mengajukan proposal, chatbot, dan laporan.

Pembatasan akses diterapkan melalui middleware pada route dan pengecekan role di dalam controller/service.

### 4.3 Tampilan Antarmuka Sistem

Antarmuka pengguna sistem BEM Dashboard dirancang dengan tema warna burgundy (#7A1F2B) dan cream yang mencerminkan identitas Kabinet Nawasena. Layout terdiri dari sidebar navigasi di sebelah kiri dan konten utama di sebelah kanan.

**Halaman Login** (Gambar 4.1): Menampilkan form login dengan input email dan password, serta tautan registrasi untuk pengguna baru.

**Halaman Dashboard** (Gambar 4.2): Menampilkan ringkasan statistik dalam bentuk card, grafik, dan tabel.

**Halaman Manajemen Anggota** (Gambar 4.3): Menampilkan tabel daftar anggota dengan fitur pencarian, filter, dan tombol aksi.

**Halaman Agenda dan QR Code** (Gambar 4.4): Menampilkan daftar agenda dengan QR Code yang dapat di-scan.

**Halaman Absensi** (Gambar 4.5): Menampilan kamera untuk scan QR Code, validasi GPS, dan histori absensi.

**Halaman Pengecekan Proposal** (Gambar 4.6): Menampilkan form upload proposal, hasil pengecekan AI, review admin, dan tanda tangan digital.

**Halaman Chatbot** (Gambar 4.7): Menampilkan antarmuka chat interaktif dengan asisten virtual.

### 4.4 Pengujian Sistem

Pengujian sistem dilakukan menggunakan metode black-box testing untuk memverifikasi fungsionalitas setiap modul. Pengujian mencakup:

Tabel 4.1 Hasil Pengujian Fungsional Sistem

| No | Modul | Skenario Uji | Hasil |
|----|-------|--------------|-------|
| 1 | Autentikasi | Registrasi, login, logout, update profil | ✓ Berhasil |
| 2 | Dashboard | Menampilkan statistik, chart, aktivitas | ✓ Berhasil |
| 3 | Anggota | CRUD anggota, toggle status | ✓ Berhasil |
| 4 | Agenda | CRUD agenda, generate QR, toggle QR | ✓ Berhasil |
| 5 | Absensi | Scan QR, validasi GPS, cek duplikasi | ✓ Berhasil |
| 6 | Proposal | Upload pedoman, AI check, review, sign | ✓ Berhasil |
| 7 | Chatbot | Tanya jawab dengan AI | ✓ Berhasil |
| 8 | Laporan | CRUD laporan, upload/download file | ✓ Berhasil |
| 9 | Import | Import Excel multi-sheet | ✓ Berhasil |
| 10 | RBAC | Pembatasan akses admin vs anggota | ✓ Berhasil |

Seluruh modul berfungsi sesuai dengan spesifikasi yang direncanakan. Sistem berjalan dengan baik pada lingkungan pengembangan (localhost) dengan backend Laravel pada port 8000 dan frontend React pada port 5173.

---

## BAB V
## KESIMPULAN DAN SARAN

### 5.1 Kesimpulan

Berdasarkan hasil penelitian dan pengembangan Sistem Informasi Manajemen BEM Dashboard, dapat ditarik kesimpulan sebagai berikut:

1. Sistem Informasi Manajemen BEM Dashboard berhasil dibangun sebagai aplikasi web terintegrasi yang mencakup 13 modul fungsional menggunakan framework Laravel 13 sebagai backend API dan React 19 sebagai frontend SPA. Arsitektur Controller-Service-Repository berhasil diimplementasikan untuk memisahkan logika bisnis, akses data, dan kontrol, sehingga memudahkan pengembangan dan pemeliharaan sistem.

2. Sistem absensi berbasis QR Code dengan validasi GPS menggunakan formula Haversine berhasil diimplementasikan. Setiap agenda memiliki QR Code unik yang digunakan untuk presensi, dan validasi jarang menggunakan formula Haversine memastikan bahwa pengguna berada dalam radius 100 meter dari lokasi kampus saat melakukan presensi, sehingga meningkatkan akurasi dan mengurangi kecurangan.

3. Kecerdasan buatan melalui API Groq dengan model Llama 3.3 70B berhasil diintegrasikan untuk proses pengecekan proposal secara otomatis. AI mampu menganalisis kesesuaian proposal dengan pedoman yang telah ditetapkan dan mengembalikan daftar isu yang ditemukan, sehingga mempercepat proses review proposal.

4. Chatbot asisten virtual berbasis AI berhasil dikembangkan dan mampu menjawab pertanyaan seputar organisasi dengan memanfaatkan konteks dari data anggota kabinet, program kerja, dan jadwal rapat yang tersimpan dalam basis data.

5. Sistem Role-Based Access Control (RBAC) berhasil diterapkan dengan dua role utama (admin dan anggota) yang memiliki hak akses berbeda terhadap modul-modul dalam sistem, sehingga keamanan dan integritas data terjaga.

### 5.2 Saran

Untuk pengembangan sistem selanjutnya, beberapa saran yang dapat diberikan adalah sebagai berikut:

1. **Modul Keuangan**: Disarankan untuk menambahkan modul manajemen keuangan yang mencakup pencatatan anggaran, realisasi dana, dan laporan keuangan organisasi.

2. **Sistem Voting/Pemilihan**: Pengembangan modul pemilihan untuk proses voting dalam pemilihan ketua BEM atau pengambilan keputusan organisasi.

3. **Notifikasi Real-time**: Implementasi notifikasi push atau WebSocket untuk memberi tahu anggota tentang agenda terbaru, perubahan jadwal, atau pengumuman penting secara real-time.

4. **Aplikasi Mobile Native**: Pengembangan aplikasi mobile native (Android/iOS) untuk memudahkan akses terutama untuk fitur absensi QR Code yang memerlukan kamera.

5. **Integrasi Akademik**: Integrasi dengan sistem akademik universitas untuk memudahkan sinkronisasi data mahasiswa.

6. **Enhanced AI Features**: Pengembangan fitur AI yang lebih canggih seperti rekomendasi jadwal kegiatan otomatis, analisis sentimen evaluasi kegiatan, atau deteksi plagiarisme pada proposal.

7. **Deployment Production**: Melakukan deployment sistem ke server produksi dengan domain resmi dan SSL certificate untuk keamanan yang lebih baik.

---

## DAFTAR PUSTAKA

Banks, A., & Porcello, E. (2020). *Learning React: Modern Patterns for Developing React Apps* (2nd ed.). O'Reilly Media.

Hidayat, R., dkk. (2024). Pemanfaatan Large Language Model untuk Otomatisasi Pengecekan Dokumen Proposal. *Jurnal Teknologi Informasi*, 12(2), 145-158.

Laudon, K. C., & Laudon, J. P. (2020). *Management Information Systems: Managing the Digital Firm* (16th ed.). Pearson.

Permendikbud No. 3 Tahun 2020 tentang Standar Nasional Pendidikan Tinggi.

Pratama, A., dkk. (2022). Sistem Informasi Manajemen Organisasi Kemahasiswaan Berbasis Web Menggunakan Framework Laravel. *Jurnal Sistem Informasi*, 10(1), 55-68.

Saputra, D., & Wijaya, K. (2023). Implementasi QR Code dan Geolokasi pada Sistem Presensi Kegiatan Mahasiswa. *Jurnal Informatika*, 15(3), 210-225.

Stauffer, M. (2019). *Laravel: Up & Running: A Framework for Building Modern PHP Apps* (2nd ed.). O'Reilly Media.

Meta AI. (2024). Llama 3.3 Model Card. Meta Platforms Inc.

Supabase. (2024). Supabase Documentation: PostgreSQL Database, Authentication, and Storage. https://supabase.com/docs

Groq Inc. (2024). Groq API Documentation: Fast AI Inference. https://console.groq.com/docs
