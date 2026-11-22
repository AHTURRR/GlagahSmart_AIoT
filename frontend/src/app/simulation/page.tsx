"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Cpu,
  Thermometer,
  Droplets,
  Flame,
  Activity,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  Volume2,
  Gauge,
} from "lucide-react";
import { TelemetryData, PresetSample } from "@/lib/types";
import { BACKEND_URL } from "@/lib/utils";
import WokwiCircuitView, {
  WokwiLiveState,
} from "@/components/simulation/WokwiCircuitView";

// Fallback preset jika backend sedang offline agar demonstrasi tetap berjalan mulus
const FALLBACK_PRESETS: PresetSample[] = [
  {
    id: "preset-briquette-purbalingga",
    title: "Residu Serbuk Rontokan Kering - Bojongsari, Purbalingga",
    origin: "Sentra Pengrajin Sapu Bojongsari, Purbalingga",
    target_hypothesis: "CENDERUNG KERING → Briket Biomassa / Benih (LED Hijau)",
    description:
      "Serbuk rontokan bunga hasil pemukulan sapu yang dijemur 10 hari. Suhu tumpukan mendekati suhu udara (ΔT rendah) dan udara kering.",
    ambient_temperature_c: 30.2,
    core_temperature_c: 31.4,
    ambient_humidity_rh: 52.0,
    sample_mass_g: 78.5,
    biomass_moisture_percent: 10.4,
    post_harvest_age_days: 10,
    seed_condition_score: 1,
  },
  {
    id: "preset-seed-pemalang",
    title: "Sampel Bunga Segar Pilihan - Belik, Pemalang",
    origin: "Kecamatan Belik, Kabupaten Pemalang",
    target_hypothesis: "TIDAK PASTI / CEK ULANG → Kandidat Benih Segar (LED Kuning)",
    description:
      "Bunga glagah segar dipanen 2 hari lalu dengan struktur malai dan biji utuh. ΔT rendah tetapi kelembapan udara sedang (72% RH) sehingga perlu verifikasi fisik benih.",
    ambient_temperature_c: 26.8,
    core_temperature_c: 28.4,
    ambient_humidity_rh: 72.0,
    sample_mass_g: 115.0,
    biomass_moisture_percent: 14.2,
    post_harvest_age_days: 2,
    seed_condition_score: 3,
  },
  {
    id: "preset-compost-bantarbolang",
    title: "Tumpukan Malai Basah Fermentasi - Bantarbolang, Pemalang",
    origin: "Area Penumpukan Bahan Bantarbolang, Pemalang",
    target_hypothesis: "AKTIF/LEMBAP → Pupuk Kompos Organik (LED Merah)",
    description:
      "Tumpukan residu sortasi terpapar kelembapan tinggi selama 25 hari. Aktivitas mikroba memicu pemanasan inti tumpukan (46.5°C, ΔT +20.5°C).",
    ambient_temperature_c: 26.0,
    core_temperature_c: 46.5,
    ambient_humidity_rh: 86.0,
    sample_mass_g: 210.0,
    biomass_moisture_percent: 41.5,
    post_harvest_age_days: 25,
    seed_condition_score: 1,
  },
];

// Evaluasi aturan inferensi lokal persis sesuai firmware simulation/sketch.ino
function evaluateEdgeFirmwareLogic(
  coreTemp: number,
  ambientTemp: number,
  ambientHum: number,
  trend: number = 0
): Omit<WokwiLiveState, "coreTemp" | "ambientTemp" | "ambientHum" | "nodeId"> {
  const delta = Number((coreTemp - ambientTemp).toFixed(1));
  let score = 0;
  if (delta >= 5.0) score += 1;
  if (ambientHum >= 80.0) score += 1;
  if (trend >= 1.0) score += 1;

  let hardwareClass: WokwiLiveState["hardwareClass"] = "TIDAK PASTI";
  let recommendation = "TAHAN, CEK ULANG";

  if (score >= 2) {
    hardwareClass = "AKTIF/LEMBAP";
    recommendation = "PUPUK / KOMPOS";
  } else if (score === 0 && delta <= 2.0 && ambientHum <= 55.0) {
    hardwareClass = "CENDERUNG KERING";
    recommendation = "BENIH / BRIKET";
  }

  return {
    delta,
    trend,
    score,
    hardwareClass,
    recommendation,
    highTempWarning: coreTemp >= 60.0,
  };
}

export default function SimulationPage() {
  const router = useRouter();
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [presets, setPresets] = useState<PresetSample[]>(FALLBACK_PRESETS);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [isSimulatingSending, setIsSimulatingSending] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(
    null
  );

  // Kontrol interaktif sensor (sinkron langsung ke visual Wokwi di atas)
  const [customCoreTemp, setCustomCoreTemp] = useState("57.8"); // DS18B20 default dari diagram.json
  const [customTemp, setCustomTemp] = useState("41.6"); // DHT22 default dari diagram.json
  const [customHumidity, setCustomHumidity] = useState("65.5"); // DHT22 default dari diagram.json
  const [customTrend, setCustomTrend] = useState("1.2"); // Tren perubahan ΔT
  const [customMass, setCustomMass] = useState("95.0");
  const [customMoisture, setCustomMoisture] = useState("38.5");

  // State reaktif langsung untuk WokwiCircuitView (berubah real-time saat slider digeser)
  const liveProbeState: WokwiLiveState = useMemo(() => {
    const cTemp = parseFloat(customCoreTemp) || 35.0;
    const aTemp = parseFloat(customTemp) || 28.5;
    const aHum = parseFloat(customHumidity) || 65.0;
    const tr = parseFloat(customTrend) || 0.0;
    const evaluated = evaluateEdgeFirmwareLogic(cTemp, aTemp, aHum, tr);
    return {
      coreTemp: cTemp,
      ambientTemp: aTemp,
      ambientHum: aHum,
      nodeId: telemetry?.node_id || "glagah-probe-01",
      ...evaluated,
    };
  }, [
    customCoreTemp,
    customTemp,
    customHumidity,
    customTrend,
    telemetry?.node_id,
  ]);

  // Fetch telemetry dari FastAPI backend
  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/telemetry/latest`);
      if (!res.ok)
        throw new Error("Gagal menghubungi endpoint backend telemetri");
      const data = await res.json();
      setBackendOnline(true);
      if (data.has_data && data.latest) {
        setTelemetry(data.latest);
      }
    } catch {
      setBackendOnline(false);
      setTelemetry((prev) =>
        prev || {
          node_id: "ESP32-GLAGAH-PROBE-01",
          location:
            "Sentra Kerajinan Sapu Bojongsari, Purbalingga (Local Mode)",
          ambient_temperature_c: parseFloat(customTemp),
          ambient_humidity_rh: parseFloat(customHumidity),
          core_temperature_c: parseFloat(customCoreTemp),
          delta_temperature_c: liveProbeState.delta,
          trend_c: liveProbeState.trend,
          score: liveProbeState.score,
          hardware_class: liveProbeState.hardwareClass,
          hardware_recommendation: liveProbeState.recommendation,
          high_temperature_warning: liveProbeState.highTempWarning,
          sample_mass_g: parseFloat(customMass),
          biomass_moisture_sim_percent: parseFloat(customMoisture),
          simulation_source: "Wokwi-ESP32-Probe (Local Interactive Simulation)",
          received_at: new Date().toLocaleTimeString("id-ID"),
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch presets
  const fetchPresets = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/telemetry/presets`);
      if (res.ok) {
        const data = await res.json();
        if (data.presets && data.presets.length > 0) {
          setPresets(data.presets);
        }
      }
    } catch {
      // Tetap gunakan FALLBACK_PRESETS
    }
  };

  useEffect(() => {
    fetchTelemetry();
    fetchPresets();
  }, []);

  // Handler kirim simulasi dari web ke backend FastAPI (dengan fallback lokal)
  const handleSimulatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulatingSending(true);
    setSendSuccessMessage(null);

    const payload = {
      id: "glagah-probe-01",
      node_id: "ESP32-GLAGAH-PROBE-01",
      location: "Unit Probe Pemantau Limbah Glagah (Wokwi)",
      tumpuk: liveProbeState.coreTemp,
      udara: liveProbeState.ambientTemp,
      hum: liveProbeState.ambientHum,
      delta: liveProbeState.delta,
      tren: liveProbeState.trend,
      skor: liveProbeState.score,
      kelas: liveProbeState.hardwareClass,
      rekomendasi: liveProbeState.recommendation,
      suhu_tinggi: liveProbeState.highTempWarning,
      ambient_temperature_c: liveProbeState.ambientTemp,
      ambient_humidity_rh: liveProbeState.ambientHum,
      core_temperature_c: liveProbeState.coreTemp,
      sample_mass_g: parseFloat(customMass),
      biomass_moisture_sim_percent: parseFloat(customMoisture),
      simulation_source: "Wokwi Probe Interactive Trigger",
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/telemetry/sample`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Backend tidak merespons");
      const resData = await res.json();
      setBackendOnline(true);
      setTelemetry(resData.sample);
      setSendSuccessMessage(
        "Payload probe ESP32 berhasil dikirim & disinkronkan ke backend FastAPI!"
      );
      setTimeout(() => setSendSuccessMessage(null), 4000);
    } catch {
      // Tetap perbarui state lokal secara mulus saat demo offline
      setBackendOnline(false);
      setTelemetry({
        node_id: payload.node_id,
        location: payload.location,
        ambient_temperature_c: payload.udara,
        ambient_humidity_rh: payload.hum,
        core_temperature_c: payload.tumpuk,
        delta_temperature_c: payload.delta,
        trend_c: payload.tren,
        score: payload.skor,
        hardware_class: payload.kelas,
        hardware_recommendation: payload.rekomendasi,
        high_temperature_warning: payload.suhu_tinggi,
        sample_mass_g: payload.sample_mass_g,
        biomass_moisture_sim_percent: payload.biomass_moisture_sim_percent,
        simulation_source: "Wokwi Probe Simulator (Offline Local Buffer)",
        received_at: new Date().toLocaleTimeString("id-ID"),
      });
      setSendSuccessMessage(
        "Buffer lokal diperbarui (mode offline tanpa backend)!"
      );
      setTimeout(() => setSendSuccessMessage(null), 4000);
    } finally {
      setIsSimulatingSending(false);
    }
  };

  // Handler pilih preset lapangan
  const handleSelectPreset = async (preset: PresetSample) => {
    const coreT = preset.core_temperature_c ?? preset.ambient_temperature_c + 2.0;
    const trendVal = coreT - preset.ambient_temperature_c >= 5.0 ? 1.2 : 0.0;
    const evaluated = evaluateEdgeFirmwareLogic(
      coreT,
      preset.ambient_temperature_c,
      preset.ambient_humidity_rh,
      trendVal
    );

    setCustomCoreTemp(coreT.toString());
    setCustomTemp(preset.ambient_temperature_c.toString());
    setCustomHumidity(preset.ambient_humidity_rh.toString());
    setCustomTrend(trendVal.toString());
    setCustomMass(preset.sample_mass_g.toString());
    setCustomMoisture(preset.biomass_moisture_percent.toString());

    const payload = {
      node_id: "ESP32-GLAGAH-PRESET",
      location: preset.origin,
      tumpuk: coreT,
      udara: preset.ambient_temperature_c,
      hum: preset.ambient_humidity_rh,
      delta: evaluated.delta,
      tren: trendVal,
      skor: evaluated.score,
      kelas: evaluated.hardwareClass,
      rekomendasi: evaluated.recommendation,
      suhu_tinggi: evaluated.highTempWarning,
      ambient_temperature_c: preset.ambient_temperature_c,
      ambient_humidity_rh: preset.ambient_humidity_rh,
      core_temperature_c: coreT,
      sample_mass_g: preset.sample_mass_g,
      biomass_moisture_sim_percent: preset.biomass_moisture_percent,
      simulation_source: `Preset: ${preset.title}`,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/telemetry/sample`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setBackendOnline(true);
        setTelemetry(data.sample);
        setSendSuccessMessage(`Preset "${preset.title}" aktif pada rangkaian & buffer!`);
        setTimeout(() => setSendSuccessMessage(null), 3500);
        return;
      }
    } catch {
      // Fallback ke state lokal
    }

    setTelemetry({
      node_id: payload.node_id,
      location: payload.location,
      ambient_temperature_c: payload.udara,
      ambient_humidity_rh: payload.hum,
      core_temperature_c: payload.tumpuk,
      delta_temperature_c: payload.delta,
      trend_c: payload.tren,
      score: payload.skor,
      hardware_class: payload.kelas,
      hardware_recommendation: payload.rekomendasi,
      high_temperature_warning: payload.suhu_tinggi,
      sample_mass_g: payload.sample_mass_g,
      biomass_moisture_sim_percent: payload.biomass_moisture_sim_percent,
      simulation_source: payload.simulation_source,
      received_at: new Date().toLocaleTimeString("id-ID"),
    });
    setSendSuccessMessage(`Preset "${preset.title}" aktif di rangkaian visual!`);
    setTimeout(() => setSendSuccessMessage(null), 3500);
  };

  // Uji cepat skenario Alarm Suhu Tumpukan >= 60°C (Buzzer)
  const handleTriggerHighTempTest = () => {
    setCustomCoreTemp("63.5");
    setCustomTemp("31.0");
    setCustomHumidity("84.0");
    setCustomTrend("1.8");
    setCustomMoisture("48.0");
  };

  // Forward data ke halaman Klasifikasi ML
  const handleForwardToClassification = () => {
    const query = new URLSearchParams({
      temp: liveProbeState.ambientTemp.toString(),
      rh: liveProbeState.ambientHum.toString(),
      mass: customMass,
      moisture: customMoisture,
      source:
        telemetry?.simulation_source ||
        `Wokwi Probe (Tumpuk ${liveProbeState.coreTemp}°C, ΔT ${liveProbeState.delta}°C)`,
    });
    router.push(`/classification?${query.toString()}`);
  };

  return (
    <div className="py-12 bg-agri-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-surface border border-agri-emerald/30 text-agri-primary text-xs font-semibold">
            <Cpu className="w-4 h-4 text-agri-emerald" />
            <span>Fase 1: Desain Perangkat Keras & Akuisisi Sensor Probe</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
            Simulasi & Rangkaian IoT Wokwi (ESP32 Probe)
          </h1>
          <p className="text-slate-600 max-w-3xl text-base leading-relaxed">
            Visualisasi skematik rangkaian lengkap <strong>Probe Pemantau Limbah Bunga Glagah</strong> berbasis <strong>ESP32 DevKit-C v4</strong>, sensor suhu tumpukan <strong>DS18B20</strong> (OneWire + Pull-Up 4.7kΩ), sensor udara <strong>DHT22</strong>, indikator <strong>3x LED + Resistor 330Ω</strong>, dan <strong>Piezo Buzzer</strong> dengan transmisi Wi-Fi MQTT.
          </p>
        </div>

        {/* Warning & Scientific Integrity Alert */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 flex items-start gap-4 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-agri-amber shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <h4 className="font-bold text-amber-950">
              Prinsip Integritas Ilmiah & Fisis Sensor (Scientific Honesty)
            </h4>
            <p className="text-amber-800 leading-relaxed">
              Seluruh pembacaan di Wokwi merupakan <strong>data simulasi</strong> untuk memvalidasi logika algoritma tepi (<em>edge inference</em>) dan alur transmisi data. <strong>Kelembapan Relatif Udara (% RH)</strong> dari DHT22 mengukur udara sekitar kepala alat dan <strong>TIDAK SAMA</strong> dengan <strong>Kadar Air Biomassa (% MC)</strong>. Indikator aktivitas fermentasi tumpukan dideteksi dari selisih suhu inti tumpukan DS18B20 terhadap suhu udara (<strong>&Delta;T = T<sub>tumpuk</sub> &minus; T<sub>udara</sub></strong>).
            </p>
          </div>
        </div>

        {/* ==================== KOMPONEN UTAMA: WOKWI CIRCUIT DESIGN & LIVE EMBED ==================== */}
        <WokwiCircuitView liveState={liveProbeState} />

        {/* Live Telemetry Cards + Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Kartu Pembacaan Sensor Probe Terkini (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-agri-surface flex items-center justify-center text-agri-primary">
                    <Activity className="w-5 h-5 text-agri-emerald animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-agri-dark">
                      Pembacaan Parameter Probe & Status Edge
                    </h3>
                    <p className="text-xs text-slate-500">
                      Node:{" "}
                      <span className="font-mono font-semibold text-slate-700">
                        {liveProbeState.nodeId}
                      </span>{" "}
                      •{" "}
                      <span>
                        {telemetry?.simulation_source ||
                          "Wokwi-ESP32-Probe Interactive"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchTelemetry}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                    />
                    <span>Refresh</span>
                  </button>
                  <span
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      backendOnline
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        backendOnline
                          ? "bg-emerald-500 animate-ping"
                          : "bg-amber-500"
                      }`}
                    />
                    {backendOnline ? "API Online" : "Simulasi Lokal"}
                  </span>
                </div>
              </div>

              {/* Grid 4 Kartu Parameter Sensor Probe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Suhu Inti Tumpukan (DS18B20) */}
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    liveProbeState.highTempWarning
                      ? "bg-rose-50 border-rose-300"
                      : "bg-slate-50 border-slate-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span className="font-medium">
                      Suhu Inti Tumpukan (DS18B20 • GPIO 4)
                    </span>
                    <Flame
                      className={`w-4 h-4 ${
                        liveProbeState.highTempWarning
                          ? "text-rose-600 animate-bounce"
                          : "text-orange-500"
                      }`}
                    />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-agri-dark">
                      {liveProbeState.coreTemp.toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                      °C
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {liveProbeState.highTempWarning
                      ? "PERINGATAN: Suhu >= 60°C! Buzzer alarm aktif."
                      : "Pengukuran suhu internal tumpukan glagah (1-Wire)"}
                  </p>
                </div>

                {/* 2. Suhu Udara Kepala Alat (DHT22) */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span className="font-medium">
                      Suhu Udara Lingkungan (DHT22 • GPIO 15)
                    </span>
                    <Thermometer className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-agri-dark">
                      {liveProbeState.ambientTemp.toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                      °C
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Referensi suhu udara ambient di kepala probe
                  </p>
                </div>

                {/* 3. Kelembapan Relatif Udara (DHT22) */}
                <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/70 space-y-2">
                  <div className="flex items-center justify-between text-sky-700 text-xs">
                    <span className="font-medium">
                      Kelembapan Relatif Udara (DHT22)
                    </span>
                    <Droplets className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-sky-950">
                      {liveProbeState.ambientHum.toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold text-sky-700">
                      % RH
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-700">
                    Ambang tinggi &ge;80% RH | Ambang kering &le;55% RH
                  </p>
                </div>

                {/* 4. Delta Suhu & Keputusan Edge Lokal */}
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    liveProbeState.hardwareClass === "CENDERUNG KERING"
                      ? "bg-emerald-50/80 border-emerald-200"
                      : liveProbeState.hardwareClass === "AKTIF/LEMBAP"
                      ? "bg-rose-50/80 border-rose-200"
                      : "bg-amber-50/80 border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span>Selisih &Delta;T &amp; Status LED Edge</span>
                    <Gauge className="w-4 h-4 text-agri-primary" />
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-agri-dark">
                        {liveProbeState.delta >= 0 ? "+" : ""}
                        {liveProbeState.delta.toFixed(1)}
                      </span>
                      <span className="text-sm font-semibold text-slate-500">
                        °C
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-800">
                      Skor {liveProbeState.score}/3
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800">
                    {liveProbeState.hardwareClass} &rarr;{" "}
                    {liveProbeState.recommendation}
                  </p>
                </div>
              </div>

              {/* Meta Info & Lokasi */}
              <div className="pt-2 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <div>
                  Lokasi Unit:{" "}
                  <strong className="text-slate-700">
                    {telemetry?.location || "Pemalang / Purbalingga"}
                  </strong>
                </div>
                <div>
                  Pembaruan Terakhir:{" "}
                  <strong className="text-slate-700">
                    {telemetry?.received_at || "Real-time"}
                  </strong>
                </div>
              </div>

              {/* Action Button: Teruskan ke Klasifikasi ML */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleForwardToClassification}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-agri-primary text-white font-bold text-base hover:bg-agri-primaryLight transition-all shadow-md shadow-agri-primary/25 hover:shadow-lg group"
                >
                  <span>
                    Teruskan Data Sensor Ini ke Klasifikasi Machine Learning
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform text-agri-emeraldLight" />
                </button>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Preset Sampel Riset & Pengontrol Simulasi */}
          <div className="space-y-6">
            {/* Kartu 1: Preset Sampel Lapangan Pemalang & Purbalingga */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-agri-dark">
                  Preset Sampel Lapangan
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Demo Juri
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Klik profil sampel di bawah untuk langsung melihat perubahan nyala LED pada rangkaian Wokwi:
              </p>

              <div className="space-y-3">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-agri-emerald/70 hover:bg-agri-surface/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-agri-dark group-hover:text-agri-primary">
                        {preset.title}
                      </h4>
                      <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover:text-agri-emerald shrink-0" />
                    </div>
                    <div className="text-[11px] text-agri-primary font-semibold mt-1">
                      {preset.target_hypothesis}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>
                        Tumpuk:{" "}
                        <strong>
                          {preset.core_temperature_c ??
                            preset.ambient_temperature_c + 2}
                          °C
                        </strong>
                      </span>
                      <span>
                        Udara: <strong>{preset.ambient_temperature_c}°C</strong>{" "}
                        ({preset.ambient_humidity_rh}%)
                      </span>
                    </div>
                  </div>
                ))}

                {/* Tombol Uji Alarm Buzzer >= 60°C */}
                <button
                  type="button"
                  onClick={handleTriggerHighTempTest}
                  className="w-full p-2.5 rounded-xl border border-fuchsia-200 bg-fuchsia-50/70 hover:bg-fuchsia-100/80 text-fuchsia-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-fuchsia-600" />
                  <span>Uji Alarm Overheat Tumpukan (&ge;60°C + Buzzer)</span>
                </button>
              </div>
            </div>

            {/* Kartu 2: Kontrol Sensor Real-Time pada Rangkaian Wokwi */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
              <h3 className="font-bold text-base text-agri-dark">
                Kontrol Sensor Interaktif
              </h3>
              <p className="text-xs text-slate-500">
                Geser slider untuk mengamati respon <strong>DS18B20</strong>,{" "}
                <strong>DHT22</strong>, <strong>3x LED</strong>, dan{" "}
                <strong>Buzzer</strong> secara langsung pada desain rangkaian:
              </p>

              <form onSubmit={handleSimulatePost} className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Suhu Tumpukan DS18B20 (°C)</span>
                    <strong className="text-orange-600">
                      {customCoreTemp}°C
                    </strong>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="70"
                    step="0.5"
                    value={customCoreTemp}
                    onChange={(e) => setCustomCoreTemp(e.target.value)}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Suhu Udara DHT22 (°C)</span>
                    <strong className="text-agri-primary">{customTemp}°C</strong>
                  </label>
                  <input
                    type="range"
                    min="18"
                    max="45"
                    step="0.5"
                    value={customTemp}
                    onChange={(e) => setCustomTemp(e.target.value)}
                    className="w-full accent-agri-primary cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Kelembapan Udara DHT22 (% RH)</span>
                    <strong className="text-sky-600">{customHumidity}%</strong>
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="95"
                    step="0.5"
                    value={customHumidity}
                    onChange={(e) => setCustomHumidity(e.target.value)}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Tren Kenaikan &Delta;T (°C/siklus)</span>
                    <strong className="text-slate-700">
                      {parseFloat(customTrend) >= 0 ? "+" : ""}
                      {customTrend}°C
                    </strong>
                  </label>
                  <input
                    type="range"
                    min="-1"
                    max="3"
                    step="0.2"
                    value={customTrend}
                    onChange={(e) => setCustomTrend(e.target.value)}
                    className="w-full accent-slate-600 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Estimasi Pendukung untuk ML Tabular
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">
                        Massa (g): <strong>{customMass}</strong>
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="350"
                        step="5"
                        value={customMass}
                        onChange={(e) => setCustomMass(e.target.value)}
                        className="w-full accent-agri-emerald cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">
                        Kadar Air (% MC): <strong>{customMoisture}</strong>
                      </label>
                      <input
                        type="range"
                        min="6"
                        max="60"
                        step="0.5"
                        value={customMoisture}
                        onChange={(e) => setCustomMoisture(e.target.value)}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {sendSuccessMessage && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{sendSuccessMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSimulatingSending}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSimulatingSending
                      ? "Mengirim..."
                      : "Sinkronkan Telemetri Probe ke Backend"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
