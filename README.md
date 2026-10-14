# OBC Group Company Profile

Website company profile OBC Group, dibuat dengan React, TypeScript, dan Vite.

## Prasyarat

- Node.js 22.12 atau lebih baru
- npm (sudah disertakan bersama Node.js)
- Git

## Menjalankan di Lokal

1. Clone repository:

   ```bash
   git clone https://github.com/USERNAME/NAMA-REPOSITORY.git
   ```

2. Masuk ke folder proyek:

   ```bash
   cd NAMA-REPOSITORY
   ```

3. Install dependency sesuai `package-lock.json`:

   ```bash
   npm ci
   ```

4. Jalankan development server:

   ```bash
   npm run dev
   ```

5. Buka URL yang ditampilkan di terminal, biasanya `http://localhost:5173`.

Tekan `Ctrl+C` di terminal untuk menghentikan server.

## Perintah Tersedia

```bash
npm run dev      # Jalankan development server
npm run build    # Type-check dan buat build produksi di dist/
npm run preview  # Preview build produksi secara lokal
npm run lint     # Jalankan ESLint
```

Untuk melihat hasil build produksi, jalankan `npm run build`, lalu `npm run preview`.

## Environment

Salin `.env-example` menjadi `.env` bila ingin mengubah konfigurasi API. Saat
development, frontend mengakses backend langsung di
`http://localhost:3000/api/v1`; jalankan backend OBC dan izinkan origin frontend
di `CORS_ORIGINS`. Untuk deployment, set `VITE_API_BASE_URL` ke URL API yang
dapat dijangkau browser, termasuk prefix `/api/v1`.

## Teknologi

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router