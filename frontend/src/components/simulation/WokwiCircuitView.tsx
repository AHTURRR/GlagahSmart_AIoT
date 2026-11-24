"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  RotateCcw,
  Volume2,
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
    category: "Mikrokontroler & Edge Node",
    pins: "3V3, GND.1, GND.2, GPIO 4, 14, 15, 25, 26, 27",
    espPins: "Main Controller (Dual-Core Xtensa LX6)",
    wireColors: ["Merah (3V3)", "Hitam (GND)", "Sinyal Digital & OneWire"],
    voltage: "3.3V Logic / 5V USB",
    description:
      "Pengendali tepi (edge node) yang membaca DHT22 & DS18B20 tiap 1,5 detik, menghitung moving average 5 sampel dengan konfirmasi 3 siklus, menggerakkan LED/Buzzer secara lokal tanpa internet, serta mengirim payload JSON melalui MQTT Wi-Fi.",
    firmwareNote:
      "Wi-Fi Wokwi-GUEST (ch 6) → broker.hivemq.com:1883 pada topik idtc2026/glagah/<ID_ALAT>/data.",
  },
  temp1: {
    id: "temp1",
    name: "DS18B20 Waterproof Temperature Probe",
    category: "Sensor Suhu Inti Tumpukan (1-Wire)",
    pins: "VCC, DQ (Data), GND",
    espPins: "GPIO 4 (OneWire Bus), 3V3, GND.1",
    wireColors: ["Merah (VCC)", "Hijau (DQ → GPIO 4)", "Hitam (GND)"],
    voltage: "3.3V DC (+ Pull-Up 4.7kΩ)",
    description:
      "Probe suhu tusuk untuk bagian dalam tumpukan residu bunga glagah guna mendeteksi panas metabolik fermentasi mikroba. Selisih ΔT = T_tumpuk − T_udara ≥ 5°C menandai aktivitas biologis/lembap.",
    firmwareNote:
      "Pustaka OneWire & DallasTemperature. Bila sensor terputus (DEVICE_DISCONNECTED_C), alat masuk Mode Aman (LED Kuning + 5x beep).",
  },
  rpull: {
    id: "rpull",
    name: "Resistor Pull-Up 4.7 kΩ (4700 Ω)",
    category: "Komponen Pasif (Kuning–Ungu–Merah–Emas)",
    pins: "Pin 1 → DQ (GPIO 4), Pin 2 → 3V3",
    espPins: "Antara GPIO 4 dan Rail 3V3",
    wireColors: ["Emas (ke DQ)", "Merah (ke 3V3)"],
    voltage: "3.3V Pull-Up",
    description:
      "Wajib dipasang pada jalur data bus 1-Wire (DS18B20) agar sinyal digital tetap berada pada logika HIGH saat idle (open-drain), mencegah kegagalan pembacaan suhu.",
    firmwareNote:
      "Nilai baku datasheet Maxim/Dallas untuk kabel probe pendek hingga menengah adalah 4.7 kΩ.",
  },
  dht1: {
    id: "dht1",
    name: "DHT22 (AM2302) Temp & Humidity",
    category: "Sensor Lingkungan Kepala Probe",
    pins: "VCC, SDA (Data), NC, GND",
    espPins: "GPIO 15 (Digital), 3V3, GND.1",
    wireColors: ["Merah (VCC)", "Hijau (SDA → GPIO 15)", "Hitam (GND)"],
    voltage: "3.3V DC",
    description:
      "Mengukur suhu udara sekitar sebagai pembanding ΔT dan kelembapan relatif udara (% RH) di kepala alat. Catatan fisis: % RH udara bukan kadar air internal biomassa (% MC).",
    firmwareNote:
      "Asumsi awal: RH ≥ 80% menambah skor aktif/lembap; RH ≤ 55% dengan ΔT ≤ 2°C menandakan kondisi cenderung kering.",
  },
  leds: {
    id: "leds",
    name: "3x Indikator LED Status + 3x Resistor 330 Ω",
    category: "Antarmuka Visual Lokal (Offline)",
    pins: "Anode → R 330Ω → GPIO 25/26/27 | Cathode → GND.2",
    espPins: "GPIO 25 (Hijau), GPIO 26 (Kuning), GPIO 27 (Merah)",
    wireColors: [
      "Hijau (GPIO 25)",
      "Emas (GPIO 26)",
      "Merah (GPIO 27)",
      "Hitam (GND.2)",
    ],
    voltage: "3.3V Digital Out (~4–5 mA)",
    description:
      "Menampilkan rekomendasi pemilahan langsung di lapangan meski tanpa internet: Hijau = Cenderung Kering (Benih/Briket), Kuning = Tidak Pasti (Cek Ulang), Merah = Aktif/Lembap (Pupuk/Kompos).",
    firmwareNote:
      "Resistor 330 Ω (Jingga–Jingga–Cokelat–Emas) membatasi arus tiap LED agar aman bagi pin GPIO ESP32.",
  },
  bz1: {
    id: "bz1",
    name: "Piezo Buzzer (Audio & Alarm Suhu)",
    category: "Aktuator Peringatan Suara",
    pins: "Pin 2 (+) → GPIO 14 | Pin 1 (−) → GND.2",
    espPins: "GPIO 14 (PWM 2000 Hz), GND.2",
    wireColors: ["Magenta (GPIO 14)", "Hitam (GND.2)"],
    voltage: "3.3V PWM Signal",
    description:
      "Memberi tanda bunyi saat kelas berubah (1x Kering, 2x Cek Ulang, 3x Aktif/Kompos) serta alarm 2x bunyi panjang (400 ms) apabila suhu inti tumpukan mencapai ≥ 60°C.",
    firmwareNote:
      "Berbunyi 5x pendek (60 ms) sebagai tanda Mode Aman saat sensor DHT22 gagal baca atau DS18B20 terputus.",
  },
};

const WIRING_TABLE = [
  {
    component: "DHT22 (dht1)",
    compPin: "VCC",
    espPin: "3V3",
    colorName: "Merah",
    colorHex: "#D1493E",
    signal: "Power 3.3V",
    note: "Catu daya sensor udara",
  },
  {
    component: "DHT22 (dht1)",
    compPin: "SDA",
    espPin: "GPIO 15",
    colorName: "Hijau",
    colorHex: "#3E9660",
    signal: "Digital Data",
    note: "Pembacaan suhu & % RH udara",
  },
  {
    component: "DHT22 (dht1)",
    compPin: "GND",
    espPin: "GND.1",
    colorName: "Hitam",
    colorHex: "#49544C",
    signal: "Ground",
    note: "Referensi ground sensor",
  },
  {
    component: "DS18B20 (temp1)",
    compPin: "VCC",
    espPin: "3V3",
    colorName: "Merah",
    colorHex: "#D1493E",
    signal: "Power 3.3V",
    note: "Catu daya probe tumpukan",
  },
  {
    component: "DS18B20 (temp1)",
    compPin: "DQ",
    espPin: "GPIO 4",
    colorName: "Hijau",
    colorHex: "#3E9660",
    signal: "1-Wire Bus",
    note: "Data suhu inti tumpukan glagah",
  },
  {
    component: "DS18B20 (temp1)",
    compPin: "GND",
    espPin: "GND.1",
    colorName: "Hitam",
    colorHex: "#49544C",
    signal: "Ground",
    note: "Referensi ground probe",
  },
  {
    component: "Resistor 4.7kΩ (rpull)",
    compPin: "Pin 1 & Pin 2",
    espPin: "DQ (GPIO 4) ↔ 3V3",
    colorName: "Emas / Merah",
    colorHex: "#C99432",
    signal: "Pull-Up",
    note: "Menjaga logika HIGH bus 1-Wire",
  },
  {
    component: "LED Hijau + R1 330Ω",
    compPin: "Anode (A) / Cathode (C)",
    espPin: "GPIO 25 / GND.2",
    colorName: "Hijau / Hitam",
    colorHex: "#3E9660",
    signal: "Digital Out",
    note: "Status: Cenderung Kering (Benih/Briket)",
  },
  {
    component: "LED Kuning + R2 330Ω",
    compPin: "Anode (A) / Cathode (C)",
    espPin: "GPIO 26 / GND.2",
    colorName: "Emas / Hitam",
    colorHex: "#C99432",
    signal: "Digital Out",
    note: "Status: Tidak Pasti / Mode Aman",
  },
  {
    component: "LED Merah + R3 330Ω",
    compPin: "Anode (A) / Cathode (C)",
    espPin: "GPIO 27 / GND.2",
    colorName: "Merah / Hitam",
    colorHex: "#D1493E",
    signal: "Digital Out",
    note: "Status: Aktif/Lembap (Pupuk/Kompos)",
  },
  {
    component: "Piezo Buzzer (bz1)",
    compPin: "Pin 2 (+) / Pin 1 (−)",
    espPin: "GPIO 14 / GND.2",
    colorName: "Magenta / Hitam",
    colorHex: "#B85EB1",
    signal: "PWM Tone",
    note: "Notifikasi kelas & alarm suhu ≥ 60°C",
  },
];

const LEFT_PINS = [
  { label: "3V3", active: true, color: "#D1493E" },
  { label: "EN", active: false },
  { label: "VP", active: false },
  { label: "VN", active: false },
  { label: "34", active: false },
  { label: "35", active: false },
  { label: "32", active: false },
  { label: "33", active: false },
  { label: "25", active: true, color: "#44A66B" },
  { label: "26", active: true, color: "#D4A039" },
  { label: "27", active: true, color: "#D1493E" },
  { label: "14", active: true, color: "#C26DBC" },
  { label: "12", active: false },
  { label: "GND", active: true, color: "#8B968D" },
  { label: "13", active: false },
  { label: "D2", active: false },
  { label: "D3", active: false },
  { label: "CMD", active: false },
  { label: "5V", active: false },
];

const RIGHT_PINS = [
  { label: "GND", active: true, color: "#8B968D" },
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
  { label: "4", active: true, color: "#44A66B" },
  { label: "0", active: false },
  { label: "2", active: false },
  { label: "15", active: true, color: "#5CB882" },
  { label: "D1", active: false },
  { label: "D0", active: false },
  { label: "CLK", active: false },
];

const WOKWI_PROJECT_ID = "478499231234367489";
const WOKWI_PROJECT_URL = `https://wokwi.com/projects/${WOKWI_PROJECT_ID}`;
const MONO_FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

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
    if (!selectedPart) return 0.9;
    if (selectedPart === "esp") return 0.95;
    return owners.includes(selectedPart) ? 1 : 0.14;
  };

  const partOpacity = (partId: string) => {
    if (!selectedPart) return 1;
    if (selectedPart === "esp" || selectedPart === partId) return 1;
    return 0.4;
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
    <section
      aria-label="Meja kerja rangkaian ESP32 Wokwi"
      className="border border-agri-ink/25 bg-[#FBF9F4]"
    >
      {/* Top Bench Header & Architectural Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-agri-bg/15 bg-agri-dark px-5 py-4 text-agri-bg sm:px-6">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-agri-emeraldLight">
            <span>BENCH 01 · WOKWI #{WOKWI_PROJECT_ID}</span>
            <span className="text-agri-bg/35">/</span>
            <span className="text-agri-bg/70">MQTT + EDGE LED</span>
          </div>
          <h2 className="display-serif text-2xl leading-none text-agri-bg sm:text-[1.75rem]">
            Skematik Probe Pemantau Limbah Glagah
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Mode tampilan rangkaian"
          className="inline-flex border border-agri-bg/20 divide-x divide-agri-bg/20"
        >
          {[
            { id: "schematic" as const, label: "Skematik" },
            { id: "live" as const, label: "Simulator Wokwi" },
            { id: "pinout" as const, label: "Pinout & BOM" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-10 px-3.5 text-xs font-semibold tracking-wide transition-colors ${
                  active
                    ? "bg-agri-bg text-agri-ink"
                    : "bg-transparent text-agri-bg/75 hover:bg-agri-bg/10 hover:text-agri-bg"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: INTERACTIVE ESD-MAT SCHEMATIC */}
      {activeTab === "schematic" && (
        <div>
          {/* Component Inspection Bar & Quiet Hardware LED State */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-agri-bg/10 bg-[#17211A] px-5 py-3 text-xs text-agri-bg sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-agri-bg/55">
                Inspeksi:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "temp1", label: "DS18B20" },
                  { id: "rpull", label: "R 4.7kΩ" },
                  { id: "dht1", label: "DHT22" },
                  { id: "esp", label: "ESP32" },
                  { id: "bz1", label: "Buzzer" },
                  { id: "leds", label: "3x LED" },
                ].map((chip) => {
                  const selected = selectedPart === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() =>
                        setSelectedPart(selected ? null : chip.id)
                      }
                      className={`border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                        selected
                          ? "border-agri-emeraldLight bg-agri-primary text-white"
                          : "border-agri-bg/20 bg-transparent text-agri-bg/75 hover:border-agri-bg/45 hover:text-white"
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
                {selectedPart && (
                  <button
                    type="button"
                    onClick={() => setSelectedPart(null)}
                    className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[11px] text-agri-amberLight hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Quiet Physical LED Status Strip */}
            <div className="flex items-center gap-3 border border-agri-bg/15 bg-[#121A14] px-3 py-1.5 font-mono text-[11px]">
              <span className="flex items-center gap-1.5" aria-hidden="true">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isGreenOn ? "bg-[#4AC276]" : "bg-[#24382A]"
                  }`}
                />
                <span
                  className={`h-2 w-2 rounded-full ${
                    isYellowOn ? "bg-[#E2B245]" : "bg-[#3C341E]"
                  }`}
                />
                <span
                  className={`h-2 w-2 rounded-full ${
                    isRedOn ? "bg-[#DE5B4E]" : "bg-[#3E2421]"
                  }`}
                />
              </span>
              <span className="text-agri-bg/90">
                {liveState.hardwareClass}
              </span>
              <span className="text-agri-bg/35">·</span>
              <span className="text-agri-emeraldLight">
                {liveState.recommendation}
              </span>
            </div>
          </div>

          {/* Forest-Charcoal ESD Mat Canvas */}
          <div className="overflow-x-auto bg-[#121914] p-3 sm:p-5">
            <svg
              viewBox="0 0 960 565"
              className="h-auto w-full min-w-[740px] select-none border border-agri-bg/10"
              style={{
                backgroundColor: "#141C16",
                backgroundImage:
                  "radial-gradient(#27362B 1.15px, transparent 1.15px)",
                backgroundSize: "18px 18px",
              }}
              role="img"
              aria-label="Diagram Rangkaian Interaktif Wokwi Probe Pemantau Limbah Glagah ESP32"
            >
              <defs>
                <linearGradient id="metalShield" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#D3D8D1" />
                  <stop offset="50%" stopColor="#A0AA9F" />
                  <stop offset="100%" stopColor="#727C72" />
                </linearGradient>
                <linearGradient id="probeTip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E4E7E1" />
                  <stop offset="100%" stopColor="#7D877D" />
                </linearGradient>
                <filter
                  id="glowGreen"
                  x="-60%"
                  y="-60%"
                  width="220%"
                  height="220%"
                >
                  <feGaussianBlur stdDeviation="4.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter
                  id="glowYellow"
                  x="-60%"
                  y="-60%"
                  width="220%"
                  height="220%"
                >
                  <feGaussianBlur stdDeviation="4.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter
                  id="glowRed"
                  x="-60%"
                  y="-60%"
                  width="220%"
                  height="220%"
                >
                  <feGaussianBlur stdDeviation="4.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Architectural Drafting Zone Hairlines */}
              <g>
                <rect
                  x="22"
                  y="14"
                  width="285"
                  height="422"
                  fill="#1A251D"
                  fillOpacity="0.28"
                  stroke="#2B3B30"
                  strokeWidth="1"
                />
                <text
                  x="34"
                  y="32"
                  fill="#7D9181"
                  fontSize="9.5"
                  fontFamily={MONO_FONT}
                  fontWeight="600"
                  letterSpacing="1.2"
                >
                  01 // INPUT SENSOR PROBE
                </text>

                <rect
                  x="622"
                  y="14"
                  width="318"
                  height="422"
                  fill="#1A251D"
                  fillOpacity="0.28"
                  stroke="#2B3B30"
                  strokeWidth="1"
                />
                <text
                  x="634"
                  y="32"
                  fill="#7D9181"
                  fontSize="9.5"
                  fontFamily={MONO_FONT}
                  fontWeight="600"
                  letterSpacing="1.2"
                >
                  03 // INDIKATOR LOKAL (OFFLINE)
                </text>

                <text
                  x="480"
                  y="32"
                  textAnchor="middle"
                  fill="#7D9181"
                  fontSize="9.5"
                  fontFamily={MONO_FONT}
                  fontWeight="600"
                  letterSpacing="1.2"
                >
                  02 // EDGE MCU
                </text>
              </g>

              {/* ==================== WIRING LAYER (EXACT DIAGRAM.JSON CONNECTIONS) ==================== */}
              <g
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.8"
              >
                {/* 1. 3V3 RED POWER BUS */}
                <g opacity={wireOpacity(["dht1", "temp1", "rpull"])}>
                  <path
                    d="M 398 128 L 320 128 L 320 75 L 154 75"
                    stroke="#D1493E"
                  />
                  <path
                    d="M 320 128 L 320 278 L 207 278 L 207 255"
                    stroke="#D1493E"
                  />
                  <path
                    d="M 207 278 L 116 278 L 116 255"
                    stroke="#D1493E"
                  />
                  <circle cx="320" cy="128" r="3.5" fill="#D1493E" />
                  <circle cx="207" cy="278" r="3.5" fill="#D1493E" />
                </g>

                {/* 2. GND.1 SENSOR GROUND BUS */}
                <g opacity={wireOpacity(["dht1", "temp1"])}>
                  <path
                    d="M 398 355.5 L 267 355.5 L 267 255"
                    stroke="#637067"
                    strokeWidth="3.2"
                  />
                  <path
                    d="M 267 355.5 L 72 355.5 L 72 255"
                    stroke="#637067"
                    strokeWidth="3.2"
                  />
                  <circle cx="267" cy="355.5" r="3.5" fill="#829187" />
                </g>

                {/* 3. DS18B20 DQ + PULLUP 4.7kΩ -> esp:4 */}
                <g opacity={wireOpacity(["temp1", "rpull"])}>
                  <path
                    d="M 86 75 L 42 75 L 42 298 L 94 298"
                    stroke="#D4A039"
                  />
                  <path
                    d="M 94 255 L 94 298 L 160 298 L 160 44 L 606 44 L 606 338 L 562 338"
                    stroke="#44A66B"
                  />
                  <circle cx="94" cy="298" r="3.5" fill="#D4A039" />
                </g>

                {/* 4. DHT22 SDA -> esp:15 */}
                <g opacity={wireOpacity(["dht1"])}>
                  <path
                    d="M 227 255 L 227 316 L 302 316 L 302 58 L 592 58 L 592 390.5 L 562 390.5"
                    stroke="#64BA84"
                  />
                </g>

                {/* 5. GND.2 ACTUATOR GROUND BUS */}
                <g opacity={wireOpacity(["bz1", "leds"])}>
                  <path
                    d="M 562 128 L 912 128"
                    stroke="#637067"
                    strokeWidth="3.2"
                  />
                  <path
                    d="M 668 128 L 668 225"
                    stroke="#637067"
                    strokeWidth="3.2"
                  />
                  <path
                    d="M 762 128 L 762 285 L 748 285"
                    stroke="#637067"
                    strokeWidth="3.2"
                  />
                  <path
                    d="M 837 128 L 837 285 L 823 285"
                    stroke="#637067"
                    strokeWidth="3.2"
                  />
                  <path
                    d="M 912 128 L 912 285 L 898 285"
                    stroke="#637067"
                    strokeWidth="3.2"
                  />
                  <circle cx="668" cy="128" r="3.5" fill="#829187" />
                  <circle cx="762" cy="128" r="3.5" fill="#829187" />
                  <circle cx="837" cy="128" r="3.5" fill="#829187" />
                </g>

                {/* 6. BUZZER SIGNAL (GPIO 14) */}
                <g opacity={wireOpacity(["bz1"])}>
                  <path
                    d="M 398 320.5 L 366 320.5 L 366 484 L 668 484 L 668 305"
                    stroke="#C26DBC"
                  />
                </g>

                {/* 7. LED 3 MERAH (GPIO 27) */}
                <g opacity={wireOpacity(["leds"])}>
                  <path
                    d="M 398 303 L 352 303 L 352 500 L 882 500 L 882 385"
                    stroke="#D1493E"
                  />
                  <path d="M 882 325 L 882 285" stroke="#D1493E" />
                </g>

                {/* 8. LED 2 KUNING (GPIO 26) */}
                <g opacity={wireOpacity(["leds"])}>
                  <path
                    d="M 398 285.5 L 338 285.5 L 338 516 L 807 516 L 807 385"
                    stroke="#D4A039"
                  />
                  <path d="M 807 325 L 807 285" stroke="#D4A039" />
                </g>

                {/* 9. LED 1 HIJAU (GPIO 25) */}
                <g opacity={wireOpacity(["leds"])}>
                  <path
                    d="M 398 268 L 324 268 L 324 532 L 732 532 L 732 385"
                    stroke="#44A66B"
                  />
                  <path d="M 732 325 L 732 285" stroke="#44A66B" />
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
                  stroke="#9BA89E"
                  strokeWidth="2.8"
                />
                <rect
                  x="96"
                  y="66"
                  width="48"
                  height="18"
                  rx="4"
                  fill="#D2B486"
                  stroke={selectedPart === "rpull" ? "#BFD9B7" : "#7A5D35"}
                  strokeWidth={selectedPart === "rpull" ? "2.4" : "1.4"}
                />
                <rect x="104" y="66.5" width="5" height="17" fill="#E8C23B" />
                <rect x="114" y="66.5" width="5" height="17" fill="#7D369E" />
                <rect x="124" y="66.5" width="5" height="17" fill="#C93B32" />
                <rect x="135" y="66.5" width="4" height="17" fill="#C28127" />
                <text
                  x="120"
                  y="58"
                  textAnchor="middle"
                  fill="#EBC9A8"
                  fontSize="9.5"
                  fontFamily={MONO_FONT}
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
                <rect
                  x="62"
                  y="112"
                  width="64"
                  height="118"
                  rx="4"
                  fill="#1C2720"
                  stroke={selectedPart === "temp1" ? "#BFD9B7" : "#4A5C4F"}
                  strokeWidth={selectedPart === "temp1" ? "2.4" : "1.4"}
                />
                <rect
                  x="84"
                  y="122"
                  width="20"
                  height="52"
                  rx="6"
                  fill="url(#probeTip)"
                  stroke="#4B5B50"
                />
                <rect x="86" y="168" width="16" height="14" fill="#101812" />
                <text
                  x="94"
                  y="198"
                  textAnchor="middle"
                  fill="#F4F0E8"
                  fontSize="9.5"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                >
                  DS18B20
                </text>
                <text
                  x="94"
                  y="211"
                  textAnchor="middle"
                  fill={liveState.highTempWarning ? "#EB8F78" : "#BFD9B7"}
                  fontSize="9.5"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                >
                  {liveState.coreTemp.toFixed(1)}°C
                </text>
                <text
                  x="94"
                  y="223"
                  textAnchor="middle"
                  fill="#8FA093"
                  fontSize="7.5"
                >
                  Inti tumpukan
                </text>
                <line
                  x1="72"
                  y1="230"
                  x2="72"
                  y2="255"
                  stroke="#C4CEC6"
                  strokeWidth="2.4"
                />
                <line
                  x1="94"
                  y1="230"
                  x2="94"
                  y2="255"
                  stroke="#C4CEC6"
                  strokeWidth="2.4"
                />
                <line
                  x1="116"
                  y1="230"
                  x2="116"
                  y2="255"
                  stroke="#C4CEC6"
                  strokeWidth="2.4"
                />
                <text
                  x="72"
                  y="244"
                  textAnchor="end"
                  dx="-4"
                  fill="#8FA093"
                  fontSize="7.5"
                  fontFamily={MONO_FONT}
                >
                  GND
                </text>
                <text
                  x="94"
                  y="246"
                  textAnchor="middle"
                  fill="#7AD198"
                  fontSize="7.5"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                >
                  DQ
                </text>
                <text
                  x="116"
                  y="244"
                  textAnchor="start"
                  dx="4"
                  fill="#E47E75"
                  fontSize="7.5"
                  fontFamily={MONO_FONT}
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
                <path
                  d="M 218 112 L 256 112 L 256 126 L 218 126 Z"
                  fill="#E4DEC9"
                  stroke="#9C9685"
                />
                <circle cx="237" cy="119" r="3.5" fill="#141C16" />
                <rect
                  x="192"
                  y="125"
                  width="90"
                  height="105"
                  rx="3"
                  fill="#F4F0E8"
                  stroke={selectedPart === "dht1" ? "#6C9A72" : "#9C9685"}
                  strokeWidth={selectedPart === "dht1" ? "2.6" : "1.4"}
                />
                <g fill="#CCC5B4">
                  {[0, 1, 2, 3, 4].map((row) =>
                    [0, 1, 2, 3, 4].map((col) => (
                      <rect
                        key={`${row}-${col}`}
                        x={204 + col * 14}
                        y={135 + row * 10}
                        width="9"
                        height="6"
                        rx="0.8"
                      />
                    ))
                  )}
                </g>
                <text
                  x="237"
                  y="198"
                  textAnchor="middle"
                  fill="#1E2A21"
                  fontSize="10.5"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                >
                  DHT22
                </text>
                <text
                  x="237"
                  y="212"
                  textAnchor="middle"
                  fill="#24523A"
                  fontSize="8.8"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                >
                  {liveState.ambientTemp.toFixed(1)}°C |{" "}
                  {Math.round(liveState.ambientHum)}% RH
                </text>
                <text
                  x="237"
                  y="223"
                  textAnchor="middle"
                  fill="#6B7169"
                  fontSize="7.5"
                >
                  Udara kepala alat
                </text>
                {[207, 227, 247, 267].map((px, idx) => (
                  <line
                    key={idx}
                    x1={px}
                    y1="230"
                    x2={px}
                    y2="255"
                    stroke="#C4CEC6"
                    strokeWidth="2.4"
                  />
                ))}
                <text
                  x="207"
                  y="246"
                  textAnchor="end"
                  dx="-3"
                  fill="#E47E75"
                  fontSize="7.5"
                  fontFamily={MONO_FONT}
                >
                  VCC
                </text>
                <text
                  x="227"
                  y="246"
                  textAnchor="middle"
                  fill="#7AD198"
                  fontSize="7.5"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                >
                  SDA
                </text>
                <text
                  x="247"
                  y="246"
                  textAnchor="middle"
                  fill="#7A8B7E"
                  fontSize="7.5"
                  fontFamily={MONO_FONT}
                >
                  NC
                </text>
                <text
                  x="267"
                  y="246"
                  textAnchor="start"
                  dx="3"
                  fill="#8FA093"
                  fontSize="7.5"
                  fontFamily={MONO_FONT}
                >
                  GND
                </text>
              </g>

              {/* Live Delta T Drafting Stamp under sensors */}
              <g>
                <rect
                  x="42"
                  y="378"
                  width="244"
                  height="42"
                  fill="#101712"
                  stroke="#2D3E32"
                  strokeWidth="1"
                />
                <text
                  x="54"
                  y="395"
                  fill="#8FA093"
                  fontSize="9"
                  fontFamily={MONO_FONT}
                >
                  ΔT = T_tumpuk − T_udara
                </text>
                <text
                  x="54"
                  y="412"
                  fill={liveState.delta >= 5 ? "#E48D6D" : "#BFD9B7"}
                  fontSize="11"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                >
                  {liveState.delta >= 0 ? "+" : ""}
                  {liveState.delta.toFixed(1)}°C · SKOR EDGE {liveState.score}/3
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
                <rect
                  x="390"
                  y="75"
                  width="180"
                  height="390"
                  rx="4"
                  fill="#1B251E"
                  stroke={selectedPart === "esp" ? "#BFD9B7" : "#4A5C4F"}
                  strokeWidth={selectedPart === "esp" ? "2.4" : "1.8"}
                />
                <path
                  d="M 442 98 L 442 84 L 452 84 L 452 94 L 462 94 L 462 84 L 472 84 L 472 94 L 482 94 L 482 84 L 492 84 L 492 94 L 502 94 L 502 84 L 516 84 L 516 98"
                  fill="none"
                  stroke="#C99A3B"
                  strokeWidth="1.9"
                  opacity="0.85"
                />
                <rect
                  x="426"
                  y="108"
                  width="108"
                  height="110"
                  rx="2"
                  fill="url(#metalShield)"
                  stroke="#4B5B50"
                  strokeWidth="1.4"
                />
                <text
                  x="480"
                  y="150"
                  textAnchor="middle"
                  fill="#141C16"
                  fontSize="10.5"
                  fontFamily={MONO_FONT}
                  fontWeight="800"
                >
                  ESP-WROOM-32
                </text>
                <text
                  x="480"
                  y="165"
                  textAnchor="middle"
                  fill="#243127"
                  fontSize="8"
                  fontFamily={MONO_FONT}
                  fontWeight="600"
                >
                  Wi-Fi · BLE · 240MHz
                </text>
                <text
                  x="480"
                  y="180"
                  textAnchor="middle"
                  fill="#37473B"
                  fontSize="7.5"
                  fontFamily={MONO_FONT}
                >
                  DevKit-C v4
                </text>
                <rect
                  x="466"
                  y="246"
                  width="28"
                  height="28"
                  rx="1"
                  fill="#101712"
                  stroke="#36473B"
                />
                <text
                  x="480"
                  y="263"
                  textAnchor="middle"
                  fill="#7D9181"
                  fontSize="6.5"
                  fontFamily={MONO_FONT}
                >
                  CP2102
                </text>
                <text
                  x="480"
                  y="310"
                  textAnchor="middle"
                  fill="#C4CEC6"
                  fontSize="8.5"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                  letterSpacing="1"
                >
                  GLAGAHSMART
                </text>
                <text
                  x="480"
                  y="323"
                  textAnchor="middle"
                  fill="#6C9A72"
                  fontSize="7.5"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                >
                  PROBE NODE
                </text>

                <rect
                  x="430"
                  y="404"
                  width="24"
                  height="16"
                  rx="1.5"
                  fill="#D3D8D1"
                  stroke="#4B5B50"
                />
                <circle cx="442" cy="412" r="4" fill="#324036" />
                <text
                  x="442"
                  y="431"
                  textAnchor="middle"
                  fill="#8FA093"
                  fontSize="7"
                  fontFamily={MONO_FONT}
                >
                  EN
                </text>

                <rect
                  x="506"
                  y="404"
                  width="24"
                  height="16"
                  rx="1.5"
                  fill="#D3D8D1"
                  stroke="#4B5B50"
                />
                <circle cx="518" cy="412" r="4" fill="#324036" />
                <text
                  x="518"
                  y="431"
                  textAnchor="middle"
                  fill="#8FA093"
                  fontSize="7"
                  fontFamily={MONO_FONT}
                >
                  BOOT
                </text>

                <circle cx="456" cy="442" r="3" fill="#D1493E" />
                <rect
                  x="462"
                  y="447"
                  width="36"
                  height="22"
                  rx="1.5"
                  fill="#9BA89E"
                  stroke="#4B5B50"
                />
                <text
                  x="480"
                  y="461"
                  textAnchor="middle"
                  fill="#141C16"
                  fontSize="7"
                  fontFamily={MONO_FONT}
                  fontWeight="800"
                >
                  USB
                </text>

                {LEFT_PINS.map((pin, idx) => {
                  const py = 128 + idx * 17.5;
                  return (
                    <g key={`L-${idx}`}>
                      <circle
                        cx="398"
                        cy={py}
                        r={pin.active ? "4" : "2.8"}
                        fill={pin.active ? pin.color : "#313F35"}
                        stroke={pin.active ? "#F4F0E8" : "#5B6D60"}
                        strokeWidth={pin.active ? "1.2" : "1"}
                      />
                      <text
                        x="408"
                        y={py + 3}
                        fill={pin.active ? "#F4F0E8" : "#6F8073"}
                        fontSize="8"
                        fontFamily={MONO_FONT}
                        fontWeight={pin.active ? "700" : "500"}
                      >
                        {pin.label}
                      </text>
                    </g>
                  );
                })}

                {RIGHT_PINS.map((pin, idx) => {
                  const py = 128 + idx * 17.5;
                  return (
                    <g key={`R-${idx}`}>
                      <circle
                        cx="562"
                        cy={py}
                        r={pin.active ? "4" : "2.8"}
                        fill={pin.active ? pin.color : "#313F35"}
                        stroke={pin.active ? "#F4F0E8" : "#5B6D60"}
                        strokeWidth={pin.active ? "1.2" : "1"}
                      />
                      <text
                        x="552"
                        y={py + 3}
                        textAnchor="end"
                        fill={pin.active ? "#F4F0E8" : "#6F8073"}
                        fontSize="8"
                        fontFamily={MONO_FONT}
                        fontWeight={pin.active ? "700" : "500"}
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
                {isBuzzerAlert && (
                  <g>
                    <circle
                      cx="668"
                      cy="265"
                      r="39"
                      fill="none"
                      stroke="#E48D6D"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    <circle
                      cx="668"
                      cy="265"
                      r="46"
                      fill="none"
                      stroke="#E48D6D"
                      strokeWidth="1"
                      opacity="0.55"
                      strokeDasharray="3 4"
                    />
                  </g>
                )}
                <line
                  x1="668"
                  y1="225"
                  x2="668"
                  y2="235"
                  stroke="#C4CEC6"
                  strokeWidth="2.8"
                />
                <line
                  x1="668"
                  y1="295"
                  x2="668"
                  y2="305"
                  stroke="#C4CEC6"
                  strokeWidth="2.8"
                />
                <circle
                  cx="668"
                  cy="265"
                  r="31"
                  fill="#101712"
                  stroke={
                    isBuzzerAlert
                      ? "#E48D6D"
                      : selectedPart === "bz1"
                      ? "#BFD9B7"
                      : "#4B5B50"
                  }
                  strokeWidth={
                    isBuzzerAlert || selectedPart === "bz1" ? "2.6" : "1.8"
                  }
                />
                <circle
                  cx="668"
                  cy="265"
                  r="11"
                  fill="#2C3A30"
                  stroke="#5F7064"
                  strokeWidth="1.4"
                />
                <circle cx="668" cy="265" r="4" fill="#0B100C" />
                <text
                  x="668"
                  y="246"
                  textAnchor="middle"
                  fill="#8FA093"
                  fontSize="9"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                >
                  −
                </text>
                <text
                  x="668"
                  y="290"
                  textAnchor="middle"
                  fill="#D694D1"
                  fontSize="10"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                >
                  +
                </text>
                <text
                  x="668"
                  y="322"
                  textAnchor="middle"
                  fill="#F4F0E8"
                  fontSize="9.5"
                  fontFamily={MONO_FONT}
                  fontWeight="700"
                >
                  Buzzer
                </text>
                <text
                  x="668"
                  y="334"
                  textAnchor="middle"
                  fill={isBuzzerAlert ? "#E48D6D" : "#8FA093"}
                  fontSize="8"
                  fontFamily={MONO_FONT}
                  fontWeight={isBuzzerAlert ? "700" : "500"}
                >
                  {isBuzzerAlert ? "ALARM ≥60°C" : "GPIO 14"}
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
                    onFill: "#46B871",
                    offFill: "#1A3D28",
                    stroke: "#6CC98E",
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
                    onFill: "#E0AE3B",
                    offFill: "#4F3B15",
                    stroke: "#EBC86E",
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
                    onFill: "#DC5548",
                    offFill: "#52211C",
                    stroke: "#E88278",
                    filter: "url(#glowRed)",
                    rLabel: "R3",
                  },
                ].map((led) => (
                  <g key={led.name}>
                    <text
                      x={led.cx}
                      y="186"
                      textAnchor="middle"
                      fill={led.isOn ? "#F4F0E8" : "#8FA093"}
                      fontSize="9"
                      fontFamily={MONO_FONT}
                      fontWeight="700"
                    >
                      {led.name}
                    </text>
                    <text
                      x={led.cx}
                      y="198"
                      textAnchor="middle"
                      fill="#738477"
                      fontSize="7.5"
                    >
                      {led.sub}
                    </text>

                    {led.isOn && (
                      <circle
                        cx={led.cx}
                        cy="238"
                        r="20"
                        fill={led.onFill}
                        opacity="0.22"
                        filter={led.filter}
                      />
                    )}

                    <line
                      x1={led.ax}
                      y1="262"
                      x2={led.ax}
                      y2="285"
                      stroke="#C4CEC6"
                      strokeWidth="2.4"
                    />
                    <line
                      x1={led.kx}
                      y1="262"
                      x2={led.kx}
                      y2="285"
                      stroke="#C4CEC6"
                      strokeWidth="2.4"
                    />

                    <path
                      d={`M ${led.cx - 14} 256 L ${led.cx - 14} 236 A 14 14 0 0 1 ${
                        led.cx + 14
                      } 236 L ${led.cx + 14} 256 Z`}
                      fill={led.isOn ? led.onFill : led.offFill}
                      stroke={led.isOn ? "#F4F0E8" : led.stroke}
                      strokeWidth={led.isOn ? "1.8" : "1.1"}
                      filter={led.isOn ? led.filter : undefined}
                    />
                    <rect
                      x={led.cx - 17}
                      y="255"
                      width="34"
                      height="7"
                      rx="1.5"
                      fill={led.isOn ? led.onFill : led.offFill}
                      stroke={led.stroke}
                      strokeWidth="1"
                    />
                    <ellipse
                      cx={led.cx - 5}
                      cy="233"
                      rx="2.6"
                      ry="5.5"
                      fill="#FFFFFF"
                      opacity={led.isOn ? "0.55" : "0.18"}
                    />

                    <line
                      x1={led.ax}
                      y1="315"
                      x2={led.ax}
                      y2="390"
                      stroke="#9BA89E"
                      strokeWidth="2.4"
                    />
                    <rect
                      x={led.ax - 8}
                      y="328"
                      width="16"
                      height="44"
                      rx="3"
                      fill="#D2B486"
                      stroke={selectedPart === "leds" ? "#BFD9B7" : "#7A5D35"}
                      strokeWidth="1.3"
                    />
                    <rect
                      x={led.ax - 7.5}
                      y="335"
                      width="15"
                      height="4.5"
                      fill="#DF7433"
                    />
                    <rect
                      x={led.ax - 7.5}
                      y="343"
                      width="15"
                      height="4.5"
                      fill="#DF7433"
                    />
                    <rect
                      x={led.ax - 7.5}
                      y="351"
                      width="15"
                      height="4.5"
                      fill="#6F3716"
                    />
                    <rect
                      x={led.ax - 7.5}
                      y="361"
                      width="15"
                      height="3.5"
                      fill="#C28127"
                    />

                    <text
                      x={led.ax + 12}
                      y="350"
                      fill="#D3DCD5"
                      fontSize="8.5"
                      fontFamily={MONO_FONT}
                      fontWeight="700"
                    >
                      {led.rLabel}
                    </text>
                    <text
                      x={led.ax + 12}
                      y="361"
                      fill="#8FA093"
                      fontSize="7.5"
                      fontFamily={MONO_FONT}
                    >
                      330Ω
                    </text>
                  </g>
                ))}

                <rect
                  x="706"
                  y="398"
                  width="220"
                  height="24"
                  fill="#101712"
                  stroke="#2D3E32"
                  strokeWidth="1"
                />
                <text
                  x="816"
                  y="413"
                  textAnchor="middle"
                  fill="#8FA093"
                  fontSize="8"
                  fontFamily={MONO_FONT}
                >
                  GPIO 25 (Hijau) · 26 (Kuning) · 27 (Merah)
                </text>
              </g>
            </svg>
          </div>

          {/* Datasheet Inspector Drawer (Warm Paper, Zero Floating Neon Cards) */}
          <div className="border-t border-agri-ink/20 bg-[#FBF9F4] px-5 py-4 sm:px-6">
            {selectedSpec ? (
              <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-agri-clay">
                      {selectedSpec.category}
                    </span>
                    <span className="border border-agri-primary/20 bg-agri-bg px-2.5 py-0.5 font-mono text-[11px] font-semibold text-agri-primary">
                      {selectedSpec.voltage}
                    </span>
                  </div>
                  <h3 className="display-serif text-2xl leading-tight text-agri-ink">
                    {selectedSpec.name}
                  </h3>
                  <p className="text-xs leading-6 text-agri-muted sm:text-sm">
                    {selectedSpec.description}
                  </p>
                </div>

                <div className="grid gap-3 border-t border-agri-primary/15 pt-3 text-xs lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-agri-muted">
                      Koneksi Pin ESP32
                    </span>
                    <strong className="mt-0.5 block font-mono text-agri-ink">
                      {selectedSpec.espPins}
                    </strong>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-agri-muted">
                      Catatan Firmware
                    </span>
                    <p className="mt-0.5 leading-5 text-agri-primary">
                      {selectedSpec.firmwareNote}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs leading-6 text-agri-muted">
                Pilih salah satu komponen pada papan skematik —{" "}
                <strong className="text-agri-ink">DS18B20</strong>,{" "}
                <strong className="text-agri-ink">DHT22</strong>,{" "}
                <strong className="text-agri-ink">R_pull 4.7kΩ</strong>,{" "}
                <strong className="text-agri-ink">ESP32</strong>,{" "}
                <strong className="text-agri-ink">Buzzer</strong>, atau{" "}
                <strong className="text-agri-ink">3x LED</strong> — untuk
                menyorot jalur kabel dan membaca lembar spesifikasinya.
              </p>
            )}
          </div>

          {/* Minimalist Serial Monitor & MQTT Log */}
          <div className="border-t border-agri-ink/20 bg-[#121914] px-5 py-3.5 font-mono text-[11px] text-[#C8D4C5] sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-agri-bg/10 pb-2 text-[10px] uppercase tracking-[0.12em] text-agri-bg/55">
              <span>SERIAL 115200 BAUD · OUTPUT SIMULASI FIRMWARE</span>
              <span>
                broker.hivemq.com:1883 · idtc2026/glagah/{nodeId}/data
              </span>
            </div>
            <div className="mt-2.5 space-y-1.5 overflow-x-auto whitespace-nowrap">
              <div className="text-[#BFD9B7]">
                Tumpuk={liveState.coreTemp.toFixed(1)}C Udara=
                {liveState.ambientTemp.toFixed(1)}C Hum=
                {Math.round(liveState.ambientHum)}% Delta=
                {liveState.delta.toFixed(1)} Tren=
                {liveState.trend >= 0 ? "+" : ""}
                {liveState.trend.toFixed(1)} Skor={liveState.score} Kelas=
                {liveState.hardwareClass} | Wi-Fi:ya MQTT:ya
              </div>
              {isBuzzerAlert && (
                <div className="flex items-center gap-1.5 font-semibold text-[#E89B7C]">
                  <Volume2 className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    [ALARM] suhu tumpukan tinggi (&ge;60.0C) — periksa tumpukan
                    [Buzzer 2x 400ms]
                  </span>
                </div>
              )}
              <div className="text-agri-bg/65">
                [MQTT] kirim OK: {mqttJson}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE WOKWI EMBED SIMULATOR */}
      {activeTab === "live" && (
        <div className="bg-[#121914]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-agri-bg/10 bg-[#17211A] px-5 py-3 text-xs text-agri-bg/85 sm:px-6">
            <span>
              Tekan <strong className="text-white">Start Simulation (▶)</strong>{" "}
              pada jendela Wokwi, lalu klik sensor{" "}
              <strong className="text-white">DHT22</strong> atau{" "}
              <strong className="text-white">DS18B20</strong> untuk mengubah
              pembacaan secara langsung.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEmbedKey((k) => k + 1)}
                className="inline-flex min-h-9 items-center gap-1.5 border border-agri-bg/25 px-3 text-xs font-semibold text-agri-bg hover:bg-agri-bg/10"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Muat ulang</span>
              </button>
              <a
                href={WOKWI_PROJECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1.5 bg-agri-bg px-3 text-xs font-bold text-agri-ink hover:bg-white"
              >
                <span>Buka di Wokwi.com</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="relative h-[580px] w-full bg-[#141C16] sm:h-[640px]">
            <iframe
              key={embedKey}
              src={`${WOKWI_PROJECT_URL}?embed=1`}
              title="Wokwi ESP32 Probe Pemantau Limbah Glagah Simulator"
              className="h-full w-full border-0"
              allow="clipboard-write"
              loading="lazy"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-agri-bg/10 bg-[#17211A] px-5 py-3 text-[11px] text-agri-bg/65 sm:px-6">
            <span>
              Bila jaringan memblokir iframe Wokwi, buka tautan langsung atau
              gunakan tab <strong className="text-agri-bg">Skematik</strong>{" "}
              yang berjalan 100% lokal.
            </span>
            <span className="font-mono">{WOKWI_PROJECT_URL}</span>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETE PINOUT TABLE & BILL OF MATERIALS */}
      {activeTab === "pinout" && (
        <div className="space-y-6 bg-[#FBF9F4] p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-agri-primary/15 pb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-agri-clay">
                Daftar kabel & pin · simulation/diagram.json
              </p>
              <h3 className="display-serif mt-1 text-2xl text-agri-ink">
                Referensi Perakitan Fisik ESP32 DevKit-C v4
              </h3>
            </div>
            <a
              href={WOKWI_PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 border border-agri-primary/30 bg-white px-3 text-xs font-bold text-agri-primary hover:bg-agri-bg"
            >
              <span>Buka proyek Wokwi</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto border-y border-agri-ink/20">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-agri-ink/20 bg-agri-bg/70 font-mono text-[10px] uppercase tracking-[0.12em] text-agri-muted">
                  <th className="px-3 py-3 font-bold">Komponen</th>
                  <th className="px-3 py-3 font-bold">Pin Komponen</th>
                  <th className="px-3 py-3 font-bold">Pin ESP32</th>
                  <th className="px-3 py-3 font-bold">Kabel</th>
                  <th className="px-3 py-3 font-bold">Sinyal</th>
                  <th className="px-3 py-3 font-bold">Fungsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-agri-primary/15">
                {WIRING_TABLE.map((row, idx) => (
                  <tr
                    key={idx}
                    className="transition-colors hover:bg-agri-bg/50"
                  >
                    <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-agri-ink">
                      {row.component}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-agri-muted">
                      {row.compPin}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono font-bold text-agri-primary">
                      {row.espPin}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 border border-agri-ink/30"
                          style={{ backgroundColor: row.colorHex }}
                        />
                        <span className="text-agri-ink">{row.colorName}</span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-agri-muted">
                      {row.signal}
                    </td>
                    <td className="px-3 py-2.5 text-agri-muted">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 border border-agri-primary/20 bg-white/70 p-4">
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-agri-ink">
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
                    className="border border-agri-primary/20 bg-agri-bg px-2.5 py-1 font-mono text-[11px] text-agri-ink"
                  >
                    {lib}
                  </span>
                ))}
              </div>
            </div>

            <div className="dossier-note space-y-2 p-4">
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-agri-clay">
                Ambang Keputusan Edge (Asumsi Awal Firmware)
              </h4>
              <ul className="space-y-1 text-xs leading-5 text-agri-ink">
                <li>
                  <strong>ΔT Aktif &ge; 5.0°C</strong>,{" "}
                  <strong>RH Tinggi &ge; 80%</strong>,{" "}
                  <strong>Tren Naik &ge; +1.0°C/siklus</strong> (+1 skor per
                  syarat).
                </li>
                <li>
                  <strong>Skor &ge; 2</strong> → LED Merah (Aktif/Lembap →
                  Pupuk/Kompos).
                </li>
                <li>
                  <strong>Skor 0, ΔT &le; 2.0°C, RH &le; 55%</strong> → LED
                  Hijau (Kering → Benih/Briket).
                </li>
                <li>
                  <strong>T_tumpuk &ge; 60.0°C</strong> → Alarm Buzzer
                  (overheating tumpukan).
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
