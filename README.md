# GlagahSmart AIoT
**Smart Classification for Sustainable Glagah Utilization**  
*IDTC 2.0 – AIoT Future Competition 2026 (Research-Based Prototype / Proof of Concept)*

---

## 🌾 Ringkasan Proyek
**GlagahSmart AIoT** adalah platform web profil inovasi dan demonstrasi interaktif AIoT yang dirancang untuk mendukung hilirisasi berkelanjutan residu bunga glagah (*Saccharum spontaneum*) di sentra industri sapu tradisional **Kabupaten Pemalang dan Kabupaten Purbalingga, Jawa Tengah**.

Sistem mengintegrasikan:
1. **Akuisisi Data Sensor Mikroelektronika:** Simulasi Probe Pemantau Limbah Glagah berbasis mikrokontroler **ESP32 DevKit-C v4** pada platform Wokwi dengan sensor suhu tumpukan **DS18B20** (OneWire + Pull-Up 4.7kΩ), sensor udara **DHT22**, indikator lokal **3x LED + Resistor 330Ω**, **Piezo Buzzer**, dan transmisi Wi-Fi MQTT.
2. **Machine Learning Numerik Tabular:** Model klasifikasi **Random Forest Classifier** (model utama) dan **Decision Tree Classifier** (model pembanding) berbasis *scikit-learn* untuk merekomendasikan 3 alternatif pemanfaatan:
   - **Benih Tanaman** (Perbanyakan mandiri terencana)
   - **Briket Biomassa** (Energi terbarukan standar SNI 01-6235-2000)
   - **Pupuk Kompos Organik** (Restorasi tanah standar SNI 19-7030-2004)
3. **Web Profil & Storytelling Ilmiah:** Website interaktif berbasis Next.js 14, TypeScript, dan Tailwind CSS untuk presentasi kepada dewan juri kompetisi dan pemangku kepentingan industri sapu.

> **Integritas Ilmiah (Scientific Honesty):**  
> Sistem ini **TIDAK menggunakan Deep Learning atau Computer Vision**, melainkan murni data parameter fisik-kimia numerik. Data simulasi Wokwi disajikan terpisah dari data riil lapangan. Status model inferensi saat ini adalah *Synthetic Baseline Model* terkalibrasi batasan SNI/ISTA sebelum validasi laboratorium skala massal.

---

## 📁 Struktur Repositori

```text
glagahsmart-aiot/
├── README.md                           # Dokumentasi umum & panduan proyek
│
├── frontend/                           # Aplikasi Next.js 14 (App Router & Tailwind CSS)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                # Beranda (Hero & Ringkasan Inovasi)
│   │   │   ├── background/page.tsx     # Latar Belakang & Potensi Pemalang-Purbalingga
│   │   │   ├── problem/page.tsx        # Identifikasi Masalah & Rantai Pasok Sapu
│   │   │   ├── objectives/page.tsx     # Tujuan Sistem & 8 Target Pengguna
│   │   │   ├── solution/page.tsx       # Solusi 3 Jalur: Benih, Briket, Kompos
│   │   │   ├── research/page.tsx       # Metodologi 10 Tahap & Status Riset
│   │   │   ├── simulation/page.tsx     # Simulasi Wokwi IoT & Kartu Telemetri
│   │   │   ├── classification/page.tsx # Demonstrasi Machine Learning Hibrida
│   │   │   ├── technology/page.tsx     # Arsitektur Sistem & Spesifikasi AIoT
│   │   │   ├── impact/page.tsx         # Manfaat, Nilai Tambah & Penyelarasan SDGs
│   │   │   ├── references/page.tsx     # Katalog Standar SNI, ISTA & Jurnal
│   │   │   └── about/page.tsx          # Tim Pengembang & Profil IDTC 2.0
│   │   ├── components/layout/          # Navbar & Footer responsif
│   │   └── lib/                        # TypeScript types & utilities
│   └── package.json
│
├── backend/                            # REST API Gateway & Engine Machine Learning
│   ├── main.py                         # FastAPI application entrypoint
│   ├── api/v1/endpoints/               # Telemetry, Predict, dan Health routers
│   ├── ml/
│   │   ├── dataset_generator.py        # Sintesis dataset berbasis batasan fisik ilmiah
│   │   ├── train.py                    # Script pelatihan Random Forest vs Decision Tree
│   │   ├── inference.py                # Wrapper inferensi & explainable AI
│   │   └── models/                     # Binary model joblib & metrik evaluasi
│   └── requirements.txt
│
├── simulation/                         # Kode Firmware & Skematik Wokwi ESP32
│   ├── diagram.json                    # Skematik Wokwi (ESP32, DS18B20, DHT22, 3x LED, Buzzer)
│   ├── sketch.ino                      # Firmware C++ Arduino ESP32 (Edge Logic + MQTT)
│   ├── libraries.txt                   # Daftar pustaka Wokwi (DHT, OneWire, DallasTemp, PubSubClient)
│   ├── wokwi-project.txt               # Tautan proyek Wokwi (#478499231234367489)
│   └── README.md                       # Panduan rangkaian & simulasi Wokwi
│
└── docs/                               # Catatan Riset & Panduan Juri
    ├── competition_pitch.md            # Naskah panduan presentasi juri 11 langkah
    ├── sni_standards.md                # Ringkasan batasan SNI Briket & Kompos
    └── research_notes.md               # Catatan observasi lapangan Pemalang & Purbalingga
```

---

## 🚀 Panduan Menjalankan Sistem

### Keamanan Konfigurasi
- Jangan commit file `.env`, token, password, atau API key. Gunakan `backend/.env.example` dan `frontend/.env.example` sebagai template.
- Backend hanya menerima origin yang tercantum di `CORS_ORIGINS`; ubah nilainya sesuai domain deployment.
- Untuk production, set `ENVIRONMENT=production`, `API_DOCS_ENABLED=false`, serta isi `ALLOWED_HOSTS` dengan hostname resmi.
- Nilai `NEXT_PUBLIC_BACKEND_URL` bukan tempat menyimpan secret karena nilainya dikirim ke browser.

### 1. Menjalankan Backend (FastAPI & scikit-learn)
```bash
cd backend
# Pastikan library terinstall: pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- Swagger API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

### 2. Menjalankan Frontend (Next.js & Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
- Buka di browser: [http://localhost:3000](http://localhost:3000)

### 3. Menjalankan Simulasi Wokwi
1. Buka langsung proyek Wokwi di [https://wokwi.com/projects/478499231234367489](https://wokwi.com/projects/478499231234367489) (atau salin `simulation/diagram.json`, `simulation/sketch.ino`, dan `simulation/libraries.txt`).
2. Jalankan simulasi dan klik sensor **DS18B20** / **DHT22** untuk mengamati perubahan indikator 3 LED (Hijau/Kuning/Merah), Buzzer, dan transmisi payload MQTT.
3. Pada website GlagahSmart, kunjungi halaman `/simulation` untuk melihat desain rangkaian skematik interaktif ala Wokwi, embed live simulator, tabel pinout, serta sinkronisasi data ke klasifikasi Machine Learning.

---

## 🏆 Skenario Presentasi Dewan Juri IDTC 2.0
Ikuti panduan lengkap 11 langkah pada file [`docs/competition_pitch.md`](docs/competition_pitch.md):
1. **Beranda (`/`):** Pengenalan proyek, nilai tambah, dan status riset.
2. **Latar Belakang (`/background`):** Sentra sapu Pemalang-Purbalingga & pembedaan fakta vs hipotesis.
3. **Masalah (`/problem`):** Anatomi bagian glagah yang menjadi residu.
4. **Solusi (`/solution`):** 3 jalur hilirisasi (Benih, Briket, Kompos).
5. **Metodologi (`/research`):** 10 tahapan riset transparan.
6. **Simulasi Wokwi (`/simulation`):** Demonstrasi pembacaan sensor ESP32 & penerusan sampel.
7. **Klasifikasi ML (`/classification`):** Demonstrasi inferensi Random Forest, perbandingan Decision Tree, probabilitas, dan rekomendasi uji laboratorium lanjutan.
8. **Dampak & Referensi (`/impact` & `/references`):** Penyelarasan SDGs dan acuan SNI/ISTA.

---

## 👥 Tim GlagahSmart AIoT
- **Kategori:** Agriteknologi & AIoT Terapan
- **Kompetisi:** IDTC 2.0 – AIoT Future Competition 2026
- **Lokasi:** Jawa Tengah, Indonesia
