# Panduan Skenario Presentasi Dewan Juri: GlagahSmart AIoT
**IDTC 2.0 – AIoT Future Competition 2026**

Dokumen ini disusun untuk memandu jalannya presentasi proyek di hadapan Dewan Juri sesuai skenario 11 langkah yang telah dirancang.

---

## Alur Presentasi 11 Langkah

### Langkah 1: Pengenalan Inovasi (Halaman Beranda `/`)
- **Tindakan:** Buka halaman beranda `http://localhost:3000`.
- **Narasi Utama:** 
  "GlagahSmart AIoT adalah inovasi berbasis riset yang berfokus pada ekonomi sirkular pemanfaatan residu bunga glagah (*Saccharum spontaneum*) di Pemalang dan Purbalingga. Fokus utama sistem adalah *Project Profiling* dan verifikasi ilmiah, bukan dashboard monitoring operasional semata."

### Langkah 2: Latar Belakang & Potensi Lapangan (`/background`)
- **Tindakan:** Arahkan ke menu **Latar Belakang**.
- **Narasi Utama:**
  "Tunjukkan keterkaitan hulu-hilir: Kabupaten Pemalang sebagai sentra budidaya dan pemanenan glagah liar, serta Kabupaten Purbalingga (Bojongsari/Karangreja) sebagai sentra industri sapu rayung tradisional. Tekankan pembedaan antara Fakta Terverifikasi, Hasil Observasi Lapangan, dan Hipotesis Riset."

### Langkah 3: Identifikasi Masalah & Rantai Pasok Sapu (`/problem`)
- **Tindakan:** Arahkan ke menu **Masalah**.
- **Narasi Utama:**
  "Jelaskan anatomi tanaman glagah: bagian mana yang menjadi komoditas sapu berkualitas ekspor, dan bagian mana yang menjadi residu (serbuk rontokan pemukulan dan spikelet rapuh). Tunjukkan 5 fokus permasalahan yang selama ini belum terpecahkan karena minimnya alat ukur objektif di tingkat pengrajin."

### Langkah 4: Tiga Alternatif Solusi Hilirisasi (`/solution`)
- **Tindakan:** Arahkan ke menu **Solusi Inovasi**.
- **Narasi Utama:**
  "Perkenalkan 3 jalur nilai tambah: 
  1. **Benih:** Bunga segar dengan viabilitas calon biji untuk perbanyakan mandiri.
  2. **Briket Biomassa:** Serbuk rontokan kering berkalori tinggi (SNI 01-6235-2000).
  3. **Pupuk Kompos:** Residu lembap kaya serat organik (SNI 19-7030-2004)."

### Langkah 5: Metodologi Penelitian 10 Tahap (`/research`)
- **Tindakan:** Arahkan ke menu **Metodologi**.
- **Narasi Utama:**
  "Tunjukkan transparansi status riset secara jujur (6 tahap Selesai, 3 tahap Berlangsung, 1 tahap Direncanakan). Tegaskan bahwa model ML berstatus *Synthetic Baseline* yang dikalibrasi aturan ilmiah SNI dan ISTA sebelum validasi laboratorium massal."

### Langkah 6: Masuk ke Simulasi IoT Wokwi (`/simulation`)
- **Tindakan:** Arahkan ke menu **Simulasi Wokwi**.
- **Narasi Utama:**
  "Jelaskan bahwa Wokwi digunakan khusus untuk simulasi akuisisi data sensor mikrokontroler ESP32, bukan menjalankan inferensi ML. Jelaskan perbedaan fisis krusial: Kelembapan Relatif Udara (% RH) dari DHT22 BUKAN Kadar Air Biomassa (% MC)."

### Langkah 7: Pengiriman Data Sensor Simulasi ke Backend
- **Tindakan:** Pada panel simulasi, pilih preset *"Residu Serbuk Rontokan Kering - Purbalingga"* atau gunakan slider manual, lalu klik tombol *"Kirimkan ke Backend ESP32"*.
- **Narasi Utama:**
  "Amati kartu buffer telemetri terkini yang diperbarui seketika melalui REST API FastAPI. Data terformat JSON persis seperti yang dikirimkan oleh firmware ESP32 nyata."

### Langkah 8: Meneruskan Data ke Demonstrasi Machine Learning
- **Tindakan:** Klik tombol besar berwarna hijau: *"Teruskan Data Sampel Ini ke Klasifikasi Machine Learning"*.
- **Narasi Utama:**
  "Sistem memindahkan parameter sensor secara instan ke formulir klasifikasi hibrida di halaman `/classification`."

### Langkah 9: Melengkapi Parameter Laboratorium Manual
- **Tindakan:** Tunjukkan bahwa pengguna dapat melengkapi parameter manual terkalibrasi seperti *Kadar Air Biomassa (% MC)*, *Umur Pascapanen*, dan *Kondisi Biji*.
- **Narasi Utama:**
  "Penggabungan data telemetri otomatis dan masukan uji laboratorium manual menghasilkan profil data komprehensif tanpa overengineering."

### Langkah 10: Eksekusi Inferensi & Penjelasan Saintifik (`/classification`)
- **Tindakan:** Klik tombol *"Jalankan Inferensi Model ML"*.
- **Narasi Utama:**
  "Tampilkan kartu rekomendasi hasil klasifikasi:
  - Kelas Utama yang direkomendasikan beserta persentase probabilitasnya (Random Forest).
  - Kesepakatan hasil dengan model pembanding Decision Tree (Agreement Check).
  - Poin-poin faktor penentu keputusan ilmiah.
  - Rekomendasi pengujian laboratorium lanjutan (Bomb Kalorimeter / Uji Perkecambahan ISTA / Rasio C/N).
  - Catatan batasan integritas ilmiah model."

### Langkah 11: Manfaat, Referensi Standar & Roadmap (`/impact`, `/references`, `/about`)
- **Tindakan:** Buka halaman Dampak dan Referensi untuk menutup sesi presentasi.
- **Narasi Utama:**
  "Tegaskan bahwa GlagahSmart AIoT tidak mengklaim angka keuntungan atau reduksi limbah fiktif tanpa bukti empiris, namun menyajikan kerangka kerja AIoT yang siap diuji coba ke lapangan dan dipatenkan pada kompetisi IDTC 2.0."
