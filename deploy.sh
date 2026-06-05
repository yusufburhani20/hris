#!/bin/bash

# Pastikan script berhenti jika terjadi error fatal
set -e

echo "=== MEMULAI DEPLOYMENT SISTEM HRIS ==="
date

# 1. Pindah ke folder root proyek (tempat script berada)
cd "$(dirname "$0")"
echo "Direktori saat ini: $(pwd)"

# 2. Posisikan Laravel dalam Mode Pemeliharaan (Maintenance Mode)
echo "Mengaktifkan maintenance mode..."
php artisan down || true

# 3. Ambil pembaruan kode terbaru dari GitHub
echo "Melakukan penarikan kode (git pull)..."
if [ ! -z "$GITHUB_USER" ] && [ ! -z "$GITHUB_TOKEN" ]; then
    echo "Menggunakan kredensial GitHub token untuk otentikasi..."
    # Dapatkan URL remote saat ini
    CURRENT_REMOTE=$(git remote get-url origin)
    # Ubah remote URL sementara dengan token
    git remote set-url origin "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/hris.git"
    git pull origin main
    # Kembalikan remote URL asli agar tidak menyimpan token di konfigurasi git server
    git remote set-url origin "https://github.com/${GITHUB_USER}/hris.git"
else
    echo "Menarik kode tanpa token (menggunakan SSH key / HTTPS publik)..."
    git pull origin main
fi

# 4. Instalasi dependensi PHP
echo "Menginstal dependensi Composer..."
composer install --no-dev --optimize-autoloader

# 5. Jalankan migrasi database
echo "Menjalankan migrasi database..."
php artisan migrate --force

# 6. Kompilasi Aset Frontend (jika NPM terpasang di server)
if command -v npm &> /dev/null
then
    echo "Mendeteksi Node.js/NPM..."
    echo "Menginstal dependensi Node..."
    npm install --legacy-peer-deps
    echo "Kompilasi aset frontend React (Vite)..."
    npm run build
else
    echo "⚠️ Peringatan: npm tidak ditemukan di server. Lewati build aset frontend. Pastikan berkas public/build sudah dikompilasi secara lokal dan di-push."
fi

# 7. Pembersihan & Pembuatan Ulang Cache Laravel
echo "Membersihkan dan memperbarui cache konfigurasi & rute..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 8. Matikan Mode Pemeliharaan
echo "Menonaktifkan maintenance mode (Aplikasi kembali online)..."
php artisan up

echo "✅ Pembaruan selesai dengan sukses pada $(date)!"
