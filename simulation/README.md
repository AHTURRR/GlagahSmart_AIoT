# Panduan Simulasi Wokwi GlagahSmart AIoT (Probe Pemantau Limbah Glagah)

Dokumentasi ini menjelaskan desain rangkaian, konfigurasi pinout, dan cara menjalankan simulasi **Probe Pemantau Limbah Bunga Glagah (Wi-Fi + MQTT)** berbasis mikrokontroler ESP32 untuk proyek **GlagahSmart AIoT (IDTC 2.0 - 2026)**.

> **Tautan Langsung Proyek Wokwi:**  
> [https://wokwi.com/projects/478499231234367489](https://wokwi.com/projects/478499231234367489)

---

## 1. Daftar Komponen & Pinout Rangkaian (`diagram.json`)

| Komponen | Pin Komponen | Pin ESP32 DevKit-C v4 | Warna Kabel | Fungsi dalam Sistem |
| :--- | :--- | :--- | :--- | :--- |
| **DHT22 (`dht1`)** | `VCC` / `SDA` / `GND` | `3V3` / `GPIO 15` / `GND.1` | Merah / Hijau / Hitam | Mengukur suhu udara lingkungan (°C) & kelembapan relatif (% RH) di kepala alat |
| **DS18B20 (`temp1`)** | `VCC` / `DQ` / `GND` | `3V3` / `GPIO 4` / `GND.1` | Merah / Hijau / Hitam | Sensor probe suhu inti tumpukan limbah bunga glagah (1-Wire Bus) |
| **Resistor 4.7 kΩ (`rpull`)** | Pin 1 ↔ Pin 2 | `DQ (GPIO 4)` ↔ `3V3` | Emas / Merah | Pull-up wajib pada jalur data 1-Wire DS18B20 |
| **LED Hijau + R1 330 Ω** | `A` / `C` | `GPIO 25` / `GND.2` | Hijau / Hitam | Status: **Cenderung Kering** → Rekomendasi *Benih / Briket* |
| **LED Kuning + R2 330 Ω** | `A` / `C` | `GPIO 26` / `GND.2` | Emas / Hitam | Status: **Tidak Pasti / Mode Aman** → *Tahan, Cek Ulang* |
| **LED Merah + R3 330 Ω** | `A` / `C` | `GPIO 27` / `GND.2` | Merah / Hitam | Status: **Aktif / Lembap** → Rekomendasi *Pupuk / Kompos* |
| **Piezo Buzzer (`bz1`)** | `Pin 2 (+)` / `Pin 1 (-)` | `GPIO 14` / `GND.2` | Magenta / Hitam | Indikator perubahan kelas & alarm suhu tinggi tumpukan ($\ge 60^\circ\text{C}$) |

---

## 2. Pustaka yang Digunakan (`libraries.txt`)
```text
DHT sensor library
Adafruit Unified Sensor
OneWire
DallasTemperature
PubSubClient
```

---

## 3. Cara Menjalankan di Wokwi
1. Buka langsung proyek di [https://wokwi.com/projects/478499231234367489](https://wokwi.com/projects/478499231234367489) (atau impor `diagram.json`, `sketch.ino`, dan `libraries.txt` ke proyek ESP32 baru).
2. Tekan tombol **Play / Start Simulation**.
3. Klik komponen **DS18B20** atau **DHT22** di canvas Wokwi untuk menggeser slider suhu tumpukan, suhu udara, dan kelembapan udara.
4. Amati perubahan:
   - Indikator **LED lokal** (Hijau / Kuning / Merah) dan bunyi **Buzzer** bekerja secara lokal meskipun koneksi internet terputus.
   - **Serial Monitor** mencetak log pembacaan setiap 1,5 detik serta payload JSON MQTT ke broker publik `broker.hivemq.com:1883` pada topik `idtc2026/glagah/<ID_ALAT>/data`.

---

## 4. Catatan Ilmiah & Integritas Simulasi
> - Seluruh pembacaan pada Wokwi adalah **data simulasi/tiruan** untuk membuktikan logika inferensi tepi (*moving average 5 sampel*, konfirmasi 3 siklus, dan *fail-safe mode*) serta alur transmisi data.
> - **Kelembapan Relatif Udara (% RH)** dari DHT22 **tidak sama** dengan **Kadar Air Biomassa (% MC)**.
> - Ambang batas awal pada `sketch.ino` (`AMBANG_DELTA_AKTIF = 5.0°C`, `AMBANG_HUM_TINGGI = 80%`, `AMBANG_SUHU_TINGGI = 60°C`) merupakan asumsi baseline sebelum kalibrasi uji laboratorium lapangan.
