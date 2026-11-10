# NAGASA LAUNDRY - WEBSITE SISTEM INFORMASI & PEMESANAN ONLINE

Website resmi dan sistem manajemen operasional **Nagasa Laundry** berbasis web modern, responsif, dan terintegrasi dengan Firebase (Authentication, Firestore, Storage, Hosting).

- **Nama Usaha:** Nagasa Laundry
- **Lokasi Toko:** Tanjung Harapan 1, Palu, Sulawesi Tengah
- **WhatsApp Resmi:** 082251267232 (+62 822-5126-7232)
- **Jam Operasional:** 08.00–16.30 WITA (Senin – Sabtu)
- **Warna Tema:** Biru dan Putih (#0D47A1, #1565C0, #0288D1, #FFFFFF)
- **Bahasa:** Indonesia

---

## 1. STRUKTUR FOLDER PROYEK

```text
nagasa-laundry/
│
├── index.html                   # Halaman Utama (Beranda, Promo, Layanan, Keunggulan, Jam Buka, Peta)
├── firebase.json                # Konfigurasi publikasi Firebase Hosting
├── firestore.rules              # Aturan keamanan database Firestore Security Rules
├── firestore.indexes.json       # Indeks komposit query Firestore
├── README.md                    # Dokumentasi lengkap dan panduan operasional
│
├── admin/                       # Panel Manajemen Administrasi & Kasir
│   ├── index.html               # Pengalihan (redirect) otomatis ke dashboard/login
│   ├── login.html               # Halaman masuk admin terautentikasi Firebase Auth
│   ├── dashboard.html           # Dashboard admin lengkap (KPI, Pesanan 9 Status, POS Kasir, CRUD Layanan, Pelanggan, Ongkir, Laporan CSV/PDF)
│   └── setup.html               # Asisten inisialisasi akun admin pertama & 1-klik Firestore Seeder
│
├── assets/                      # Aset Visual & Branding
│   ├── favicon.svg              # Favicon tab browser (ikon drum cuci, pakaian, gelembung)
│   └── images/
│       ├── logo-icon.svg        # Logo mark resmi (gelembung air, pakaian bersih, mesin cuci)
│       └── logo.svg             # Logo horizontal lengkap dengan tipografi Nagasa Laundry
│
├── css/
│   └── style.css                # CSS Design system modern, responsive mobile-first, animasi, & print layout
│
├── js/                          # Logika Modular Aplikasi
│   ├── firebase-config.js       # Konfigurasi dan inisialisasi Firebase SDK v10 (Auth, Firestore, Storage)
│   ├── data-service.js          # Layanan data Firestore (8 koleksi, CRUD, kalkulasi harga, query riwayat, seeder)
│   └── utils.js                 # Fungsi helper (format Rupiah, tanggal WITA, generator ID transaksi, WhatsApp links, toasts)
│
└── pages/                       # Halaman Sisi Pelanggan
    ├── layanan.html             # Katalog 6 layanan laundry (Cuci Kering, Setrika, Kiloan, Satuan, Express)
    ├── pesan.html               # Formulir pemesanan online real-time (kalkulator otomatis, antar-jemput, COD/Transfer/QRIS)
    ├── status.html              # Cek status pengerjaan (9 tahapan visual timeline, unggah bukti bayar)
    ├── riwayat.html             # Riwayat transaksi pelanggan terproteksi verifikasi keamanan 4-digit WA
    ├── nota.html                # Nota digital resmi siap cetak A4/struk kasir & kirim ke WhatsApp
    ├── qrcode.html              # Studio generator QR Code resmi Nagasa Laundry & standee meja toko
    └── kontak.html              # Informasi kontak, peta lokasi Tanjung Harapan 1 Palu, jam buka, dan FAQ
```

---

## 2. FITUR UTAMA SISTEM

### A. Fitur Pelanggan (Tanpa Perlu Buat Akun)
1. **Pemesanan Online Pintar:**
   - Formulir terstruktur: Nama, WhatsApp, Alamat Palu, Pilihan Layanan, Estimasi Berat (Kg) atau Qty (Pcs).
   - Opsi metode: **Antar-Jemput Kurir** vs **Antar Langsung ke Toko**.
   - Kalkulasi otomatis ongkos kirim berdasarkan jarak per km (tarif standar Rp 3.000/km, min. Rp 5.000, gratis ongkir di atas Rp 100.000).
   - Metode pembayaran: **Tunai (COD)**, **Transfer Bank (BCA, BRI, Mandiri)**, dan **QRIS**.
   - Notifikasi sukses instan dengan ID Transaksi unik (`NGS-YYYYMMDD-XXXX`).
   - Tombol kirim rincian pesanan langsung ke WhatsApp kasir toko.

2. **Cek Status Pengerjaan (9 Status Laundry):**
   - Pelanggan cukup memasukkan Kode Transaksi.
   - Timeline visual interaktif 9 status:
     1. Menunggu konfirmasi
     2. Pesanan diterima
     3. Sedang dicuci
     4. Sedang dikeringkan
     5. Sedang disetrika
     6. Siap diambil
     7. Sedang diantar
     8. Selesai
     9. Dibatalkan
   - Status pembayaran: *Belum Dibayar*, *Menunggu Verifikasi*, *Sudah Dibayar*.
   - Fitur **Unggah Bukti Transfer / Screenshot QRIS** langsung di halaman pelacakan bagi metode non-tunai.

3. **Riwayat Transaksi Pelanggan:**
   - Menggunakan verifikasi keamanan 4-digit nomor WhatsApp agar data privasi pelanggan tidak dapat diintip sembarang orang.
   - Menampilkan daftar histori pesanan, tanggal pengerjaan, dan statusnya.

4. **Nota Transaksi Digital:**
   - Format standar A4 / struk kasir profesional.
   - Memuat logo Nagasa Laundry, identitas toko, rincian bobot, ongkir, diskon, dan grand total.
   - Tombol **Cetak / Simpan PDF** (styling `@media print` rapi tanpa elemen navigasi).
   - Tombol **Kirim / Bagikan Nota via WhatsApp**.

5. **Sistem QR Code Toko:**
   - QR Code beresolusi tinggi dengan logo Nagasa Laundry di bagian tengah.
   - Menggunakan *Error Correction Level H (30%)* sehingga tetap mudah dipindai kamera smartphone.
   - Mode **Standee Meja Kasir / Banner Toko** siap cetak untuk ditempel di etalase toko Tanjung Harapan 1.

---

### B. Fitur Dashboard Admin & Kasir
1. **Dashboard Utama:**
   - Ringkasan KPI: Total Pesanan, Pesanan Hari Ini, Sedang Diproses, Pesanan Selesai, dan Total Pendapatan (Rp).
   - Grafik garis (Chart.js) tren pendapatan 7 hari terakhir.
   - Diagram donat distribusi status pengerjaan pesanan.
   - Tabel 10 transaksi terbaru.
2. **Manajemen Pesanan:**
   - Pencarian real-time berdasarkan kode transaksi, nama, atau nomor WA.
   - Filter berdasarkan 9 status pengerjaan dan 3 status pembayaran.
   - Modal kelola pesanan: pembaruan status pengerjaan dengan 1-klik + catatan khusus.
   - **Penyesuaian Harga Kasir:** admin dapat menyesuaikan berat riil hasil timbangan toko, tarif satuan, ongkir, dan diskon sebelum transaksi dikonfirmasi.
   - Verifikasi bukti pembayaran pelanggan.
   - Pembatalan transaksi aman dengan konfirmasi.
3. **Kasir POS (Point of Sale):**
   - Kasir dapat menginput pesanan walk-in (pelanggan yang datang langsung ke toko).
4. **Manajemen Layanan & Tarif (CRUD):**
   - Tambah layanan baru, ubah harga per kg/pcs, ubah ikon, deskripsi, dan badge.
   - Toggle aktif / nonaktif layanan agar tampil atau disembunyikan dari katalog pelanggan.
5. **Database Pelanggan:**
   - Riwayat akumulasi belanja dan frekuensi pemesanan pelanggan.
   - Tombol pintas chat WhatsApp ke pelanggan.
6. **Manajemen Antar-Jemput:**
   - Konfigurasi tarif per kilometer, tarif minimum, gratis ongkir, dan daftar area jangkauan Palu.
7. **Laporan Transaksi & Keuangan:**
   - Filter periode: Hari ini, 7 Hari terakhir, Bulan ini, atau Semua Waktu.
   - Total pendapatan dan jumlah transaksi periode terpilih.
   - **Ekspor ke format Excel (CSV)** yang kompatibel dengan Microsoft Excel & Google Sheets.
   - Cetak laporan PDF.

---

## 3. PANDUAN INSTALASI & PENGUJIAN LOKAL

### Langkah 1: Buka Folder Proyek
Pastikan seluruh file berada dalam folder `nagasa-laundry`.

### Langkah 2: Menjalankan Server Lokal
Karena aplikasi web menggunakan modular JavaScript (`import/export` ES Modules) dan Firebase Web SDK, buka folder ini menggunakan HTTP local server.

Contoh menggunakan Python (yang sudah terinstal di komputer):
```powershell
cd C:\Users\ADVAN\nagasa-laundry
py -m http.server 8080
```
Atau jika menggunakan VS Code:
- Klik kanan `index.html` -> pilih **Open with Live Server**.

### Langkah 3: Akses Website
- **Website Pelanggan:** [http://localhost:8080/](http://localhost:8080/)
- **Halaman Pemesanan:** [http://localhost:8080/pages/pesan.html](http://localhost:8080/pages/pesan.html)
- **Pelacakan Status:** [http://localhost:8080/pages/status.html](http://localhost:8080/pages/status.html)
- **Login Admin:** [http://localhost:8080/admin/login.html](http://localhost:8080/admin/login.html)
- **Setup Admin & Seeder:** [http://localhost:8080/admin/setup.html](http://localhost:8080/admin/setup.html)

> *Catatan Pengujian Awal (Offline/Demo Mode):*
> Website sudah dilengkapi fallback data penyimpanan lokal (`localStorage`). Anda dapat langsung menguji alur pemesanan, pengecekan status, dan login admin (`admin@nagasalaundry.com` / `admin123`) tanpa crash bahkan sebelum menghubungkan Firebase!

---

## 4. PANDUAN KONFIGURASI FIREBASE

Untuk menghubungkan website ke database Cloud Firestore permanen:

1. Buka [Firebase Console](https://console.firebase.google.com/) dan login dengan akun Google.
2. Klik **Add project** (Tambah Proyek), beri nama **`nagasa-laundry`**.
3. **Aktifkan Authentication:**
   - Masuk ke menu **Build** > **Authentication** > **Get Started**.
   - Pilih tab **Sign-in method** > klik **Email/Password** > aktifkan (Enable) > klik **Save**.
4. **Aktifkan Cloud Firestore Database:**
   - Masuk ke menu **Build** > **Firestore Database** > klik **Create Database**.
   - Pilih lokasi server terdekat (contoh: `asia-southeast2` Jakarta).
   - Pilih mode **Production** atau **Test mode**.
   - Buka tab **Rules**, salin isi berkas `firestore.rules` dari proyek ini, lalu klik **Publish**.
5. **Aktifkan Firebase Storage (Opsional, untuk foto bukti transfer):**
   - Masuk ke menu **Build** > **Storage** > klik **Get Started**.
6. **Daftarkan Web App:**
   - Klik ikon gerigi (Project Settings) di pojok kiri atas > tab **General**.
   - Gulir ke bagian *Your apps* > klik ikon Web (`</>`).
   - Beri nama aplikasi `Nagasa Laundry Web` > centang *Also set up Firebase Hosting*.
   - Salin objek `firebaseConfig`.
7. **Perbarui Konfigurasi di Proyek:**
   - Buka file `js/firebase-config.js`.
   - Ganti isi objek `firebaseConfig` dengan nilai dari Firebase Console Anda:
     ```javascript
     const firebaseConfig = {
       apiKey: "AIzaSy...",
       authDomain: "nagasa-laundry.firebaseapp.com",
       projectId: "nagasa-laundry",
       storageBucket: "nagasa-laundry.appspot.com",
       messagingSenderId: "123456789012",
       appId: "1:123456789012:web:abcdef123456"
     };
     ```
   - Simpan berkas.

---

## 5. PANDUAN MEMBUAT AKUN ADMIN PERTAMA

Sistem Nagasa Laundry melindungi database dengan memverifikasi bahwa akun login terdaftar di koleksi `admins` pada Firestore.

Cara termudah dan paling aman untuk membuat akun admin pertama:
1. Buka browser dan arahkan ke:
   `http://localhost:8080/admin/setup.html`
2. Pada bagian **2. Buat Akun Admin Pertama**:
   - Masukkan Email: `admin@nagasalaundry.com` (atau email pilihan Anda).
   - Masukkan Kata Sandi (minimal 6 karakter).
   - Masukkan Nama Admin: `Pemilik Nagasa Laundry`.
   - Klik tombol **Daftarkan Akun Admin ke Firebase**.
3. Pada bagian **3. Isi Data Awal Layanan & Toko (Firestore Seeder)**:
   - Klik tombol **1-Klik Isi Data Awal ke Firestore**.
   - Sistem akan otomatis membuat data bawaan layanan (Cuci Kering, Cuci Setrika, Setrika Saja, Kiloan, Satuan, Express) dan profil toko di Palu.
4. Klik **Ke Halaman Login Admin**, lalu masukkan email dan kata sandi yang baru saja dibuat. Anda akan langsung diarahkan ke Dashboard Admin!

---

## 6. PANDUAN DEPLOYMENT KE FIREBASE HOSTING

Agar website dapat diakses publik melalui domain resmi internet berprotokol HTTPS:

1. **Instal Firebase CLI** di komputer:
   ```powershell
   npm install -g firebase-tools
   ```
2. **Login ke akun Firebase:**
   ```powershell
   firebase login
   ```
3. **Inisialisasi Hosting di folder proyek:**
   ```powershell
   cd C:\Users\ADVAN\nagasa-laundry
   firebase use --add
   ```
   (Pilih proyek `nagasa-laundry` yang sudah dibuat di Firebase Console).
4. **Deploy Website dan Security Rules:**
   ```powershell
   firebase deploy
   ```
5. Setelah proses selesai, terminal akan menampilkan URL website online Anda, misalnya:
   `https://nagasa-laundry.web.app` atau `https://nagasa-laundry.firebaseapp.com`
6. Website siap dibuka oleh seluruh warga Palu melalui smartphone maupun komputer!

---

## 7. PANDUAN MEMBUAT DAN MENCETAK QR CODE

Sistem QR Code Nagasa Laundry dirancang khusus untuk mempermudah promosi offline toko fisik:

1. Buka halaman:
   `http://localhost:8080/pages/qrcode.html` (atau dari Dashboard Admin menu *QR Code Toko*).
2. URL target secara otomatis mendeteksi URL website Anda (misal `https://nagasa-laundry.web.app`).
3. Sistem secara otomatis menggambar QR Code dengan presisi tinggi dan menempatkan logo Nagasa Laundry di tengah.
4. **Pilihan Cetak & Unduh:**
   - **Unduh QR Code (PNG):** Simpan gambar logo QR resolusi tinggi untuk dicantumkan pada brosur, kartu nama, spanduk, atau feed Instagram.
   - **Cetak Standee Meja Toko:** Klik tombol *Cetak Standee Meja Toko* (atau tekan `Ctrl + P`). Desain akan otomatis diformat ke ukuran kartu display kasir berbingkai biru elegan dengan instruksi *"SCAN DI SINI UNTUK PESAN ONLINE"*.
   - Pasang standee di meja kasir toko Tanjung Harapan 1 agar pelanggan dapat langsung memesan antar-jemput kapan saja.

---

## 8. STRUKTUR DATABASE CLOUD FIRESTORE

| Koleksi (Collection) | Dokumen ID | Deskripsi Dokumen |
|---|---|---|
| `admins` | `UID` (dari Auth) | Data hak akses admin (`email`, `name`, `role: 'superadmin'`) |
| `customers` | `Nomor WA` | Data pelanggan (`name`, `phone`, `address`, `totalOrders`, `totalSpent`, `lastOrderAt`) |
| `services` | `serviceId` | Katalog layanan laundry (`name`, `code`, `price`, `priceType`, `icon`, `badge`, `isActive`, `order`) |
| `orders` | `NGS-YYYYMMDD-XXXX` | Data transaksi lengkap (`customerName`, `serviceName`, `weight`, `deliveryFee`, `grandTotal`, `status`, `paymentStatus`, `paymentProofUrl`, `history`) |
| `payments` | `NGS-YYYYMMDD-XXXX` | Riwayat pembayaran & tautan bukti transfer |
| `transactions` | `NGS-YYYYMMDD-XXXX` | Log pencatatan keuangan pendapatan |
| `pickup_deliveries` | `NGS-YYYYMMDD-XXXX` | Data pengiriman & penjemputan pakaian kurir di Palu |
| `settings` | `general` | Pengaturan usaha (`shopName`, `whatsapp`, `address`, `deliveryRatePerKm`, `minDeliveryFee`, `bankAccounts`) |

---

## 9. INFORMASI USAHA & LAYANAN PELANGGAN

- **Nama Usaha:** Nagasa Laundry
- **Alamat:** Tanjung Harapan 1, Palu, Sulawesi Tengah
- **WhatsApp Customer Service:** [082251267232](https://wa.me/6282251267232)
- **Jam Layanan:** 08.00–16.30 WITA (Senin – Sabtu)

*© 2024 Nagasa Laundry. Dikembangkan dengan standar profesional untuk masyarakat Palu dan sekitarnya.*
