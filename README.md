<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

# Perpusbidar

Sistem Perpustakaan Digital berbasis Laravel (backend) dan React + Vite (frontend) dengan fitur manajemen buku, peminjaman, pengembalian, rating, dan dashboard admin.

---

## Fitur Utama

-   Manajemen buku dan pengguna
-   Peminjaman & pengembalian buku
-   Persetujuan admin untuk peminjaman/pengembalian
-   Rating buku
-   Dashboard laporan
-   Autentikasi (register/login)

---

## Prasyarat

Pastikan sudah menginstall:

-   PHP >= 8.2
-   Composer
-   Node.js >= 18 & npm
-   MySQL/MariaDB/PostgreSQL (atau database lain yang didukung Laravel)

---

## Langkah Instalasi

### 1. Clone Repository

```bash
git clone <url-repo-anda>
cd Perpusbidar
```

### 2. Setup Backend (Laravel)

```bash
composer install
cp .env.example .env # Jika file .env.example tersedia, jika tidak buat manual dari .env
php artisan key:generate
```

-   Edit file `.env` sesuai konfigurasi database Anda:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=perpusbidar
    DB_USERNAME=root
    DB_PASSWORD= # sesuaikan
    ```

-   Jalankan migrasi dan seeder (opsional):

```bash
php artisan migrate --seed
```

### 3. Setup Frontend (React + Vite)

```bash
npm install
```

---

## Menjalankan Aplikasi (Development)

### Jalankan Backend Laravel

```bash
php artisan serve
```

### Jalankan Frontend (Vite)

```bash
npm run dev
```

Akses aplikasi di `http://localhost:8000` (atau port sesuai output artisan serve).

---

## Build untuk Produksi

```bash
npm run build
```

---

## Struktur Folder Penting

-   `app/` : Kode backend Laravel (Controller, Model, dsb)
-   `resources/js/` : Kode frontend React
-   `resources/css/` : Styling (Tailwind)
-   `routes/web.php` : Routing utama aplikasi
-   `database/migrations/` : Struktur database

---

## Troubleshooting

-   Jika ada error dependency, jalankan `composer install` dan `npm install` ulang.
-   Pastikan environment variable di `.env` sudah benar.
-   Untuk error frontend, pastikan Node.js versi terbaru.

---

## Lisensi

Aplikasi ini menggunakan lisensi MIT.

## 📚 Algoritma Collaborative Filtering (Rekomendasi Buku)

Algoritma Collaborative Filtering untuk rekomendasi buku dapat ditemukan di:

-   **File:** `app/Http/Controllers/BookController.php`
-   **Fungsi:** `getRecommendationsForUser($userId)`

Fungsi ini digunakan untuk menghasilkan rekomendasi buku berbasis riwayat peminjaman dan rating user lain yang mirip. Digunakan pada landing page untuk menampilkan rekomendasi personal.

Penjelasan singkat:

-   Mengambil buku yang pernah dipinjam/diberi rating oleh user.
-   Mencari user lain yang punya overlap buku dengan user ini.
-   Mengambil buku yang dipinjam/rating oleh user-user mirip, kecuali yang sudah pernah dipinjam/rating oleh user.
-   Mengurutkan rekomendasi berdasarkan jumlah peminjaman dan rating rata-rata.
-   Jika tidak ada rekomendasi, fallback ke buku dengan rating tertinggi.
