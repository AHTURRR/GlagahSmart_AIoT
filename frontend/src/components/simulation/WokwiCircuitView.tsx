"use client";

import React, { useState } from "react";
import {
  Cpu,
  ExternalLink,
  Play,
  Layers,
  Table2,
  Terminal,
  Info,
  Volume2,
  AlertTriangle,
  Wifi,
  CheckCircle2,
  RotateCcw,
  Radio,
} from "lucide-react";

export interface WokwiLiveState {
  coreTemp: number; // DS18B20 suhu inti tumpukan (°C)
  ambientTemp: number; // DHT22 suhu udara (°C)
  ambientHum: number; // DHT22 kelembapan relatif udara (% RH)
  delta: number; // T_tumpuk - T_udara (°C)
  trend: number; // Tren perubahan delta
  score: number; // Skor indikator (0-3)
  hardwareClass: "CENDERUNG KERING" | "TIDAK PASTI" | "AKTIF/LEMBAP";
  recommendation: string;
  highTempWarning: boolean; // >= 60°C
  nodeId?: string;
}

interface ComponentSpec {
  id: string;
  name: string;
  category: string;
  pins: string;
  espPins: string;
  wireColors: string[];
  voltage: string;
  description: string;
  firmwareNote: string;
}

const COMPONENT_SPECS: Record<string, ComponentSpec> = {
  esp: {
    id: "esp",
    name: "ESP32 DevKit-C v4 (38-Pin)",
    category: "Mikrokontroler & Wi-Fi Edge Node",
    pins: "3V3, GND.1, GND.2, GPIO 4, 14, 15, 25, 26, 27",
    espPins: "Main Controller (Dual-Core Xtensa LX6)",
    wireColors: ["Merah (3V3)", "Hitam (GND)", "Sinyal Digital & OneWire"],
    voltage: "3.3V Logic / 5V Micro-USB Supply",
    description:
      "Otak pemrosesan tepi (edge node) yang membaca DHT22 & DS18B20 tiap 1,5 detik, menghitung rata-rata bergerak (moving average 5 sampel) & konfirmasi 3 siklus, menggerakkan LED/Buzzer secara lokal walau internet putus, serta mengirim JSON via MQTT Wi-Fi.",
    firmwareNote:
      "Koneksi Wi-Fi Wokwi-GUEST (kanal 6) -> Broker MQTT broker.hivemq.com:1883 pada topik idtc2026/glagah/<ID_ALAT>/data.",
  },
  temp1: {
    id: "temp1",
    name: "DS18B20 Waterproof Temperature Probe",
    category: "Sensor Suhu Inti Tumpukan (OneWire)",
    pins: "VCC, DQ (Data), GND",
    espPins: "GPIO 4 (OneWire Bus), 3V3, GND.1",
    wireColors: ["Merah (VCC)", "Hijau (DQ -> GPIO 4)", "Hitam (GND)"],
    voltage: "3.3V DC (dengan Pull-Up 4.7kΩ)",
    description:
      "Probe suhu tusuk yang dimasukkan ke bagian dalam tumpukan residu bunga glagah untuk mendeteksi panas metabolik fermentasi mikroba. Selisih ΔT = T_tumpuk - T_udara >= 5°C menjadi indikator kuat aktivitas biologis/lembap.",
    firmwareNote:
      "Menggunakan pustaka OneWire & DallasTemperature. Jika sensor terputus (DEVICE_DISCONNECTED_C), sistem otomatis masuk Mode Aman (LED Kuning + 5x beep).",
  },
  rpull: {
    id: "rpull",
    name: "Resistor Pull-Up 4.7 kΩ (4700 Ω)",
    category: "Komponen Pasif (Kuning-Ungu-Merah-Emas)",
    pins: "Pin 1 -> DQ (GPIO 4), Pin 2 -> 3V3",
    espPins: "Antara GPIO 4 dan Rail 3V3",
    wireColors: ["Emas/Kuning (ke DQ)", "Merah (ke 3V3)"],
    voltage: "3.3V Pull-Up",
    description:
      "Wajib dipasang pada jalur data bus 1-Wire (DS18B20) agar sinyal digital tetap stabil pada logika HIGH saat idle (open-drain communication), mencegah kesalahan pembacaan suhu.",
    firmwareNote:
      "Nilai standar datasheet Maxim/Dallas untuk kabel probe pendek hingga menengah adalah 4.7 kΩ.",
  },
  dht1: {
    id: "dht1",
    name: "DHT22 (AM2302) Digital Temp & Humidity",
    category: "Sensor Lingkungan Kepala Probe",
    pins: "VCC, SDA (Data), NC, GND",
    espPins: "GPIO 15 (Digital), 3V3, GND.1",
    wireColors: ["Merah (VCC)", "Hijau (SDA -> GPIO 15)", "Hitam (GND)"],
    voltage: "3.3V DC",
    description:
      "Mengukur suhu udara lingkungan (ambient) sebagai pembanding ΔT serta kelembapan relatif udara (% RH) di sekitar tumpukan glagah. Catatan ilmiah: % RH udara BUKAN kadar air internal biomassa (% MC).",
    firmwareNote:
      "Ambang asumsi awal: RH >= 80% menambah skor aktif/lembap; RH <= 55% dengan ΔT <= 2°C menandakan kondisi cenderung kering.",
  },
  leds: {
    id: "leds",
    name: "3x Indikator LED Status + 3x Resistor 330 Ω",
    category: "Antarmuka Visual Lokal (Offline-Resilient)",
    pins: "Anode -> R 330Ω -> GPIO 25/26/27 | Cathode -> GND.2",
    espPins: "GPIO 25 (Hijau), GPIO 26 (Kuning), GPIO 27 (Merah)",
    wireColors: [
      "Hijau (GPIO 25)",
      "Emas (GPIO 26)",
      "Merah (GPIO 27)",
      "Hitam (GND.2)",
    ],
    voltage: "3.3V Digital Output (Arus dibatasi R 330Ω)",
    description:
      "Menampilkan rekomendasi pemanfaatan secara instan di lapangan tanpa bergantung pada koneksi internet: Hijau = Cenderung Kering (Benih/Briket), Kuning = Tidak Pasti (Tahan/Cek Ulang), Merah = Aktif/Lembap (Pupuk/Kompos).",
    firmwareNote:
      "Resistor 330 Ω (Jingga-Jingga-Cokelat-Emas) melindungi LED dan pin GPIO ESP32 dari arus berlebih (~4-5 mA).",
  },
  bz1: {
    id: "bz1",
    name: "Piezo Buzzer (Indikator Audio & Alarm)",
    category: "Aktuator Peringatan Suara",
    pins: "Pin 2 (+) -> GPIO 14 | Pin 1 (-) -> GND.2",
    espPins: "GPIO 14 (PWM tone 2000 Hz), GND.2",
    wireColors: ["Magenta (GPIO 14)", "Hitam (GND.2)"],
    voltage: "3.3V PWM Signal",
    description:
      "Memberikan umpan balik audio saat status klasifikasi berubah (1x beep Kering, 2x beep Cek Ulang, 3x beep Aktif/Kompos) serta alarm 2x bunyi panjang (400 ms) apabila suhu inti tumpukan mencapai >= 60°C.",
    firmwareNote:
      "Juga berbunyi 5x pendek (60 ms) sebagai notifikasi Mode Aman bila sensor DHT22 gagal baca atau DS18B20 terputus.",
  },
};

const WIRING_TABLE = [
  {
    component: "DHT22 (dht1)",
    compPin: "VCC",
    espPin: "3V3",
    colorName: "Merah",
    colorHex: "#ef4444",
    signal: "Power 3.3V",
    note: "Catu daya sensor udara",
  },
  {
    component: "DHT22 (dht1)",
    compPin: "SDA",
    espPin: "GPIO 15",
    colorName: "Hijau",
    colorHex: "#22c55e",
    signal: "Digital Data",
    note: "Pembacaan suhu & % RH udara",
  },
  {
    component: "DHT22 (dht1)",
    compPin: "GND",
    espPin: "GND.1",
    colorName: "Hitam",
    colorHex: "#475569",
    signal: "Ground",
    note: "Referensi ground sensor",
  },
  {
    component: "DS18B20 (temp1)",
    compPin: "VCC",
    espPin: "3V3",
    colorName: "Merah",
    colorHex: "#ef4444",
    signal: "Power 3.3V",
    note: "Catu daya probe tumpukan",
  },
  {
    component: "DS18B20 (temp1)",
    compPin: "DQ",
    espPin: "GPIO 4",
    colorName: "Hijau",
    colorHex: "#22c55e",
    signal: "1-Wire Bus",
    note: "Data suhu inti tumpukan glagah",
  },
  {
    component: "DS18B20 (temp1)",
    compPin: "GND",
    espPin: "GND.1",
    colorName: "Hitam",
    colorHex: "#475569",
    signal: "Ground",
    note: "Referensi ground probe",
  },
  {
    component: "Resistor 4.7kΩ (rpull)",
    compPin: "Pin 1 & Pin 2",
    espPin: "DQ (GPIO 4) ↔ 3V3",
    colorName: "Emas / Merah",
    colorHex: "#eab308",
    signal: "Pull-Up",
    note: "Menjaga logika HIGH bus 1-Wire",
  },
  {
    component: "LED Hijau + R1 330Ω",
    compPin: "Anode (A) / Cathode (C)",
    espPin: "GPIO 25 / GND.2",
    colorName: "Hijau / Hitam",
    colorHex: "#22c55e",
    signal: "Digital Out",
    note: "Status: Cenderung Kering (Benih/Briket)",
  },
  {
    component: "LED Kuning + R2 330Ω",
    compPin: "Anode (A) / Cathode (C)",
    espPin: "GPIO 26 / GND.2",
    colorName: "Emas / Hitam",
    colorHex: "#eab308",
    signal: "Digital Out",
    note: "Status: Tidak Pasti / Mode Aman",
  },
  {
    component: "LED Merah + R3 330Ω",
    compPin: "Anode (A) / Cathode (C)",
    espPin: "GPIO 27 / GND.2",
    colorName: "Merah / Hitam",
    colorHex: "#ef4444",
    signal: "Digital Out",
    note: "Status: Aktif/Lembap (Pupuk/Kompos)",
  },
  {
    component: "Piezo Buzzer (bz1)",
    compPin: "Pin 2 (+) / Pin 1 (-)",
    espPin: "GPIO 14 / GND.2",
    colorName: "Magenta / Hitam",
    colorHex: "#d946ef",
    signal: "PWM Tone",
    note: "Notifikasi kelas & alarm suhu >= 60°C",
  },
];

const LEFT_PINS = [
  { label: "3V3", active: true, color: "#ef4444" },
  { label: "EN", active: false },
  { label: "VP", active: false },
  { label: "VN", active: false },
  { label: "34", active: false },
  { label: "35", active: false },
  { label: "32", active: false },
  { label: "33", active: false },
  { label: "25", active: true, color: "#22c55e" },
  { label: "26", active: true, color: "#eab308" },
  { label: "27", active: true, color: "#ef4444" },
  { label: "14", active: true, color: "#d946ef" },
  { label: "12", active: false },
  { label: "GND", active: true, color: "#94a3b8" },
  { label: "13", active: false },
  { label: "D2", active: false },
  { label: "D3", active: false },
  { label: "CMD", active: false },
  { label: "5V", active: false },
];

const RIGHT_PINS = [
  { label: "GND", active: true, color: "#94a3b8" },
  { label: "23", active: false },
  { label: "22", active: false },
  { label: "TX", active: false },
  { label: "RX", active: false },
  { label: "21", active: false },
  { label: "GND", active: false },
  { label: "19", active: false },
  { label: "18", active: false },
  { label: "5", active: false },
  { label: "17", active: false },
  { label: "16", active: false },
  { label: "4", active: true, color: "#22c55e" },
  { label: "0", active: false },
  { label: "2", active: false },
  { label: "15", active: true, color: "#22c55e" },
  { label: "D1", active: false },
  { label: "D0", active: false },
  { label: "CLK", active: false },
];

const WOKWI_PROJECT_ID = "478499231234367489";
const WOKWI_PROJECT_URL = `https://wokwi.com/projects/${WOKWI_PROJECT_ID}`;

export default function WokwiCircuitView({
  liveState,
}: {
  liveState: WokwiLiveState;
}) {
  const [activeTab, setActiveTab] = useState<"schematic" | "live" | "pinout">(
    "schematic"
  );
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [embedKey, setEmbedKey] = useState(0);

  const isGreenOn = liveState.hardwareClass === "CENDERUNG KERING";
  const isYellowOn = liveState.hardwareClass === "TIDAK PASTI";
  const isRedOn = liveState.hardwareClass === "AKTIF/LEMBAP";
  const isBuzzerAlert = liveState.highTempWarning;

  const wireOpacity = (owners: string[]) => {
    if (!selectedPart) return 0.92;
    if (selectedPart === "esp") return 0.95;
    return owners.includes(selectedPart) ? 1 : 0.14;
  };

  const partOpacity = (partId: string) => {
    if (!selectedPart) return 1;
    if (selectedPart === "esp" || selectedPart === partId) return 1;
    return 0.45;
  };

  const selectedSpec = selectedPart ? COMPONENT_SPECS[selectedPart] : null;

  const nodeId = liveState.nodeId || "glagah-probe-01";
  const mqttJson = JSON.stringify({
    id: nodeId,
    tumpuk: Number(liveState.coreTemp.toFixed(1)),
    udara: Number(liveState.ambientTemp.toFixed(1)),
    hum: Math.round(liveState.ambientHum),
    delta: Number(liveState.delta.toFixed(1)),
    tren: Number(liveState.trend.toFixed(1)),
    skor: liveState.score,
    kelas: liveState.hardwareClass,
    rekomendasi: liveState.recommendation,
    suhu_tinggi: liveState.highTempWarning,
    error: "",
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
      {/* Top Bar & Mode Switcher */}
      <div className="px-5 sm:px-7 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base tracking-tight text-white">
                Desain Rangkaian Probe IoT (Wokwi ESP32)
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Wifi className="w-3 h-3" />
                MQTT + Edge LED
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400">
              IDTC AIoT – Probe Pemantau Limbah Glagah • Project #{WOKWI_PROJECT_ID}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
          <button
            type="button"
            onClick={() => setActiveTab("schematic")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "schematic"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/70"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skematik Rangkaian</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("live")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "live"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/70"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Simulator Live Wokwi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pinout")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "pinout"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/70"
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>Pinout & BOM</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE WOKWI-STYLE CIRCUIT DIAGRAM */}
      {activeTab === "schematic" && (
        <div className="bg-[#0f141e]">
          {/* Interactive Status Strip */}
          <div className="px-5 sm:px-7 py-3 bg-[#161d2b] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-slate-400 font-medium">
                Klik komponen pada rangkaian untuk inspeksi pin & kabel:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "temp1", label: "DS18B20" },
                  { id: "rpull", label: "R 4.7kΩ" },
                  { id: "dht1", label: "DHT22" },
                  { id: "esp", label: "ESP32" },
                  { id: "bz1", label: "Buzzer" },
                  { id: "leds", label: "3x LED" },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() =>
                      setSelectedPart(selectedPart === chip.id ? null : chip.id)
                    }
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all border ${
                      selectedPart === chip.id
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/60"
                        : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
                {selectedPart && (
                  <button
                    type="button"
                    onClick={() => setSelectedPart(null)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-amber-300 hover:bg-amber-500/10"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Active Hardware Edge Output Indicator */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  isGreenOn
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                    : isRedOn
                    ? "bg-rose-500/15 text-rose-300 border-rose-500/40"
                    : "bg-amber-500/15 text-amber-300 border-amber-500/40"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isGreenOn
                      ? "bg-emerald-400"
                      : isRedOn
                      ? "bg-rose-500"
                      : "bg-amber-400"
                  }`}
                />
                LED AKTIF: {liveState.hardwareClass} ({liveState.recommendation})
              </span>
            </div>
          </div>

          {/* Wokwi Dark Dotted Canvas SVG */}
          <div className="relative overflow-x-auto p-3 sm:p-5">
            <svg
              viewBox="0 0 960 565"
              className="w-full min-w-[740px] h-auto select-none rounded-2xl border border-slate-800/90 shadow-inner"
              style={{
                backgroundColor: "#131823",
                backgroundImage:
                  "radial-gradient(#283248 1.25px, transparent 1.25px)",
                backgroundSize: "18px 18px",
              }}
              role="img"
              aria-label="Diagram Rangkaian Interaktif Wokwi Probe Pemantau Limbah Glagah ESP32"
            >
              <defs>
                {/* Metallic gradient for ESP-WROOM-32 & DS18B20 probe */}
                <linearGradient id="metalShield" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
                <linearGradient id="probeTip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
                {/* Glow filters for Active LEDs */}
                <filter
                  id="glowGreen"
                  x="-80%"
                  y="-80%"
                  width="260%"
                  height="260%"
                >
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter
                  id="glowYellow"
                  x="-80%"
                  y="-80%"
                  width="260%"
                  height="260%"
                >
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter
                  id="glowRed"
                  x="-80%"
                  y="-80%"
                  width="260%"
                  height="260%"
                >
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Zone Framing Watermarks */}
              <g opacity="0.55">
                <rect
                  x="22"
                  y="14"
                  width="285"
                  height="420"
                  rx="14"
                  fill="#1e293b"
                  fillOpacity="0.22"
                  stroke="#334155"
                  strokeDasharray="5 5"
                />
                <text
                  x="36"
                  y="34"
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  ZONA 1: INPUT SENSOR PROBE
                </text>

                <rect
                  x="622"
                  y="14"
                  width="318"
                  height="420"
                  rx="14"
                  fill="#1e293b"
                  fillOpacity="0.22"
                  stroke="#334155"
                  strokeDasharray="5 5"
                />
                <text
                  x="636"
                  y="34"
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  ZONA 3: INDIKATOR LOKAL (OFFLINE)
                </text>
              </g>

              {/* ==================== WIRING LAYER (EXACT DIAGRAM.JSON CONNECTIONS) ==================== */}
              <g
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              >
                {/* 1. 3V3 RED POWER BUS: esp:3V3 (398, 128) -> rpull:2, dht1:VCC, temp1:VCC */}
                <g opacity={wireOpacity(["dht1", "temp1", "rpull"])}>
                  {/* Main trunk from esp:3V3 */}
                  <path
                    d="M 398 128 L 320 128 L 320 75 L 154 75"
                    stroke="#ef4444"
                  />
                  {/* Drop down to DHT22 VCC (207, 255) and DS18B20 VCC (116, 255) */}
                  <path
                    d="M 320 128 L 320 278 L 207 278 L 207 255"
                    stroke="#ef4444"
                  />
                  <path
                    d="M 207 278 L 116 278 L 116 255"
                    stroke="#ef4444"
                  />
                  {/* Junction dots */}
                  <circle cx="320" cy="128" r="4" fill="#ef4444" />
                  <circle cx="207" cy="278" r="4" fill="#ef4444" />
                </g>

                {/* 2. GND.1 BLACK SENSOR GROUND BUS: esp:GND.1 (398, 355.5) -> dht1:GND (267, 255), temp1:GND (72, 255) */}
                <g opacity={wireOpacity(["dht1", "temp1"])}>
                  <path
                    d="M 398 355.5 L 267 355.5 L 267 255"
                    stroke="#475569"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M 267 355.5 L 72 355.5 L 72 255"
                    stroke="#475569"
                    strokeWidth="3.5"
                  />
                  <circle cx="267" cy="355.5" r="4" fill="#64748b" />
                </g>

                {/* 3. DS18B20 DQ + PULLUP 4.7kΩ -> esp:4 (562, 338) */}
                <g opacity={wireOpacity(["temp1", "rpull"])}>
                  {/* Gold wire rpull:1 (86, 75) -> temp1:DQ junction (94, 298) */}
                  <path
                    d="M 86 75 L 42 75 L 42 298 L 94 298"
                    stroke="#eab308"
                  />
                  {/* Green wire temp1:DQ (94, 255) -> over top -> esp:4 (562, 338) */}
                  <path
                    d="M 94 255 L 94 298 L 160 298 L 160 44 L 606 44 L 606 338 L 562 338"
                    stroke="#22c55e"
                  />
                  <circle cx="94" cy="298" r="4" fill="#eab308" />
                </g>

                {/* 4. DHT22 SDA (227, 255) -> esp:15 (562, 390.5) */}
                <g opacity={wireOpacity(["dht1"])}>
                  <path
                    d="M 227 255 L 227 316 L 302 316 L 302 58 L 592 58 L 592 390.5 L 562 390.5"
                    stroke="#10b981"
                  />
                </g>

                {/* 5. GND.2 BLACK ACTUATOR GROUND BUS: esp:GND.2 (562, 128) -> bz1:-, led1:C, led2:C, led3:C */}
                <g opacity={wireOpacity(["bz1", "leds"])}>
                  <path
                    d="M 562 128 L 912 128"
                    stroke="#475569"
                    strokeWidth="3.5"
                  />
                  {/* Drop to Buzzer Pin 1 (-) */}
                  <path
                    d="M 668 128 L 668 225"
                    stroke="#475569"
                    strokeWidth="3.5"
                  />
                  {/* Drop to LED 1 Cathode */}
                  <path
                    d="M 762 128 L 762 285 L 748 285"
                    stroke="#475569"
                    strokeWidth="3.5"
                  />
                  {/* Drop to LED 2 Cathode */}
                  <path
                    d="M 837 128 L 837 285 L 823 285"
                    stroke="#475569"
                    strokeWidth="3.5"
                  />
                  {/* Drop to LED 3 Cathode */}
                  <path
                    d="M 912 128 L 912 285 L 898 285"
                    stroke="#475569"
                    strokeWidth="3.5"
                  />
                  <circle cx="668" cy="128" r="4" fill="#64748b" />
                  <circle cx="762" cy="128" r="4" fill="#64748b" />
                  <circle cx="837" cy="128" r="4" fill="#64748b" />
                </g>

                {/* 6. BUZZER SIGNAL (MAGENTA): esp:14 (398, 320.5) -> bz1:2 (+) (668, 305) */}
                <g opacity={wireOpacity(["bz1"])}>
                  <path
                    d="M 398 320.5 L 366 320.5 L 366 484 L 668 484 L 668 305"
                    stroke="#d946ef"
                  />
                </g>

                {/* 7. LED 3 MERAH (RED): esp:27 (398, 303) -> r3:1 (882, 392) & r3:2 -> led3:A */}
                <g opacity={wireOpacity(["leds"])}>
                  <path
                    d="M 398 303 L 352 303 L 352 500 L 882 500 L 882 385"
                    stroke="#ef4444"
                  />
                  <path d="M 882 325 L 882 285" stroke="#ef4444" />
                </g>

                {/* 8. LED 2 KUNING (GOLD): esp:26 (398, 285.5) -> r2:1 (807, 392) & r2:2 -> led2:A */}
                <g opacity={wireOpacity(["leds"])}>
                  <path
                    d="M 398 285.5 L 338 285.5 L 338 516 L 807 516 L 807 385"
                    stroke="#eab308"
                  />
                  <path d="M 807 325 L 807 285" stroke="#eab308" />
                </g>

                {/* 9. LED 1 HIJAU (GREEN): esp:25 (398, 268) -> r1:1 (732, 392) & r1:2 -> led1:A */}
                <g opacity={wireOpacity(["leds"])}>
                  <path
                    d="M 398 268 L 324 268 L 324 532 L 732 532 L 732 385"
                    stroke="#22c55e"
                  />
                  <path d="M 732 325 L 732 285" stroke="#22c55e" />
                </g>
              </g>

              {/* ==================== COMPONENT 1: PULL-UP RESISTOR 4.7kΩ (rpull) ==================== */}
              <g
                className="cursor-pointer transition-opacity"
                opacity={partOpacity("rpull")}
                onClick={() =>
                  setSelectedPart(selectedPart === "rpull" ? null : "rpull")
                }
              >
                <line
                  x1="86"
                  y1="75"
                  x2="154"
                  y2="75"
                  stroke="#94a3b8"
                  strokeWidth="3"
                />
                {/* Resistor body */}
                <rect
                  x="96"
                  y="66"
                  width="48"
                  height="18"
                  rx="6"
                  fill="#d6b485"
                  stroke={selectedPart === "rpull" ? "#34d399" : "#785a32"}
                  strokeWidth={selectedPart === "rpull" ? "2.5" : "1.5"}
                />
                {/* Color bands: 4 (Yellow), 7 (Violet), x100 (Red), 5% (Gold) */}
                <rect x="104" y="66.5" width="5" height="17" fill="#facc15" />
                <rect x="114" y="66.5" width="5" height="17" fill="#7e22ce" />
                <rect x="124" y="66.5" width="5" height="17" fill="#dc2626" />
                <rect x="135" y="66.5" width="4" height="17" fill="#d97706" />
                <text
                  x="120"
                  y="58"
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="10"
                  fontWeight="700"
                >
                  R_pull 4.7kΩ
                </text>
              </g>

              {/* ==================== COMPONENT 2: DS18B20 PROBE (temp1) ==================== */}
              <g
                className="cursor-pointer transition-opacity"
                opacity={partOpacity("temp1")}
                onClick={() =>
                  setSelectedPart(selectedPart === "temp1" ? null : "temp1")
                }
              >
                {/* Metallic stainless probe body */}
                <rect
                  x="62"
                  y="112"
                  width="64"
                  height="118"
                  rx="10"
                  fill="#1e293b"
                  stroke={selectedPart === "temp1" ? "#34d399" : "#475569"}
                  strokeWidth={selectedPart === "temp1" ? "2.5" : "1.5"}
                />
                {/* Stainless cylinder icon */}
                <rect
                  x="84"
                  y="122"
                  width="20"
                  height="52"
                  rx="8"
                  fill="url(#probeTip)"
                  stroke="#475569"
                />
                <rect x="86" y="168" width="16" height="14" fill="#0f172a" />
                <text
                  x="94"
                  y="198"
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="800"
                >
                  DS18B20
                </text>
                <text
                  x="94"
                  y="211"
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="9"
                  fontWeight="600"
                >
                  {liveState.coreTemp.toFixed(1)}°C
                </text>
                <text
                  x="94"
                  y="223"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                >
                  Inti Tumpukan
                </text>
                {/* Pins: GND (72), DQ (94), VCC (116) */}
                <line
                  x1="72"
                  y1="230"
                  x2="72"
                  y2="255"
                  stroke="#cbd5e1"
                  strokeWidth="2.5"
                />
                <line
                  x1="94"
                  y1="230"
                  x2="94"
                  y2="255"
                  stroke="#cbd5e1"
                  strokeWidth="2.5"
                />
                <line
                  x1="116"
                  y1="230"
                  x2="116"
                  y2="255"
                  stroke="#cbd5e1"
                  strokeWidth="2.5"
                />
                <text
                  x="72"
                  y="244"
                  textAnchor="end"
                  dx="-4"
                  fill="#94a3b8"
                  fontSize="8"
                >
                  GND
                </text>
                <text
                  x="94"
                  y="246"
                  textAnchor="middle"
                  fill="#4ade80"
                  fontSize="8"
                  fontWeight="700"
                >
                  DQ
                </text>
                <text
                  x="116"
                  y="244"
                  textAnchor="start"
                  dx="4"
                  fill="#f87171"
                  fontSize="8"
                >
                  VCC
                </text>
              </g>

              {/* ==================== COMPONENT 3: DHT22 SENSOR (dht1) ==================== */}
              <g
                className="cursor-pointer transition-opacity"
                opacity={partOpacity("dht1")}
                onClick={() =>
                  setSelectedPart(selectedPart === "dht1" ? null : "dht1")
                }
              >
                {/* Mounting tab */}
                <path
                  d="M 218 112 L 256 112 L 256 126 L 218 126 Z"
                  fill="#e2e8f0"
                  stroke="#94a3b8"
                />
                <circle cx="237" cy="119" r="3.5" fill="#131823" />
                {/* White sensor housing */}
                <rect
                  x="192"
                  y="125"
                  width="90"
                  height="105"
                  rx="6"
                  fill="#f8fafc"
                  stroke={selectedPart === "dht1" ? "#34d399" : "#94a3b8"}
                  strokeWidth={selectedPart === "dht1" ? "3" : "1.5"}
                />
                {/* Ventilation grille grid */}
                <g fill="#cbd5e1">
                  {[0, 1, 2, 3, 4].map((row) =>
                    [0, 1, 2, 3, 4].map((col) => (
                      <rect
                        key={`${row}-${col}`}
                        x={204 + col * 14}
                        y={135 + row * 10}
                        width="9"
                        height="6"
                        rx="1"
                      />
                    ))
                  )}
                </g>
                <text
                  x="237"
                  y="198"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="11"
                  fontWeight="800"
                >
                  DHT22
                </text>
                <text
                  x="237"
                  y="212"
                  textAnchor="middle"
                  fill="#0369a1"
                  fontSize="9"
                  fontWeight="700"
                >
                  {liveState.ambientTemp.toFixed(1)}°C |{" "}
                  {Math.round(liveState.ambientHum)}% RH
                </text>
                <text
                  x="237"
                  y="223"
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="8"
                >
                  Udara Kepala Alat
                </text>
                {/* 4 Pins: VCC (207), SDA (227), NC (247), GND (267) */}
                {[207, 227, 247, 267].map((px, idx) => (
                  <line
                    key={idx}
                    x1={px}
                    y1="230"
                    x2={px}
                    y2="255"
                    stroke="#cbd5e1"
                    strokeWidth="2.5"
                  />
                ))}
                <text
                  x="207"
                  y="246"
                  textAnchor="end"
                  dx="-3"
                  fill="#f87171"
                  fontSize="7.5"
                >
                  VCC
                </text>
                <text
                  x="227"
                  y="246"
                  textAnchor="middle"
                  fill="#4ade80"
                  fontSize="7.5"
                  fontWeight="700"
                >
                  SDA
                </text>
                <text
                  x="247"
                  y="246"
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="7.5"
                >
                  NC
                </text>
                <text
                  x="267"
                  y="246"
                  textAnchor="start"
                  dx="3"
                  fill="#94a3b8"
                  fontSize="7.5"
                >
                  GND
                </text>
              </g>

              {/* Live Delta T Badge under sensors */}
              <g>
                <rect
                  x="42"
                  y="378"
                  width="244"
                  height="42"
                  rx="8"
                  fill="#0f172a"
                  stroke="#334155"
                />
                <text
                  x="56"
                  y="396"
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontWeight="600"
                >
                  Selisih Suhu (ΔT = Tumpuk − Udara):
                </text>
                <text
                  x="56"
                  y="412"
                  fill={liveState.delta >= 5 ? "#f87171" : "#34d399"}
                  fontSize="11.5"
                  fontWeight="800"
                >
                  {liveState.delta >= 0 ? "+" : ""}
                  {liveState.delta.toFixed(1)}°C • Skor Edge: {liveState.score}/3
                </text>
              </g>

              {/* ==================== COMPONENT 4: ESP32 DEVKIT-C V4 (esp) ==================== */}
              <g
                className="cursor-pointer transition-opacity"
                opacity={partOpacity("esp")}
                onClick={() =>
                  setSelectedPart(selectedPart === "esp" ? null : "esp")
                }
              >
                {/* Main PCB Board */}
                <rect
                  x="390"
                  y="75"
                  width="180"
                  height="390"
                  rx="10"
                  fill="#18202f"
                  stroke={selectedPart === "esp" ? "#34d399" : "#475569"}
                  strokeWidth={selectedPart === "esp" ? "2.5" : "2"}
                />
                {/* PCB Wi-Fi Antenna Trace (top center) */}
                <path
                  d="M 442 98 L 442 84 L 452 84 L 452 94 L 462 94 L 462 84 L 472 84 L 472 94 L 482 94 L 482 84 L 492 84 L 492 94 L 502 94 L 502 84 L 516 84 L 516 98"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="2"
                  opacity="0.75"
                />
                {/* ESP-WROOM-32 RF Shield */}
                <rect
                  x="426"
                  y="108"
                  width="108"
                  height="110"
                  rx="4"
                  fill="url(#metalShield)"
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                <text
                  x="480"
                  y="150"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="11"
                  fontWeight="900"
                >
                  ESP-WROOM-32
                </text>
                <text
                  x="480"
                  y="165"
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="8.5"
                  fontWeight="700"
                >
                  Wi-Fi • BLE • 240MHz
                </text>
                <text
                  x="480"
                  y="180"
                  textAnchor="middle"
                  fill="#334155"
                  fontSize="7.5"
                  fontWeight="600"
                >
                  DevKit-C v4
                </text>
                {/* Internal components decorative */}
                <rect
                  x="466"
                  y="246"
                  width="28"
                  height="28"
                  rx="2"
                  fill="#0f172a"
                  stroke="#334155"
                />
                <text
                  x="480"
                  y="263"
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="6.5"
                >
                  CP2102
                </text>
                <text
                  x="480"
                  y="310"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontWeight="800"
                  letterSpacing="0.8"
                >
                  GLAGAHSMART
                </text>
                <text
                  x="480"
                  y="323"
                  textAnchor="middle"
                  fill="#10b981"
                  fontSize="8"
                  fontWeight="700"
                >
                  PROBE NODE
                </text>

                {/* EN and BOOT buttons */}
                <rect
                  x="430"
                  y="404"
                  width="24"
                  height="16"
                  rx="2"
                  fill="#cbd5e1"
                  stroke="#475569"
                />
                <circle cx="442" cy="412" r="4" fill="#334155" />
                <text
                  x="442"
                  y="431"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="7"
                >
                  EN
                </text>

                <rect
                  x="506"
                  y="404"
                  width="24"
                  height="16"
                  rx="2"
                  fill="#cbd5e1"
                  stroke="#475569"
                />
                <circle cx="518" cy="412" r="4" fill="#334155" />
                <text
                  x="518"
                  y="431"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="7"
                >
                  BOOT
                </text>

                {/* Onboard Red Power LED */}
                <circle cx="456" cy="442" r="3.5" fill="#ef4444" filter="url(#glowRed)" />
                {/* Micro-USB Port */}
                <rect
                  x="462"
                  y="447"
                  width="36"
                  height="22"
                  rx="2"
                  fill="#94a3b8"
                  stroke="#475569"
                />
                <text
                  x="480"
                  y="461"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="7"
                  fontWeight="800"
                >
                  USB
                </text>

                {/* Left 19 Pin Headers */}
                {LEFT_PINS.map((pin, idx) => {
                  const py = 128 + idx * 17.5;
                  return (
                    <g key={`L-${idx}`}>
                      <circle
                        cx="398"
                        cy={py}
                        r={pin.active ? "4.2" : "3"}
                        fill={pin.active ? pin.color : "#334155"}
                        stroke={pin.active ? "#f8fafc" : "#64748b"}
                        strokeWidth={pin.active ? "1.3" : "1"}
                      />
                      <text
                        x="408"
                        y={py + 3}
                        fill={pin.active ? "#f8fafc" : "#64748b"}
                        fontSize="8.5"
                        fontWeight={pin.active ? "800" : "500"}
                      >
                        {pin.label}
                      </text>
                    </g>
                  );
                })}

                {/* Right 19 Pin Headers */}
                {RIGHT_PINS.map((pin, idx) => {
                  const py = 128 + idx * 17.5;
                  return (
                    <g key={`R-${idx}`}>
                      <circle
                        cx="562"
                        cy={py}
                        r={pin.active ? "4.2" : "3"}
                        fill={pin.active ? pin.color : "#334155"}
                        stroke={pin.active ? "#f8fafc" : "#64748b"}
                        strokeWidth={pin.active ? "1.3" : "1"}
                      />
                      <text
                        x="552"
                        y={py + 3}
                        textAnchor="end"
                        fill={pin.active ? "#f8fafc" : "#64748b"}
                        fontSize="8.5"
                        fontWeight={pin.active ? "800" : "500"}
                      >
                        {pin.label}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* ==================== COMPONENT 5: PIEZO BUZZER (bz1) ==================== */}
              <g
                className="cursor-pointer transition-opacity"
                opacity={partOpacity("bz1")}
                onClick={() =>
                  setSelectedPart(selectedPart === "bz1" ? null : "bz1")
                }
              >
                {/* Acoustic alert waves when high temp warning >= 60°C */}
                {isBuzzerAlert && (
                  <g className="animate-ping" style={{ transformOrigin: "668px 265px" }}>
                    <circle
                      cx="668"
                      cy="265"
                      r="44"
                      fill="none"
                      stroke="#d946ef"
                      strokeWidth="2.5"
                      opacity="0.7"
                    />
                  </g>
                )}
                {/* Pins */}
                <line
                  x1="668"
                  y1="225"
                  x2="668"
                  y2="235"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                />
                <line
                  x1="668"
                  y1="295"
                  x2="668"
                  y2="305"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                />
                {/* Buzzer casing */}
                <circle
                  cx="668"
                  cy="265"
                  r="31"
                  fill="#0f172a"
                  stroke={
                    isBuzzerAlert
                      ? "#f0abfc"
                      : selectedPart === "bz1"
                      ? "#34d399"
                      : "#475569"
                  }
                  strokeWidth={isBuzzerAlert || selectedPart === "bz1" ? "3" : "2"}
                />
                <circle
                  cx="668"
                  cy="265"
                  r="11"
                  fill="#334155"
                  stroke="#64748b"
                  strokeWidth="1.5"
                />
                <circle cx="668" cy="265" r="4" fill="#020617" />
                <text
                  x="668"
                  y="246"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontWeight="800"
                >
                  −
                </text>
                <text
                  x="668"
                  y="290"
                  textAnchor="middle"
                  fill="#e879f9"
                  fontSize="10"
                  fontWeight="800"
                >
                  +
                </text>
                <text
                  x="668"
                  y="322"
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="700"
                >
                  Buzzer
                </text>
                <text
                  x="668"
                  y="334"
                  textAnchor="middle"
                  fill={isBuzzerAlert ? "#f0abfc" : "#94a3b8"}
                  fontSize="8.5"
                  fontWeight={isBuzzerAlert ? "800" : "500"}
                >
                  {isBuzzerAlert ? "ALARM ≥60°C!" : "GPIO 14"}
                </text>
              </g>

              {/* ==================== COMPONENT 6: 3x LEDs + 3x 330Ω RESISTORS ==================== */}
              <g
                className="cursor-pointer transition-opacity"
                opacity={partOpacity("leds")}
                onClick={() =>
                  setSelectedPart(selectedPart === "leds" ? null : "leds")
                }
              >
                {[
                  {
                    cx: 740,
                    ax: 732,
                    kx: 748,
                    name: "KERING",
                    sub: "Benih/Briket",
                    pin: "GPIO 25",
                    isOn: isGreenOn,
                    onFill: "#22c55e",
                    offFill: "#14532d",
                    stroke: "#4ade80",
                    filter: "url(#glowGreen)",
                    rLabel: "R1",
                  },
                  {
                    cx: 815,
                    ax: 807,
                    kx: 823,
                    name: "CEK ULANG",
                    sub: "Tidak Pasti",
                    pin: "GPIO 26",
                    isOn: isYellowOn,
                    onFill: "#facc15",
                    offFill: "#713f12",
                    stroke: "#fde047",
                    filter: "url(#glowYellow)",
                    rLabel: "R2",
                  },
                  {
                    cx: 890,
                    ax: 882,
                    kx: 898,
                    name: "AKTIF",
                    sub: "Kompos",
                    pin: "GPIO 27",
                    isOn: isRedOn,
                    onFill: "#ef4444",
                    offFill: "#7f1d1d",
                    stroke: "#f87171",
                    filter: "url(#glowRed)",
                    rLabel: "R3",
                  },
                ].map((led) => (
                  <g key={led.name}>
                    {/* Label top */}
                    <text
                      x={led.cx}
                      y="186"
                      textAnchor="middle"
                      fill={led.isOn ? "#ffffff" : "#94a3b8"}
                      fontSize="9.5"
                      fontWeight="800"
                    >
                      {led.name}
                    </text>
                    <text
                      x={led.cx}
                      y="198"
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="8"
                    >
                      {led.sub}
                    </text>

                    {/* Active LED Halo Glow */}
                    {led.isOn && (
                      <circle
                        cx={led.cx}
                        cy="236"
                        r="24"
                        fill={led.onFill}
                        opacity="0.28"
                        filter={led.filter}
                      />
                    )}

                    {/* LED Legs */}
                    <line
                      x1={led.ax}
                      y1="262"
                      x2={led.ax}
                      y2="285"
                      stroke="#cbd5e1"
                      strokeWidth="2.5"
                    />
                    <line
                      x1={led.kx}
                      y1="262"
                      x2={led.kx}
                      y2="285"
                      stroke="#cbd5e1"
                      strokeWidth="2.5"
                    />

                    {/* LED Dome */}
                    <path
                      d={`M ${led.cx - 14} 256 L ${led.cx - 14} 236 A 14 14 0 0 1 ${
                        led.cx + 14
                      } 236 L ${led.cx + 14} 256 Z`}
                      fill={led.isOn ? led.onFill : led.offFill}
                      stroke={led.isOn ? "#ffffff" : led.stroke}
                      strokeWidth={led.isOn ? "2" : "1.2"}
                      filter={led.isOn ? led.filter : undefined}
                    />
                    {/* LED base rim */}
                    <rect
                      x={led.cx - 17}
                      y="255"
                      width="34"
                      height="7"
                      rx="2"
                      fill={led.isOn ? led.onFill : led.offFill}
                      stroke={led.stroke}
                      strokeWidth="1"
                    />
                    {/* Shine reflection */}
                    <ellipse
                      cx={led.cx - 5}
                      cy="233"
                      rx="3"
                      ry="6"
                      fill="#ffffff"
                      opacity={led.isOn ? "0.65" : "0.2"}
                    />

                    {/* Vertical 330Ω Resistor on Anode leg */}
                    <line
                      x1={led.ax}
                      y1="315"
                      x2={led.ax}
                      y2="390"
                      stroke="#94a3b8"
                      strokeWidth="2.5"
                    />
                    <rect
                      x={led.ax - 8}
                      y="328"
                      width="16"
                      height="44"
                      rx="5"
                      fill="#d6b485"
                      stroke={selectedPart === "leds" ? "#34d399" : "#785a32"}
                      strokeWidth="1.4"
                    />
                    {/* 330Ω bands: Orange (3), Orange (3), Brown (x10), Gold (5%) */}
                    <rect
                      x={led.ax - 7.5}
                      y="335"
                      width="15"
                      height="4.5"
                      fill="#f97316"
                    />
                    <rect
                      x={led.ax - 7.5}
                      y="343"
                      width="15"
                      height="4.5"
                      fill="#f97316"
                    />
                    <rect
                      x={led.ax - 7.5}
                      y="351"
                      width="15"
                      height="4.5"
                      fill="#78350f"
                    />
                    <rect
                      x={led.ax - 7.5}
                      y="361"
                      width="15"
                      height="3.5"
                      fill="#d97706"
                    />

                    <text
                      x={led.ax + 12}
                      y="350"
                      fill="#cbd5e1"
                      fontSize="8.5"
                      fontWeight="700"
                    >
                      {led.rLabel}
                    </text>
                    <text
                      x={led.ax + 12}
                      y="361"
                      fill="#94a3b8"
                      fontSize="7.5"
                    >
                      330Ω
                    </text>
                  </g>
                ))}

                {/* Legend box for LEDs */}
                <rect
                  x="714"
                  y="398"
                  width="206"
                  height="26"
                  rx="6"
                  fill="#0f172a"
                  stroke="#334155"
                />
                <text
                  x="817"
                  y="414"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8.5"
                  fontWeight="600"
                >
                  GPIO 25 (Hijau) • GPIO 26 (Kuning) • GPIO 27 (Merah)
                </text>
              </g>
            </svg>
          </div>

          {/* Component Inspector Panel (Shows when user clicks any component) */}
          {selectedSpec ? (
            <div className="mx-4 sm:mx-6 mb-4 p-4 sm:p-5 rounded-2xl bg-[#1a2234] border border-emerald-500/40 text-slate-200 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {selectedSpec.category}
                  </span>
                  <h4 className="font-bold text-base text-white">
                    {selectedSpec.name}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-mono text-sky-300">
                  {selectedSpec.voltage}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedSpec.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Koneksi Pin ESP32:
                  </span>
                  <strong className="text-white font-mono">
                    {selectedSpec.espPins}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Catatan Logika Firmware:
                  </span>
                  <span className="text-emerald-300">
                    {selectedSpec.firmwareNote}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-4 sm:mx-6 mb-4 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Tip: Klik <strong>DS18B20</strong>, <strong>DHT22</strong>,{" "}
                  <strong>R_pull 4.7kΩ</strong>, <strong>ESP32</strong>,{" "}
                  <strong>Buzzer</strong>, atau <strong>3x LED</strong> pada gambar di atas untuk menyorot jalur kabel dan melihat spesifikasi teknisnya.
                </span>
              </div>
            </div>
          )}

          {/* Simulated Wokwi Serial Monitor & MQTT Output */}
          <div className="bg-[#0b0f17] border-t border-slate-800 px-5 sm:px-7 py-4 font-mono text-[11px] sm:text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400 pb-1.5 border-b border-slate-800/90">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-slate-300">
                  Serial Monitor Wokwi (115200 baud) & MQTT Payload Preview
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <Radio className="w-3 h-3" />
                  broker.hivemq.com:1883
                </span>
                <span className="text-slate-500">
                  Topic: idtc2026/glagah/{nodeId}/data
                </span>
              </div>
            </div>

            <div className="text-emerald-300 overflow-x-auto whitespace-nowrap">
              Tumpuk={liveState.coreTemp.toFixed(1)}C Udara=
              {liveState.ambientTemp.toFixed(1)}C Hum=
              {Math.round(liveState.ambientHum)}% Delta=
              {liveState.delta.toFixed(1)} Tren=
              {liveState.trend >= 0 ? "+" : ""}
              {liveState.trend.toFixed(1)} Skor={liveState.score} Kelas=
              {liveState.hardwareClass} | Wi-Fi:ya MQTT:ya
            </div>
            {isBuzzerAlert && (
              <div className="text-fuchsia-400 font-bold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                PERINGATAN: suhu tumpukan tinggi (&ge;60.0C), periksa tumpukan!
                [Buzzer 2x 400ms]
              </div>
            )}
            <div className="text-sky-300/90 overflow-x-auto whitespace-nowrap">
              [MQTT] kirim OK: {mqttJson}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE WOKWI EMBED SIMULATOR */}
      {activeTab === "live" && (
        <div className="bg-slate-950">
          <div className="px-5 sm:px-7 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Tekan tombol <strong>Start Simulation (▶)</strong> di dalam canvas Wokwi, lalu klik sensor <strong>DHT22</strong> atau <strong>DS18B20</strong> untuk mengubah suhu/kelembapan secara langsung.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEmbedKey((k) => k + 1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Muat Ulang</span>
              </button>
              <a
                href={WOKWI_PROJECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
              >
                <span>Buka di Wokwi.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="relative w-full h-[580px] sm:h-[640px] bg-[#0f141e]">
            <iframe
              key={embedKey}
              src={`${WOKWI_PROJECT_URL}?embed=1`}
              title="Wokwi ESP32 Probe Pemantau Limbah Glagah Simulator"
              className="w-full h-full border-0"
              allow="clipboard-write"
              loading="lazy"
            />
          </div>

          <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>
              Catatan: Jika jaringan lokal memblokir embed iframe Wokwi, gunakan tombol{" "}
              <strong className="text-slate-200">Buka di Wokwi.com</strong> atau gunakan tab{" "}
              <strong className="text-emerald-400">Skematik Rangkaian</strong> di atas yang berjalan 100% offline.
            </span>
            <span className="font-mono text-slate-500">
              {WOKWI_PROJECT_URL}
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETE PINOUT TABLE & BILL OF MATERIALS */}
      {activeTab === "pinout" && (
        <div className="p-5 sm:p-7 space-y-6 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-agri-dark">
                Tabel Pengkabelan Lengkap (Sesuai{" "}
                <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                  simulation/diagram.json
                </code>
                )
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Referensi perakitan fisik prototipe Probe Pemantau Limbah Bunga Glagah berbasis ESP32 DevKit-C v4.
              </p>
            </div>
            <a
              href={WOKWI_PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-agri-primary hover:bg-agri-surface transition-colors"
            >
              <span>Lihat Proyek Wokwi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3 font-bold">Komponen</th>
                  <th className="px-4 py-3 font-bold">Pin Komponen</th>
                  <th className="px-4 py-3 font-bold">Pin ESP32</th>
                  <th className="px-4 py-3 font-bold">Warna Kabel</th>
                  <th className="px-4 py-3 font-bold">Tipe Sinyal</th>
                  <th className="px-4 py-3 font-bold">Fungsi dalam Sistem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {WIRING_TABLE.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-2.5 font-bold text-slate-800 whitespace-nowrap">
                      {row.component}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                      {row.compPin}
                    </td>
                    <td className="px-4 py-2.5 font-mono font-bold text-agri-primary whitespace-nowrap">
                      {row.espPin}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: row.colorHex }}
                        />
                        <span className="text-slate-700">{row.colorName}</span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">
                      {row.signal}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Libraries & Firmware Rules Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs text-agri-dark uppercase tracking-wider">
                Pustaka Firmware (libraries.txt)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "DHT sensor library",
                  "Adafruit Unified Sensor",
                  "OneWire",
                  "DallasTemperature",
                  "PubSubClient (MQTT)",
                ].map((lib) => (
                  <span
                    key={lib}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-mono text-[11px] text-slate-700"
                  >
                    {lib}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
              <h4 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Ambang Keputusan Edge di Firmware (Asumsi Awal)
              </h4>
              <ul className="text-[11px] text-amber-900 space-y-0.5 list-disc list-inside">
                <li>
                  <strong>ΔT Aktif &ge; 5.0°C</strong>,{" "}
                  <strong>RH Tinggi &ge; 80%</strong>,{" "}
                  <strong>Tren Naik &ge; +1.0°C/siklus</strong> (+1 skor per syarat).
                </li>
                <li>
                  <strong>Skor &ge; 2</strong> &rarr; LED Merah (Aktif/Lembap &rarr; Pupuk/Kompos).
                </li>
                <li>
                  <strong>Skor 0, ΔT &le; 2.0°C, RH &le; 55%</strong> &rarr; LED Hijau (Kering &rarr; Benih/Briket).
                </li>
                <li>
                  <strong>T_tumpuk &ge; 60.0°C</strong> &rarr; Alarm Buzzer (peringatan overheating tumpukan).
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
