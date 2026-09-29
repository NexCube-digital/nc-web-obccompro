




Product Requirement Document (PRD)
Company Profile Website 
Onny Barber Center (OBC) 


Versi 1.0 • 10 September 2026
Status: Draft - Pending Final Confirmation
Referensi: https://www.airbnb.co.id/

1. Overview
Website company profile untuk OBC GROUP, menaungi Onny Barber Center (OBC) dan 8 kategori bisnis lain di bawah penamaan konsisten "OBC [Nama Kategori]" (OBC Sport Center, OBC Guest House, OBC Villa, OBC Penthouse, OBC Laundry, OBC Food Court, OBC Agrobisnis, OBC Coffee). 
2. Latar Belakang
PT. Onny Barber Center (OBC) memiliki perjalanan yang panjang dan bersejarah. Sejak Bandung mulai dikenal luas sebagai destinasi wisata di Indonesia pada era 1990-an, PT.Onny Barber Center (OBC) resmi berdiri pada 7 Mei 1999 di Jawa Barat, tepatnya di kota Bandung. Onny Barber Center (OBC) hadir sebagai perusahaan yang bergerak di bidang jasa, yang berdedikasi untuk memberikan layanan yang bermanfaat bagi masyarakat dan memenuhi kebutuhan publik secara luas. Selain itu PT.OBC juga mengelola sejumlah unit bisnis yang semakin memperluas layanan dan cakupan usaha perusahaan.
3. Tujuan
Membangun citra profesional & terpercaya untuk brand OBC.
Menyediakan informasi lengkap: layanan OBC, fasilitas olahraga, dan gedung multifungsi.
Menjadi entry point ke OBC Sport (booking online).
Memudahkan calon klien acara (wedding/gathering) untuk mengajukan penyewaan gedung.
4. Target Pengguna
Calon pelanggan OBC.
Calon tamu Guest House/Villa/Penthouse (wisatawan/pelancong).
Pelanggan Food Court, Coffee Shop.
Pembeli produk Agrobisnis.
Pelanggan Laundry.
Pengelola acara/EO yang mencari venue.
Komunitas olahraga yang ingin tahu fasilitas sebelum booking.
Mitra bisnis/sponsor.
5. Ruang Lingkup Fitur:
Halaman
Deskripsi
Home
Hero section, "Pilih Kategori Favorit" (grid 8 kategori bisnis OBC), highlight OBC & Sport Center, CTA ke booking OBC Sport
Tentang Kami
Sejarah, visi-misi OBC sebagai grup usaha
Layanan OBC
Daftar layanan, harga, galeri, jam operasional (konten mendalam)
OBC Sport Center
Daftar lapangan/ruangan, harga, membership, CTA ke sistem booking OBC Sport (konten mendalam, link ke web app terpisah)
Direktori Kategori Lain (7 halaman ringkas): OBC Guest House, OBC Villa, OBC Penthouse, OBC Laundry, OBC Food Court, OBC Agrobisnis, OBC Coffee
Masing-masing: deskripsi singkat, foto, lokasi (jika beda dari alamat utama), CTA "Chat via WhatsApp" untuk info lebih lanjut/reservasi manual. Tidak ada sistem booking online untuk kategori ini di fase awal.
Gedung Multifungsi / Event Space
Penjelasan Lapang F1 & F2 sebagai hall serbaguna (wedding, gathering), galeri, form pengajuan/kontak
Galeri
Foto/video fasilitas & kegiatan (lintas kategori)
Testimoni
Review pelanggan
Kontak & Lokasi
mendukung multi-lokasi — menampilkan peta/alamat berbeda untuk tiap kategori bisnis yang lokasinya terpisah (misal Villa/Guest House/Penthouse mungkin beda titik dari kompleks utama Sport Center dll di Jl. Rancabentang I No.12). Tiap halaman directory kategori juga menampilkan alamat spesifiknya sendiri (bukan cuma di halaman Kontak terpusat). 



6. Functional Requirements
Responsive (mobile-first, mayoritas traffic dari HP).
Integrasi tombol WhatsApp untuk pertanyaan cepat & pengajuan sewa gedung.
SEO basic (meta tag, sitemap) supaya mudah ditemukan di Google.
Link langsung ke OBC Sport untuk booking real-time.
Setiap halaman directory kategori minimal punya: 1 foto/logo, deskripsi 2-3 kalimat, tombol WhatsApp dengan pesan pre-filled sesuai kategori (misal "Halo, saya ingin tanya tentang OBC Villa").
CMS harus bisa handle 9 tipe konten berbeda (Home Compro, Sport Center, + 6 directory pages) — perlu dipastikan struktur CMS-nya fleksibel per kategori.
Multi-bahasa (ID/EN): seluruh konten utama (Home, Tentang Kami, Layanan, Fasilitas, Event Space) tersedia dalam Bahasa Indonesia dan Inggris, dengan language switcher di header. Bahasa default: Indonesia.
Multi-lokasi map: minimal tampilkan pin terpisah per kategori bisnis di halaman Kontak & Lokasi (Google Maps embed atau custom map), karena tidak semua unit berada di alamat yang sama.
Kontak WhatsApp seragam: semua 6 kategori directory (Guest House, Villa, Penthouse, Laundry, Food Court, Agrobisnis, Coffee) pakai satu nomor WA yang sama: 0888-6070-900, dengan pesan pre-filled berbeda sesuai kategori yang diklik (contoh: "Halo, saya ingin tanya tentang OBC Villa").
7. Non-Functional Requirements
Loading cepat (<3 detik di koneksi 4G).
Desain konsisten dengan brand identity OBC (logo, warna, tone).
Aman (HTTPS).



  8. Out of Scope
Sistem booking online untuk Guest House, Villa, Penthouse (fase depan, jika dibutuhkan).
Sistem order online untuk Food Court/Coffee/Agrobisnis (fase depan).
Sistem booking OBC online (masih walk-in/WA, sudah dicatat sebelumnya).
Halaman detail mendalam untuk 6 kategori non-utama (cukup directory ringkas di fase ini).
Membership
Roles & Maintenance (bagian baru, ditambahkan setelah section 4 Target Pengguna):
Role
Deskripsi
Admin OBC (Internal)
Bertanggung jawab update konten (teks, foto, harga, jadwal) via CMS setelah website live
Developer/Agency
Hanya untuk maintenance teknis (bug, hosting, fitur baru), bukan update konten harian

9. Metrik Sukses
Jumlah klik ke WhatsApp/CTA booking per bulan.
Jumlah pengajuan sewa gedung via form/WA.
Bounce rate & waktu kunjungan halaman fasilitas.
10. UseCase

11. FlowChart


10. Open Questions
Apakah perlu multi-bahasa (ID/EN)? → Terjawab: YA
Apakah OBC akan punya sistem booking juga, atau cukup walk-in/WA? → Terjawab: NEXT
Siapa yang akan maintain konten setelah launch? → Terjawab: OBC
Siapa PIC dari tim OBC yang akan dilatih menggunakan CMS? (perlu untuk rencana training/handover) → Terjawab: KARYAWAN
Apakah butuh training/dokumentasi cara pakai CMS setelah launch? → Terjawab: DIBUATKAN
Baru: Tolong siapkan daftar alamat lengkap untuk tiap kategori bisnis yang lokasinya berbeda dari Jl. Rancabentang I No.12 (Villa, Guest House, Penthouse, dll) — dibutuhkan untuk isi konten & pin peta. 


Unit Bisnis
Alamat
Jam Operasional (menurut gmaps)
OBC Guest House
Jl. Rancabentang I No. 3A, Ciumbuleuit, Bandung
Waktu check in: 14.00
Waktu check out: 12.00 
OBC Penthouse
Jl. Rancabentang I No. 3A, Ciumbuleuit, Bandung
Waktu check in: 14.00
Waktu check out: 12.00 
OBC Villa
Jl. Rancabentang I No. 10, Ciumbuleuit, Bandung
Tidak ada keterangan sepertinya sama dengan guest house (Waktu check in: 14.00
Waktu check out: 12.00 )
OBC Sport Center
Jl. Rancabentang I No. 12, Ciumbuleuit, Bandung
07.00 WIB - 00.00 WIB
OBC Laundry
Jl. Rancabentang I No. 12, Ciumbuleuit, Bandung
07.00 WIB - 20.00 WIB
OBC Coffee
Jl. Rancabentang I No. 12, Ciumbuleuit, Bandung
08.00 WIB - 22.00 WIB
OBC Food Court
Jl. Rancabentang I No. 12, Ciumbuleuit, Bandung
08.00 WIB - 20.00 WIB
OBC Agrobisnis
Jl. Tugulaksana, Lembang, Kabupaten Bandung Barat 
Tutup permanen di gmaps


