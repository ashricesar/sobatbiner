# Sobat Biner

Website microlearning untuk mempelajari bilangan biner dan desimal.

Media Pembelajaran Interaktif Sistem Bilangan Biner

SobatBiner adalah website pembelajaran interaktif yang dirancang untuk membantu pengguna memahami sistem bilangan biner, sistem bilangan desimal, serta proses konversi antara keduanya.

Website dilengkapi dengan materi pembelajaran, latihan interaktif, kuis pemahaman, kalkulator konversi, animasi, sound effect, dan sistem penyimpanan progres belajar.
Lainnya:

- Video embed dari Canva.
- Ikon menggunakan Lucide CDN dan font menggunakan Google Fonts.

## PANDUAN SISTEM PROGRES (6 AKTIVITAS)

Membuka halaman atau video TIDAK menambah progres.

1. Unit 1: jawaban pertanyaan benar
   markSobatBinerActivity("unit1Question")
2. Unit 2: jawaban pertanyaan benar
   markSobatBinerActivity("unit2Question")
3. Unit 3: jawaban pertanyaan benar
   markSobatBinerActivity("unit3Question")
4. Unit 4: pengguna memasukkan angka dan menekan Konfirmasi dengan latihan berhasil
   markSobatBinerActivity("unit4Practice")
5. Unit 5: klik pertama pada salah satu kotak digit biner
   markSobatBinerActivity("unit5Practice")
6. Unit 6: setelah kelima soal kuis selesai
   markSobatBinerActivity("unit6Quiz")

Setiap aktivitas hanya dihitung satu kali. Fungsi tersedia secara global melalui js/progress.js. Pastikan file ini dimuat sebelum script unit yang memanggilnya.

## Tentang Pengembang

Alias @aicetsu, mencintai design dan pengembangan website. Website ini dikembangkan berdasarkan observasi di beberapa Sekolah Menempuh Pertama di Singaraja oleh pengembang pada saat menempuh kuliah semester akhir di Universitas Pendidikan Ganesha, Singaraja. 2026.
