# Design System & Panduan Warna — Website OBC Group
**Onny Barber Center (OBC) Company Profile**

Dokumen ini merangkum identitas visual dan warna yang digunakan oleh website OBC Group. Nilai warna aktual dirujuk dari `src/index.css` dan implementasi komponen di `src/`; warna khusus komponen dicatat terpisah dari token global.

---

## 1. Brand Identity & Karakter Visual

- **Nama Brand**: O.B.C (Onny Barber Center / OBC Group)
- **Karakter Visual**: 
  - *Geometric, Rounded & Friendly* — Menghadirkan kesan ramah dan mudah diakses oleh komunitas serta pelanggan OBC.
  - *Structured, Clean & Professional* — Menyajikan informasi perusahaan, fasilitas, dan unit bisnis dengan jelas.
  - *Earthy, Sporty & Natural* — Hijau dan aksen lime memberi kesan alami, aktif, dan sesuai karakter OBC.
- **Elemen Identitas Logo**:
  - **Emblem dan wordmark**: Gunakan artwork logo dari `src/assets/logo/`; jangan mengganti warna artwork berdasarkan token UI.
  - **Sub-label**: Banner kapsul (*pill shape*) bertuliskan *"onny barber center"*.
- **Variasi Penggunaan Logo**:
  1. Gunakan variasi logo yang sudah tersedia di folder aset logo.
  2. Pastikan kontras artwork dengan latar; warna logo merupakan bagian dari aset, bukan token warna halaman.

---

## 2. Palet Warna yang Digunakan

### Token Global (`src/index.css`)

| Peran | Token | Nilai | Pemakaian |
| :--- | :--- | :---: | :--- |
| Teks utama | `--color-obc-charcoal` | `#343133` | Warna teks dasar pada layout publik. |
| Brand utama | `--color-obc-green` | `#004000` | Aksi utama, fokus, ikon, dan aksen brand. |
| Hover brand utama | `--color-obc-green-hover` | `#002D00` | Hover tombol/latar hijau. |
| Brand sekunder | `--color-obc-olive` | `#404F14` | Aksen olive dan kontrol sekunder. |
| Hover brand sekunder | `--color-obc-olive-hover` | `#323E10` | Hover olive. |
| Latar halaman | `--color-obc-ivory` | `#FFFFF7` | Latar dasar halaman. Beberapa halaman unit memakai ivory sedikit lebih hangat, `#FAFAF2`. |
| Surface | `--color-obc-white` | `#FFFFFF` | Latar komponen dan konten. |
| Aksen merah | `--color-obc-red` | `#BF0021` | Token brand tersedia; belum tampak sebagai aksen UI pada halaman saat ini. |
| Hover merah | `--color-obc-red-hover` | `#9E001B` | Token hover tersedia bersama token merah. |
| Latar lembut | `--color-obc-cream` | `#F0F0D4` | Latar pembeda lembut. |
| Teks sekunder | `--color-obc-muted` | `#6F6B6E` | Deskripsi dan teks sekunder. |
| Border global | `--color-obc-border` | `#E2DFD2` | Garis pembatas. |
| Surface hover | `--color-obc-hover-surface` | `#F4F4E6` | Latar hover lembut. |

### Aksen yang Tampak di Komponen

- **Lime utama UI**: `#CDF178` dipakai berulang untuk CTA, badge, ikon, hover link, dan aksen footer. `#C0E85A` muncul sebagai warna hover terkait.
- **Hijau gelap pendamping**: `#1F3320` dipakai untuk teks/ikon di atas lime; `#D4FF32`, `#C6F52A`, `#009D00`, `#0A730A`, `#008C00`, `#7FA52B`, `#237D23`, dan `#22C55E` muncul pada elemen atau gradient tertentu. Warna WhatsApp seperti `#22C55E` dan `#166534` bersifat khusus tombol WhatsApp.
- **Netral halaman dan unit bisnis**: hitam (`#000000`, `#111111`, `#222022`), abu teks (`#41493D`, `#6F6B6E`, `#4B5563`), latar lembut (`#F3F3F3`, `#F5F5F5`, `#FAFAF2`), dan border abu (`#E5E5E5`, `#E1E1E1`, `#E9E9E9`). Nilai lain yang hanya muncul pada satu komponen tetap bersifat lokal, bukan token global.
- **Warna non-brand**: banner promo menggunakan biru gelap `#0C2937`; jangan menganggapnya warna utama seluruh situs.

Warna di SVG ilustrasi, ikon, logo, dan aset pihak ketiga memiliki palet internal masing-masing. Nilai tersebut tidak menjadi token UI global.

---

## 3. Tipografi (Typography Guideline)

Kombinasi 2 jenis font resmi yang saling melengkapi:

### 3.1. Font Utama: Poppins
> *"Poppins punya bentuk yang geometric, rounded, dan friendly"*

- **Karakter**: Geometris, sudut membulat ramah, modern, mudah terbaca dari jauh.
- **Penerapan**:
  - Judul Halaman (H1, H2, H3)
  - Tombol Call-to-Action (CTA) & Tombol Navigasi
  - Badge & Tag Kategori (Futsal, Badminton, Biliard, Tenis Meja)
  - Angka nominal harga & diskon promosi
- **Bobot (Weights)**:
  - `Regular (400)`: Teks tombol sekunder
  - `Medium (500)`: Sub-heading & filter pill
  - `SemiBold (600)`: Judul card, label harga, status badge
  - `Bold (700)`: Headline hero, penekanan angka promo

### 3.2. Font Pendukung: Montserrat
> *"Lebih terasa structured, clean, dan professional"*

- **Karakter**: Tegas, proporsional, bersih, sangat stabil untuk tata letak data padat.
- **Penerapan**:
  - Paragraf isi (*body text*) & deskripsi fasilitas
  - Form label, placeholder, dan input text
  - Kalender, tabel slot jam operasional (07.00 - 24.00)
  - Detail rincian pembayaran DP 50% & Syarat Ketentuan (S&K)
- **Bobot (Weights)**:
  - `Regular (400)`: Teks paragraf, rincian biaya
  - `Medium (500)`: Label formulir, header tabel data
  - `SemiBold (600)`: Ringkasan total invoice, teks peringatan

### 3.3. Skala Tipografi (Type Scale)

| Elemen | Ukuran (Desktop / Mobile) | Line Height | Font Family & Weight | Tracking (Letter Spacing) |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `56px` / `36px` | `1.1` | Poppins Bold (700) | `-0.02em` |
| **H1 (Page Title)** | `40px` / `28px` | `1.2` | Poppins SemiBold (600) | `-0.01em` |
| **H2 (Section Heading)** | `30px` / `22px` | `1.25` | Poppins SemiBold (600) | Normal |
| **H3 (Card Title)** | `20px` / `18px` | `1.3` | Poppins Medium (500) | Normal |
| **Body Large (Intro)** | `18px` / `16px` | `1.6` | Montserrat Regular (400) | Normal |
| **Body Base (Regular)** | `15px` / `14px` | `1.6` | Montserrat Regular (400) | Normal |
| **Small / Caption** | `13px` / `12px` | `1.5` | Montserrat Medium (500) | `+0.01em` |
| **Kicker / Overline** | `11px` / `10px` | `1.2` | Poppins SemiBold (600) | `+0.12em` (Uppercase) |

---

## 4. Token Status yang Didefinisikan

Token status berikut tersedia di `src/index.css`, tetapi tidak berarti alur booking lapangan/event sudah menjadi bagian dari UI website saat ini:

| Token | Latar | Border | Catatan |
| :--- | :---: | :---: | :--- |
| `--color-obc-status-booked-*` | `#FDECEE` | `#F5C2C7` | Token status booked. |
| `--color-obc-status-locked-*` | `#EBEEDC` | `#C8D1A8` | Token status locked. |

Status dan warna transaksi lain yang tidak ada di token atau komponen saat ini tidak dicantumkan sebagai warna project.

---

## 5. Panduan Komponen UI (Component Guidelines)

### 5.1. Tombol (Buttons)
- **Primary Button**:
  - Normal: Hijau `#004000` atau lime `#CDF178`, mengikuti konteks komponen; teks menggunakan warna kontras.
  - Hover: Hijau `#002D00` atau lime lebih gelap `#C0E85A` sesuai implementasi.
- **Secondary / Accent Button**:
  - Olive `#404F14` hanya digunakan bila sesuai komponen; `#CDF178` adalah aksen sekunder yang lebih sering muncul.
- **Outline Button**:
  - Border dan teks mengikuti warna kontrol terkait, umumnya `#004000` atau `#1F3320`.
  - Hindari menetapkan merah sebagai warna aksi urgent global; token merah tersedia tetapi belum dipakai pada UI halaman.

### 5.2. Card Fasilitas (Facility Cards)
- Background: `#FFFFFF`
- Border: abu terang seperti `#E5E5E5`, `#E1E1E1`, atau `#E9E9E9` sesuai komponen.
- Border Radius: `16px`
- Shadow: gunakan bayangan ringan yang sudah diterapkan komponen.
- Padding: `24px`
- Badge/aksen: Lime `#CDF178` dengan teks `#000000` atau `#1F3320`, mengikuti komponen.

### 5.3. Formulir & Input
- Input Field: Background `#FFFFFF`, border abu terang (`#E5E5E5` atau `#ECECEC`), Font Montserrat Regular.
- Focus State: Border `#004000` dengan ring lime `#CDF178`.
- Label: Font Montserrat Medium, umumnya warna gelap (`#1F3320` atau `#000000`), 13px.

---

## 6. Snippet Token Aktif (`src/index.css`)

```css
@theme {
  --color-obc-charcoal: #343133;
  --color-obc-green: #004000;
  --color-obc-green-hover: #002d00;
  --color-obc-olive: #404f14;
  --color-obc-olive-hover: #323e10;
  --color-obc-ivory: #fffff7;
  --color-obc-white: #ffffff;
  --color-obc-red: #bf0021;
  --color-obc-red-hover: #9e001b;
  --color-obc-cream: #f0f0d4;
  --color-obc-muted: #6f6b6e;
  --color-obc-border: #e2dfd2;
  --color-obc-hover-surface: #f4f4e6;
  --color-obc-status-booked-bg: #fdecee;
  --color-obc-status-booked-border: #f5c2c7;
  --color-obc-status-locked-bg: #ebeedc;
  --color-obc-status-locked-border: #c8d1a8;
  --font-heading: "Poppins", sans-serif;
  --font-body: "Montserrat", sans-serif;
}
```

Nilai aksen lokal seperti `#CDF178` belum menjadi token di `@theme`; pertahankan konsistensi saat menggunakannya di komponen.

---

## 7. Checklist Penerapan Desain
- [x] Token global disamakan dengan `@theme` aktif di `src/index.css`.
- [x] Aksen lime `#CDF178` dan hijau gelap `#1F3320` dicatat berdasarkan pemakaian komponen.
- [x] Warna layout dasar (`#FFFFF7`), surface (`#FFFFFF`), teks, dan border dicatat sesuai source.
- [x] Pemetaan 2 jenis font: **Poppins** (Headings, buttons, badges) dan **Montserrat** (Body text, UI data, form).
- [x] Token status yang didefinisikan CSS dipisahkan dari warna UI yang aktif.
- [x] Warna satu-off komponen dan aset SVG tidak dipromosikan menjadi token global.

