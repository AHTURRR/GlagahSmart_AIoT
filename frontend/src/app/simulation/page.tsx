"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  ArrowRight,
  Check,
  Send,
  Volume2,
} from "lucide-react";
import { TelemetryData, PresetSample } from "@/lib/types";
import { BACKEND_URL } from "@/lib/utils";
import DossierHeader from "@/components/layout/DossierHeader";
import WokwiCircuitView, {
  WokwiLiveState,
} from "@/components/simulation/WokwiCircuitView";

// Fallback preset jika backend sedang offline agar demonstrasi tetap berjalan mulus
const FALLBACK_PRESETS: PresetSample[] = [
  {
    id: "preset-briquette-purbalingga",
    title: "Residu Serbuk Rontokan Kering — Bojongsari, Purbalingga",
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
    title: "Sampel Bunga Segar Pilihan — Belik, Pemalang",
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
    title: "Tumpukan Malai Basah Fermentasi — Bantarbolang, Pemalang",
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
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [isSimulatingSending, setIsSimulatingSending] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(
    null
  );

  // Kontrol interaktif sensor (sinkron langsung ke visual Wokwi di atas)
  const [customCoreTemp, setCustomCoreTemp] = useState("57.8");
  const [customTemp, setCustomTemp] = useState("41.6");
  const [customHumidity, setCustomHumidity] = useState("65.5");
  const [customTrend, setCustomTrend] = useState("1.2");
  const [customMass, setCustomMass] = useState("95.0");
  const [customMoisture, setCustomMoisture] = useState("38.5");

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
      setTelemetry(
        (prev) =>
          prev || {
            node_id: "ESP32-GLAGAH-PROBE-01",
            location:
              "Sentra Kerajinan Sapu Bojongsari, Purbalingga (Mode Lokal)",
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
            simulation_source: "Wokwi-ESP32-Probe (Simulasi Lokal)",
            received_at: new Date().toLocaleTimeString("id-ID"),
          }
      );
    } finally {
      setLoading(false);
    }
  };

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
        "Payload probe ESP32 tersinkronkan ke backend FastAPI."
      );
      setTimeout(() => setSendSuccessMessage(null), 4000);
    } catch {
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
        simulation_source: "Wokwi Probe Simulator (Buffer Lokal)",
        received_at: new Date().toLocaleTimeString("id-ID"),
      });
      setSendSuccessMessage(
        "Buffer lokal diperbarui (mode offline tanpa backend)."
      );
      setTimeout(() => setSendSuccessMessage(null), 4000);
    } finally {
      setIsSimulatingSending(false);
    }
  };

  const handleSelectPreset = async (preset: PresetSample) => {
    setActivePresetId(preset.id);
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
        setSendSuccessMessage(`Preset "${preset.title}" diterapkan pada rangkaian.`);
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
    setSendSuccessMessage(`Preset "${preset.title}" aktif pada skematik.`);
    setTimeout(() => setSendSuccessMessage(null), 3500);
  };

  const handleTriggerHighTempTest = () => {
    setActivePresetId("overheat-test");
    setCustomCoreTemp("63.5");
    setCustomTemp("31.0");
    setCustomHumidity("84.0");
    setCustomTrend("1.8");
    setCustomMoisture("48.0");
  };

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

  const classAccent =
    liveProbeState.hardwareClass === "CENDERUNG KERING"
      ? "border-agri-primary text-agri-primary bg-agri-surface/70"
      : liveProbeState.hardwareClass === "AKTIF/LEMBAP"
      ? "border-agri-clay text-agri-clay bg-[#F5E6DC]"
      : "border-agri-ink/30 text-agri-ink bg-agri-bg";

  return (
    <div className="pb-20">
      <DossierHeader
        eyebrow="Instrumen probe · Fase 01"
        title={
          <>
            Simulasi rangkaian{" "}
            <span className="text-agri-primary">ESP32 Wokwi.</span>
          </>
        }
        summary={
          <>
            Rangkaian <strong>Probe Pemantau Limbah Bunga Glagah</strong>{" "}
            berbasis ESP32 DevKit-C v4 dengan sensor suhu inti tumpukan{" "}
            <strong>DS18B20</strong> (OneWire + Pull-Up 4.7kΩ), sensor udara{" "}
            <strong>DHT22</strong>, tiga indikator LED lokal, dan piezo buzzer.
          </>
        }
        aside={
          <div className="paper-panel p-4">
            <div className="flex items-center justify-between border-b border-agri-primary/15 pb-3 text-[11px] font-bold uppercase tracking-[0.14em]">
              <span className="text-agri-muted">Status kanal</span>
              <span className="inline-flex items-center gap-1.5 text-agri-ink">
                <span
                  className={`h-2 w-2 rounded-full ${
                    backendOnline ? "bg-agri-emerald" : "bg-agri-clay"
                  }`}
                />
                {backendOnline ? "API terhubung" : "Mode lokal"}
              </span>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-agri-muted">Node</span>
                <span className="font-mono font-semibold text-agri-ink">
                  {liveProbeState.nodeId}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-agri-muted">Sinkronisasi</span>
                <span className="font-mono text-agri-ink">
                  {telemetry?.received_at || "Real-time"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchTelemetry}
              disabled={loading}
              className="mt-3 flex min-h-9 w-full items-center justify-center gap-1.5 border border-agri-primary/25 bg-white px-3 text-xs font-semibold text-agri-primary transition-colors hover:bg-agri-bg disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              <span>Muat ulang telemetri</span>
            </button>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl space-y-12 px-4 pt-8 sm:px-6 lg:px-8">
        {/* Editorial Scientific Integrity Strip */}
        <div className="dossier-note grid gap-3 px-5 py-4 md:grid-cols-[13.5rem_1fr] md:items-start">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-agri-clay">
              Batasan data & fisis
            </p>
            <p className="mt-0.5 text-xs text-agri-muted">
              Prinsip kejujuran ilmiah
            </p>
          </div>
          <p className="text-xs leading-6 text-agri-ink sm:text-sm">
            Seluruh pembacaan di bawah adalah <strong>data simulasi</strong>{" "}
            untuk menguji logika tepi (<em>edge inference</em>) dan alur MQTT.{" "}
            <strong>Kelembapan Relatif Udara (% RH)</strong> dari DHT22 hanya
            mengukur udara sekitar kepala probe dan{" "}
            <strong>tidak sama</strong> dengan{" "}
            <strong>Kadar Air Biomassa (% MC)</strong>. Indikasi fermentasi
            tumpukan dibaca dari selisih suhu inti terhadap suhu udara (
            <span className="font-mono font-semibold">
              ΔT = T<sub>tumpuk</sub> − T<sub>udara</sub>
            </span>
            ).
          </p>
        </div>

        {/* Main Interactive Hardware Workbench */}
        <WokwiCircuitView liveState={liveProbeState} />

        {/* Telemetry Readout Ledger & Interactive Controls Workbench */}
        <section className="grid gap-10 lg:grid-cols-[1.22fr_0.78fr] lg:items-start">
          {/* Left: Measurement Sheet + Field Sample Presets */}
          <div className="space-y-10">
            {/* Measurement Matrix */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-agri-primary/20 pb-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
                    Pembacaan instrumen
                  </p>
                  <h2 className="display-serif mt-1 text-3xl text-agri-ink">
                    Parameter probe & keputusan tepi
                  </h2>
                </div>
                <span className="font-mono text-xs text-agri-muted">
                  {telemetry?.simulation_source ||
                    "Wokwi-ESP32-Probe Interactive"}
                </span>
              </div>

              <div className="grid border border-agri-primary/20 bg-white/80 sm:grid-cols-2">
                {/* 1. Core Temp */}
                <div
                  className={`border-b border-agri-primary/15 p-5 sm:border-r ${
                    liveProbeState.highTempWarning ? "bg-[#F8EAE3]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-agri-muted">
                    <span>Suhu inti tumpukan</span>
                    <span>DS18B20 · GPIO 4</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5 tabular-nums">
                    <span
                      className={`display-serif text-5xl leading-none ${
                        liveProbeState.highTempWarning
                          ? "text-agri-clay"
                          : "text-agri-ink"
                      }`}
                    >
                      {liveProbeState.coreTemp.toFixed(1)}
                    </span>
                    <span className="font-mono text-sm font-semibold text-agri-muted">
                      °C
                    </span>
                  </div>
                  <p
                    className={`mt-3 text-xs leading-5 ${
                      liveProbeState.highTempWarning
                        ? "font-semibold text-agri-clay"
                        : "text-agri-muted"
                    }`}
                  >
                    {liveProbeState.highTempWarning
                      ? "Peringatan: suhu ≥ 60°C — alarm buzzer aktif."
                      : "Pengukuran suhu internal tumpukan glagah via 1-Wire."}
                  </p>
                </div>

                {/* 2. Ambient Temp */}
                <div className="border-b border-agri-primary/15 p-5">
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-agri-muted">
                    <span>Suhu udara sekitar</span>
                    <span>DHT22 · GPIO 15</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5 tabular-nums">
                    <span className="display-serif text-5xl leading-none text-agri-ink">
                      {liveProbeState.ambientTemp.toFixed(1)}
                    </span>
                    <span className="font-mono text-sm font-semibold text-agri-muted">
                      °C
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-agri-muted">
                    Referensi suhu lingkungan di kepala probe sebagai pembanding
                    ΔT.
                  </p>
                </div>

                {/* 3. Ambient Humidity */}
                <div className="border-b border-agri-primary/15 p-5 sm:border-b-0 sm:border-r">
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-agri-muted">
                    <span>Kelembapan udara</span>
                    <span>DHT22 · % RH</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5 tabular-nums">
                    <span className="display-serif text-5xl leading-none text-agri-ink">
                      {liveProbeState.ambientHum.toFixed(1)}
                    </span>
                    <span className="font-mono text-sm font-semibold text-agri-muted">
                      % RH
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-agri-muted">
                    Ambang kering &le;55% RH · ambang lembap &ge;80% RH.
                  </p>
                </div>

                {/* 4. Delta T & Edge Class */}
                <div className="p-5">
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-agri-muted">
                    <span>Selisih ΔT &amp; skor</span>
                    <span>SKOR {liveProbeState.score}/3</span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2 tabular-nums">
                    <div className="flex items-baseline gap-1">
                      <span className="display-serif text-5xl leading-none text-agri-ink">
                        {liveProbeState.delta >= 0 ? "+" : ""}
                        {liveProbeState.delta.toFixed(1)}
                      </span>
                      <span className="font-mono text-sm font-semibold text-agri-muted">
                        °C
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`border px-2 py-0.5 font-mono text-[11px] font-bold ${classAccent}`}
                    >
                      {liveProbeState.hardwareClass}
                    </span>
                    <span className="text-xs font-semibold text-agri-ink">
                      → {liveProbeState.recommendation}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-agri-primary/15 pb-4 text-xs text-agri-muted">
                <span>
                  Lokasi:{" "}
                  <strong className="text-agri-ink">
                    {telemetry?.location || "Pemalang / Purbalingga"}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={handleForwardToClassification}
                  className="inline-flex min-h-11 items-center gap-2 bg-agri-primary px-5 text-xs font-bold text-white transition-colors hover:bg-agri-primaryLight sm:text-sm"
                >
                  <span>Teruskan ke klasifikasi Machine Learning</span>
                  <ArrowRight className="h-4 w-4 text-agri-emeraldLight" />
                </button>
              </div>
            </div>

            {/* Field Sample Presets as Numbered Field Index */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
                    Profil sampel lapangan
                  </p>
                  <h3 className="display-serif mt-1 text-2xl text-agri-ink">
                    Skenario uji cepat Pemalang &amp; Purbalingga
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerHighTempTest}
                  className={`inline-flex min-h-9 items-center gap-1.5 border px-3 text-xs font-semibold transition-colors ${
                    activePresetId === "overheat-test"
                      ? "border-agri-clay bg-agri-clay text-white"
                      : "border-agri-clay/50 bg-transparent text-agri-clay hover:bg-[#F5E6DC]"
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Uji alarm &ge;60°C</span>
                </button>
              </div>

              <div className="divide-y divide-agri-primary/15 border-y border-agri-primary/20">
                {presets.map((preset, idx) => {
                  const isActive = activePresetId === preset.id;
                  const coreT =
                    preset.core_temperature_c ??
                    preset.ambient_temperature_c + 2;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`grid w-full gap-3 px-3 py-4 text-left transition-colors sm:grid-cols-[2.5rem_1fr_auto] sm:items-start ${
                        isActive
                          ? "border-l-2 border-agri-primary bg-white/90"
                          : "hover:bg-white/60"
                      }`}
                    >
                      <span className="display-serif text-2xl leading-none text-agri-clay">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-agri-ink">
                          {preset.title}
                        </div>
                        <div className="text-xs font-semibold text-agri-primary">
                          {preset.target_hypothesis}
                        </div>
                        <p className="text-xs leading-5 text-agri-muted">
                          {preset.description}
                        </p>
                      </div>
                      <div className="space-y-0.5 font-mono text-[11px] text-agri-muted tabular-nums sm:text-right">
                        <div>
                          T_inti{" "}
                          <strong className="text-agri-ink">{coreT}°C</strong>
                        </div>
                        <div>
                          Udara{" "}
                          <strong className="text-agri-ink">
                            {preset.ambient_temperature_c}°C
                          </strong>
                        </div>
                        <div>
                          RH{" "}
                          <strong className="text-agri-ink">
                            {preset.ambient_humidity_rh}%
                          </strong>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Interactive Sensor Bench Controls */}
          <aside className="paper-panel p-5 sm:p-6">
            <div className="border-b border-agri-primary/15 pb-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-agri-clay">
                Kendali simulasi
              </p>
              <h3 className="display-serif mt-1 text-2xl text-agri-ink">
                Ubah masukan sensor
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-agri-muted">
                Geser parameter untuk melihat respon langsung pada DS18B20,
                DHT22, 3x LED, dan buzzer di skematik atas.
              </p>
            </div>

            <form onSubmit={handleSimulatePost} className="mt-5 space-y-5">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="sim-core-temp"
                    className="mb-2 flex items-baseline justify-between text-xs"
                  >
                    <span className="font-semibold text-agri-ink">
                      Suhu tumpukan (DS18B20)
                    </span>
                    <span className="font-mono font-bold text-agri-clay tabular-nums">
                      {customCoreTemp}°C
                    </span>
                  </label>
                  <input
                    id="sim-core-temp"
                    type="range"
                    min="20"
                    max="70"
                    step="0.5"
                    value={customCoreTemp}
                    onChange={(e) => {
                      setActivePresetId(null);
                      setCustomCoreTemp(e.target.value);
                    }}
                    className="field-range field-range-clay"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-agri-muted">
                    <span>20°C</span>
                    <span>60°C alarm</span>
                    <span>70°C</span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="sim-amb-temp"
                    className="mb-2 flex items-baseline justify-between text-xs"
                  >
                    <span className="font-semibold text-agri-ink">
                      Suhu udara (DHT22)
                    </span>
                    <span className="font-mono font-bold text-agri-primary tabular-nums">
                      {customTemp}°C
                    </span>
                  </label>
                  <input
                    id="sim-amb-temp"
                    type="range"
                    min="18"
                    max="45"
                    step="0.5"
                    value={customTemp}
                    onChange={(e) => {
                      setActivePresetId(null);
                      setCustomTemp(e.target.value);
                    }}
                    className="field-range"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sim-hum"
                    className="mb-2 flex items-baseline justify-between text-xs"
                  >
                    <span className="font-semibold text-agri-ink">
                      Kelembapan udara (DHT22)
                    </span>
                    <span className="font-mono font-bold text-agri-primary tabular-nums">
                      {customHumidity}% RH
                    </span>
                  </label>
                  <input
                    id="sim-hum"
                    type="range"
                    min="30"
                    max="95"
                    step="0.5"
                    value={customHumidity}
                    onChange={(e) => {
                      setActivePresetId(null);
                      setCustomHumidity(e.target.value);
                    }}
                    className="field-range"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sim-trend"
                    className="mb-2 flex items-baseline justify-between text-xs"
                  >
                    <span className="font-semibold text-agri-ink">
                      Tren kenaikan ΔT / siklus
                    </span>
                    <span className="font-mono font-bold text-agri-ink tabular-nums">
                      {parseFloat(customTrend) >= 0 ? "+" : ""}
                      {customTrend}°C
                    </span>
                  </label>
                  <input
                    id="sim-trend"
                    type="range"
                    min="-1"
                    max="3"
                    step="0.2"
                    value={customTrend}
                    onChange={(e) => {
                      setActivePresetId(null);
                      setCustomTrend(e.target.value);
                    }}
                    className="field-range"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t border-agri-primary/15 pt-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-agri-muted">
                  Parameter pendukung ML tabular
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="sim-mass"
                      className="mb-2 flex items-baseline justify-between text-[11px]"
                    >
                      <span className="text-agri-muted">Massa</span>
                      <strong className="font-mono text-agri-ink tabular-nums">
                        {customMass} g
                      </strong>
                    </label>
                    <input
                      id="sim-mass"
                      type="range"
                      min="20"
                      max="350"
                      step="5"
                      value={customMass}
                      onChange={(e) => setCustomMass(e.target.value)}
                      className="field-range"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sim-moisture"
                      className="mb-2 flex items-baseline justify-between text-[11px]"
                    >
                      <span className="text-agri-muted">Kadar air</span>
                      <strong className="font-mono text-agri-ink tabular-nums">
                        {customMoisture}%
                      </strong>
                    </label>
                    <input
                      id="sim-moisture"
                      type="range"
                      min="6"
                      max="60"
                      step="0.5"
                      value={customMoisture}
                      onChange={(e) => setCustomMoisture(e.target.value)}
                      className="field-range"
                    />
                  </div>
                </div>
              </div>

              {sendSuccessMessage && (
                <div className="flex items-start gap-2 border-l-2 border-agri-primary bg-agri-surface/70 px-3 py-2.5 text-xs text-agri-primary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{sendSuccessMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSimulatingSending}
                className="flex min-h-11 w-full items-center justify-center gap-2 bg-agri-dark px-4 text-xs font-bold text-agri-bg transition-colors hover:bg-agri-primary disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" />
                <span>
                  {isSimulatingSending
                    ? "Mengirim telemetri..."
                    : "Sinkronkan telemetri ke backend"}
                </span>
              </button>
            </form>
          </aside>
        </section>
      </div>
    </div>
  );
}
