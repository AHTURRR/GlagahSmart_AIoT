import time
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from core.schemas import TelemetrySampleInput, PresetSample

router = APIRouter()

# In-memory latest buffer
_latest_telemetry: Optional[Dict[str, Any]] = {
    "node_id": "ESP32-GLAGAH-PROBE-01",
    "location": "Sentra Kerajinan Sapu Bojongsari, Purbalingga",
    "ambient_temperature_c": 28.5,
    "ambient_humidity_rh": 65.0,
    "core_temperature_c": 34.8,
    "delta_temperature_c": 6.3,
    "trend_c": 0.4,
    "score": 2,
    "hardware_class": "AKTIF/LEMBAP",
    "hardware_recommendation": "PUPUK / KOMPOS",
    "high_temperature_warning": False,
    "sample_mass_g": 92.4,
    "biomass_moisture_sim_percent": 38.5,
    "simulation_source": "Wokwi-ESP32-Probe (https://wokwi.com/projects/478499231234367489)",
    "received_at": time.strftime("%Y-%m-%d %H:%M:%S")
}

# Pre-configured field research samples (for offline competition presentation reliability)
PRESET_SAMPLES: List[Dict[str, Any]] = [
    {
        "id": "preset-briquette-purbalingga",
        "title": "Residu Serbuk Rontokan Kering - Bojongsari, Purbalingga",
        "origin": "Sentra Pengrajin Sapu Bojongsari, Purbalingga",
        "target_hypothesis": "CENDERUNG KERING → Briket Biomassa / Benih (LED Hijau)",
        "description": "Serbuk rontokan bunga hasil pemukulan sapu yang dijemur 10 hari. Suhu tumpukan mendekati suhu udara (ΔT rendah) dan udara kering.",
        "ambient_temperature_c": 30.2,
        "core_temperature_c": 31.4,
        "ambient_humidity_rh": 52.0,
        "sample_mass_g": 78.5,
        "biomass_moisture_percent": 10.4,
        "post_harvest_age_days": 10,
        "seed_condition_score": 1
    },
    {
        "id": "preset-seed-pemalang",
        "title": "Sampel Bunga Segar Pilihan - Belik, Pemalang",
        "origin": "Kecamatan Belik, Kabupaten Pemalang",
        "target_hypothesis": "TIDAK PASTI / CEK ULANG → Kandidat Benih Segar (LED Kuning)",
        "description": "Bunga glagah segar dipanen 2 hari lalu dengan struktur malai dan biji utuh. ΔT rendah tetapi kelembapan udara sedang (72% RH) sehingga perlu verifikasi fisik benih.",
        "ambient_temperature_c": 26.8,
        "core_temperature_c": 28.4,
        "ambient_humidity_rh": 72.0,
        "sample_mass_g": 115.0,
        "biomass_moisture_percent": 14.2,
        "post_harvest_age_days": 2,
        "seed_condition_score": 3
    },
    {
        "id": "preset-compost-bantarbolang",
        "title": "Tumpukan Malai Basah Fermentasi - Bantarbolang, Pemalang",
        "origin": "Area Penumpukan Bahan Bantarbolang, Pemalang",
        "target_hypothesis": "AKTIF/LEMBAP → Pupuk Kompos Organik (LED Merah)",
        "description": "Tumpukan residu sortasi terpapar kelembapan tinggi selama 25 hari. Aktivitas mikroba memicu pemanasan inti tumpukan (46.5°C, ΔT +20.5°C).",
        "ambient_temperature_c": 26.0,
        "core_temperature_c": 46.5,
        "ambient_humidity_rh": 86.0,
        "sample_mass_g": 210.0,
        "biomass_moisture_percent": 41.5,
        "post_harvest_age_days": 25,
        "seed_condition_score": 1
    }
]

def _evaluate_probe_edge_logic(core_temp: float, ambient_temp: float, humidity: float, trend: float = 0.0):
    """Mencerminkan aturan klasifikasi lokal di firmware sketch.ino ESP32."""
    delta = round(core_temp - ambient_temp, 1)
    skor = 0
    if delta >= 5.0:
        skor += 1
    if humidity >= 80.0:
        skor += 1
    if trend >= 1.0:
        skor += 1

    if skor >= 2:
        kelas = "AKTIF/LEMBAP"
        rekomendasi = "PUPUK / KOMPOS"
    elif skor == 0 and delta <= 2.0 and humidity <= 55.0:
        kelas = "CENDERUNG KERING"
        rekomendasi = "BENIH / BRIKET"
    else:
        kelas = "TIDAK PASTI"
        rekomendasi = "TAHAN, CEK ULANG"

    suhu_tinggi = core_temp >= 60.0
    return delta, skor, kelas, rekomendasi, suhu_tinggi

@router.post("/sample", summary="Menerima data telemetri dari Wokwi ESP32")
async def receive_telemetry_sample(payload: TelemetrySampleInput):
    global _latest_telemetry
    raw = payload.model_dump()
    
    # Mapping payload baru jika dari sketch.ino (Wokwi Probe Pemantau Glagah)
    ambient_temp = raw.get("udara") if raw.get("udara") is not None else raw.get("ambient_temperature_c", 28.0)
    ambient_rh = raw.get("hum") if raw.get("hum") is not None else raw.get("ambient_humidity_rh", 65.0)
    core_temp = raw.get("tumpuk") if raw.get("tumpuk") is not None else raw.get("core_temperature_c")
    if core_temp is None:
        core_temp = float(ambient_temp) + 3.0
    
    tren = float(raw.get("tren", 0.0) or 0.0)
    calc_delta, calc_skor, calc_kelas, calc_rekomendasi, calc_suhu_tinggi = _evaluate_probe_edge_logic(
        float(core_temp), float(ambient_temp), float(ambient_rh), tren
    )
    
    delta_t = raw.get("delta") if raw.get("delta") is not None else calc_delta
    skor = raw.get("skor") if raw.get("skor") is not None else calc_skor
    kelas = raw.get("kelas") or calc_kelas
    rekomendasi = raw.get("rekomendasi") or calc_rekomendasi
    suhu_tinggi = raw.get("suhu_tinggi") if raw.get("suhu_tinggi") is not None else calc_suhu_tinggi
    
    node_id = raw.get("id") or raw.get("node_id") or "ESP32-GLAGAH-PROBE-01"
    
    # Estimasi kadar air dari korelasi kelas/kelembapan jika belum diisi secara manual
    moisture_est = raw.get("biomass_moisture_sim_percent")
    if moisture_est is None:
        if kelas == "AKTIF/LEMBAP":
            moisture_est = 42.0
        elif kelas == "CENDERUNG KERING":
            moisture_est = 11.5
        else:
            moisture_est = 18.0

    mass_est = raw.get("sample_mass_g") if raw.get("sample_mass_g") is not None else 95.0

    normalized = {
        "node_id": node_id,
        "location": raw.get("location") or "Sentra Kerajinan Sapu Bojongsari, Purbalingga",
        "ambient_temperature_c": float(ambient_temp),
        "ambient_humidity_rh": float(ambient_rh),
        "core_temperature_c": float(core_temp),
        "delta_temperature_c": round(float(delta_t), 1),
        "trend_c": tren,
        "score": int(skor),
        "hardware_class": kelas,
        "hardware_recommendation": rekomendasi,
        "high_temperature_warning": bool(suhu_tinggi),
        "sample_mass_g": float(mass_est),
        "biomass_moisture_sim_percent": float(moisture_est),
        "simulation_source": raw.get("simulation_source") or "Wokwi-ESP32-Probe (Online Simulator)",
        "received_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }

    _latest_telemetry = normalized
    return {
        "status": "ACCEPTED",
        "message": "Data telemetri Wokwi berhasil disimpan di buffer",
        "sample": _latest_telemetry
    }

@router.get("/latest", summary="Mengambil data pembacaan sensor terakhir")
async def get_latest_telemetry():
    global _latest_telemetry
    return {
        "has_data": _latest_telemetry is not None,
        "latest": _latest_telemetry
    }

@router.get("/presets", summary="Daftar preset sampel lapangan untuk demonstrasi juri")
async def get_preset_samples():
    return {
        "count": len(PRESET_SAMPLES),
        "presets": PRESET_SAMPLES
    }
