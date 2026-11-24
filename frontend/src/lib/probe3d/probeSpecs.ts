export type ProbePartId =
  | "housing"
  | "panel"
  | "dht22"
  | "esp32"
  | "shaft"
  | "ds18b20";

export type CameraPresetId = "full" | "head" | "internal" | "tip";

export interface ProbePartSpec {
  id: ProbePartId;
  index: string;
  shortLabel: string;
  label: string;
  category: string;
  espPins: string;
  materialNote: string;
  description: string;
  explodedOffset: [number, number, number];
}

export interface CameraPresetSpec {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface ProbeLiveVisualState {
  coreTemp: number;
  ambientTemp: number;
  ambientHum: number;
  delta: number;
  score: number;
  hardwareClass: "CENDERUNG KERING" | "TIDAK PASTI" | "AKTIF/LEMBAP";
  recommendation: string;
  highTempWarning: boolean;
}

export const PROBE_PART_ORDER: readonly ProbePartId[] = [
  "housing",
  "panel",
  "dht22",
  "esp32",
  "shaft",
  "ds18b20",
] as const;

export const PROBE_PART_SPECS: Record<ProbePartId, ProbePartSpec> = {
  housing: {
    id: "housing",
    index: "01",
    shortLabel: "Casing",
    label: "Enclosure Kepala & Grip Lapangan",
    category: "Rumah Pelindung (IP65 Target)",
    espPins: "Port Daya 5V USB-C · Mekanik Penyangga",
    materialNote: "Polikarbonat matte hijau hutan (#24523A) & grip arang",
    description:
      "Casing tahan debu serbuk bunga glagah dengan pegangan samping bergrip ergonomis, 4 baut sudut stainless, serta port USB-C berpenutup karet di sisi bawah kepala alat.",
    explodedOffset: [0, 0.72, -0.52],
  },
  panel: {
    id: "panel",
    index: "02",
    shortLabel: "Panel LED",
    label: "Panel Muka 3x LED Status & Piezo Buzzer",
    category: "Antarmuka Lokal Offline-First",
    espPins: "GPIO 25 (Hijau), 26 (Kuning), 27 (Merah) · GPIO 14 (Buzzer)",
    materialNote: "Bezel aluminium anodisasi gelap + 3 lensa kubah & kisi akustik",
    description:
      "Permukaan miring menghadap mata pengrajin berisi 3 lensa LED rekomendasi langsung (Kering / Cek Ulang / Aktif-Kompos) dan kisi piezo buzzer yang berbunyi saat status berubah atau suhu inti mencapai ≥ 60°C.",
    explodedOffset: [0, 0.34, 1.05],
  },
  dht22: {
    id: "dht22",
    index: "03",
    shortLabel: "DHT22",
    label: "Kisi Udara Samping & Sensor DHT22 (AM2302)",
    category: "Sensor Suhu & Kelembapan Udara",
    espPins: "GPIO 15 (SDA) · 3V3 · GND.1",
    materialNote: "Vented hood berkisi pelindung debu + modul DHT22",
    description:
      "Terpasang di sisi luar kepala alat dengan kisi miring agar aliran udara bebas menyentuh DHT22 untuk pembacaan suhu udara (T_udara) dan kelembapan relatif (% RH) tanpa terperangkap panas elektronik dan terlindung dari debu serbuk glagah.",
    explodedOffset: [1.18, 0.14, 0],
  },
  esp32: {
    id: "esp32",
    index: "04",
    shortLabel: "ESP32",
    label: "ESP32 DevKit-C v4 & Rangkaian Resistor",
    category: "Mikrokontroler Edge & Wi-Fi MQTT",
    espPins: "Dual-Core Xtensa LX6 · 3V3 Logic · Wi-Fi 2.4 GHz",
    materialNote: "PCB FR-4 gelap, RF shield logam, R_pull 4.7 kΩ & 3x R 330 Ω",
    description:
      "Otak pemrosesan tepi di dalam rongga kepala alat. Memuat resistor pull-up 4.7 kΩ untuk bus 1-Wire DS18B20 dan tiga resistor pembatas arus 330 Ω untuk LED, menjalankan moving average 5 sampel, serta mengirim JSON via MQTT.",
    explodedOffset: [-0.95, 0.08, 0.18],
  },
  shaft: {
    id: "shaft",
    index: "05",
    shortLabel: "Batang",
    label: "Cable Gland & Batang Tusuk Stainless",
    category: "Struktur Mekanik Penetrasi Tumpukan",
    espPins: "Saluran Kabel Terlindung Bus 1-Wire (3-Core)",
    materialNote: "Pipa stainless steel SUS304 (±35 cm) + cincin skala 10/20/30 cm",
    description:
      "Batang logam kaku berulir cable gland yang melindungi kabel sensor saat ditusukkan langsung ke dalam karung atau tumpukan residu glagah. Dilengkapi tiga penanda kedalaman untuk konsistensi sampling.",
    explodedOffset: [0, -0.58, 0],
  },
  ds18b20: {
    id: "ds18b20",
    index: "06",
    shortLabel: "DS18B20",
    label: "Ujung Probe Suhu Inti DS18B20 Waterproof",
    category: "Sensor Suhu Inti Tumpukan (1-Wire)",
    espPins: "GPIO 4 (DQ + Pull-Up 4.7kΩ) · 3V3 · GND.1",
    materialNote: "Selongsong stainless runcing kedap air + cincin indikasi termal",
    description:
      "Ujung tusuk kedap air yang menyentuh langsung bagian dalam tumpukan residu bunga glagah untuk mendeteksi panas metabolik fermentasi (ΔT = T_tumpuk − T_udara ≥ 5°C).",
    explodedOffset: [0, -1.25, 0],
  },
};

export const CAMERA_PRESETS: readonly CameraPresetSpec[] = [
  {
    id: "full",
    label: "Utuh",
    position: [4.1, 1.35, 5.1],
    target: [0, -0.15, 0],
  },
  {
    id: "head",
    label: "Kepala & LED",
    position: [2.15, 2.05, 2.55],
    target: [0, 1.35, 0.12],
  },
  {
    id: "internal",
    label: "Internal ESP32",
    position: [-2.75, 1.75, 2.65],
    target: [-0.15, 1.3, 0],
  },
  {
    id: "tip",
    label: "Ujung Probe",
    position: [1.95, -1.55, 2.25],
    target: [0, -2.05, 0],
  },
] as const;

export const DEFAULT_PREVIEW_STATE: ProbeLiveVisualState = {
  coreTemp: 31.4,
  ambientTemp: 30.2,
  ambientHum: 52.0,
  delta: 1.2,
  score: 0,
  hardwareClass: "CENDERUNG KERING",
  recommendation: "BENIH / BRIKET",
  highTempWarning: false,
};
