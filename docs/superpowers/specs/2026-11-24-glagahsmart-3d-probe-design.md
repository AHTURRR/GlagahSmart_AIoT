# Desain Visualisasi 3D Perangkat GlagahSmart IoT Probe

**Tanggal:** 2026-11-24  
**Status:** Menunggu persetujuan sebelum implementasi  
**Referensi visual:** `DESIGN.md` (Field Dossier — *agricultural fieldwork meets a small materials lab*)

---

## 1. Tujuan & Alasan (*Intent & Why*)
Menghadirkan visualisasi **3D interaktif perangkat keras GlagahSmart IoT** langsung di website agar dewan juri IDTC 2.0, pengrajin sapu, dan pengunjung dapat memahami wujud fisik **Probe Pemantau Limbah Bunga Glagah** secara nyata—bukan hanya diagram kabel 2D—sekaligus melihat bagaimana komponen elektronika di `simulation/diagram.json` bekerja di lapangan.

---

## 2. Sasaran, Batasan, dan Anti-Tujuan

### Goals
- **Representasi fisik akurat:** Bentuk **Handheld Field Insertion Probe (Tongkat Probe Tusuk Lapangan)** yang seluruh bagiannya merujuk langsung ke komponen nyata (`ESP32 DevKit-C v4`, `DS18B20` di ujung batang tusuk *stainless*, `DHT22` di kisi ventilasi udara samping, `3x LED` status & `Piezo Buzzer` pada panel muka miring, serta `R_pull 4.7kΩ` dan `3x R 330Ω` di dalam *enclosure*).
- **Sinkron *real-time* di `/simulation`:** Nyala 3 LED 3D, tanda alarm *buzzer* (≥ 60°C), dan status ujung termal DS18B20 langsung bereaksi terhadap slider sensor dan preset lapangan pada `WokwiLiveState`.
- **Inspeksi interaktif & edukatif:** Putar-zoom 360° (OrbitControls), preset kamera cepat (*Utuh*, *Kepala & Panel LED*, *Internal ESP32*, *Ujung Probe*), mode **Exploded View** (bongkar lapis *enclosure*), mode **X-Ray** (casing semi-transparan), serta klik/pilih bagian alat untuk membaca spesifikasi teknisnya.
- **Pratinjau di `/technology`:** Menampilkan model 3D yang sama dalam mode statis-interaktif (putar, *exploded*, *x-ray*, unduh) untuk melengkapi penjelasan arsitektur *Edge Probe*.
- **Ekspor berkas 3D standar:** Tombol **Unduh `.GLB`** (glTF 2.0 binary, langsung bisa dibuka di Blender, PowerPoint, Windows 3D Viewer, atau diimpor ke software CAD) langsung dari rakitan 3D yang sama.

### Non-Goals
- Bukan berkas *native* CAD manufaktur (`.f3d`/`.sldprt`/`.step`) dengan toleransi cetak injeksi plastik.
- Bukan simulasi termodinamika fluida/FEM tumpukan glagah.
- Tidak menambah halaman rute baru di Navbar utama.

### Anti-Goals (Anti-Slop)
- Tidak memakai pencahayaan neon *cyberpunk*, latar biru-ungu generik, animasi *auto-rotate* terus-menerus yang mengganggu, atau kartu `rounded-3xl` mengilap.
- Tidak bergantung pada CDN eksternal, HDRI jarak jauh, atau iframe pihak ketiga agar 100% andal saat demo *offline*.

---

## 3. Pendekatan yang Dipertimbangkan & Dipilih

| Pendekatan | Ringkasan | Trade-off | Keputusan |
| :--- | :--- | :--- | :--- |
| **1. Three.js Prosedural di `/simulation` + `/technology` + Ekspor `.GLB`** | Rakitan 3D parametris via `three` (client-only) sebagai tab **`Model 3D Alat`** di `WokwiCircuitView` + blok visual di `/technology`, lengkap ekspor `.glb`. | Geometri mekanis prosedural (bukan pahatan organik CAD) dan menambah paket `three`. | **Dipilih** — menyatukan fisik 3D, sensor *real-time*, skematik, dan klasifikasi dalam satu alur penjurian yang 100% *offline*. |
| **2. Halaman `/hardware` Terpisah** | Kanvas 3D penuh pada rute tersendiri di Navbar. | Memutus koneksi langsung dengan slider sensor & Serial Monitor di `/simulation`. | Ditolak |
| **3. Viewer Impor `.GLB` Statis Saja** | Hanya memuat berkas `.glb` dari `public/models/`. | Berkas `.glb` belum tersedia dan kendali LED / *exploded view* dinamis lebih terbatas. | Ditolak untuk fase ini |

---

## 4. Rancangan Bentuk Fisik & Rakitan 3D

Perangkat dimodelkan dalam **6 sub-rakitan bernomor** yang dapat disorot dan digeser halus saat mode *Exploded View*:

1. **Casing Kepala & Grip Lapangan (`housing`)** — *Enclosure* ergonomis tahan debu (*matte forest-olive* `#24523A` dan *charcoal* `#1E2A21`), penutup atas berkait baut sudut, pegangan belakang bergrip, dan port USB-C di sisi bawah dengan *seal* karet.
2. **Panel Muka Offline-First (`panel`)** — Muka miring ergonomis menghadap mata pengguna dengan **3 lensa LED status** (`GPIO 25` Hijau *Kering*, `GPIO 26` Kuning *Cek Ulang*, `GPIO 27` Merah *Aktif*) dan **kisi akustik Piezo Buzzer** (`GPIO 14`) dengan indikator gelombang halus saat suhu tumpukan ≥ 60°C.
3. **Kisi Udara Samping & Sensor DHT22 (`dht22`)** — *Vented hood* berkisi di sisi samping kepala alat yang melindungi sensor **DHT22** dari debu serbuk glagah sekaligus menjaga aliran udara bebas untuk pengukuran $T_{\text{udara}}$ dan `% RH`.
4. **Modul Inti ESP32 & Rangkaian Dalam (`esp32`)** — Papan **ESP32 DevKit-C v4** di dalam rongga kepala (PCB gelap, antena Wi-Fi tembaga/emas, *RF shield* aluminium, pin header, resistor pull-up `4.7kΩ`, dan 3 resistor `330Ω`) yang terlihat jelas pada mode **Exploded** atau **X-Ray**.
5. **Leher Cable Gland & Batang Tusuk Stainless (`shaft`)** — Mur pengunci (*cable gland*) dan pipa *stainless steel* runcing (±35 cm skala proporsional) dengan cincin skala kedalaman (10 / 20 / 30 cm) untuk menusuk karung/tumpukan glagah.
6. **Ujung Sensor DS18B20 Waterproof (`ds18b20`)** — Selongsong *stainless* berujung runcing di dasar batang tusuk yang memisahkan pembacaan $T_{\text{tumpuk}}$ dari suhu kepala alat, disertai cincin status termal halus (*mint* saat stabil, *clay* saat `ΔT ≥ 5°C` / overheat).

---

## 5. Batasan Teknis & Integrasi
- **Dependensi:** `three` + `@types/three` di `frontend/package.json`.
- **Performa & SSR:** Komponen 3D dimuat dinamis (`next/dynamic` dengan `ssr: false`) sehingga tidak memperlambat SSR atau halaman teks lain; seluruh *geometry*, *material*, dan *renderer* dibersihkan (`dispose()`) saat *unmount*.
- **Keamanan & CSP:** Berjalan 100% lokal (`WebGLRenderingContext`), tidak membutuhkan perubahan aturan eksternal di `frontend/next.config.mjs`. Ekspor `.glb` menggunakan `GLTFExporter` bawaan `three` secara lokal di browser.
- **Aksesibilitas & Fallback:** Jika WebGL tidak tersedia pada perangkat, tampilkan pesan status tenang + saran berpindah ke tab **Skematik** (SVG 2D).
- **Kewenangan implementasi (*builder's call*):** Proporsi presisi tiap part, komposisi pencahayaan studio 3-titik *matte*, kecepatan transisi kamera/*exploded*, serta tata letak bilah kendali minimalis mengikuti aturan `DESIGN.md`.
