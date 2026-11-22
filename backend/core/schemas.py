from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class TelemetrySampleInput(BaseModel):
    node_id: Optional[str] = Field("ESP32-GLAGAH-NODE-01", max_length=100)
    location: Optional[str] = Field("Pemalang / Purbalingga Field Unit", max_length=200)
    ambient_temperature_c: Optional[float] = Field(None, ge=10.0, le=60.0, description="Suhu udara lingkungan (°C)")
    ambient_humidity_rh: Optional[float] = Field(None, ge=10.0, le=100.0, description="Kelembapan relatif udara (% RH)")
    core_temperature_c: Optional[float] = Field(None, ge=10.0, le=85.0, description="Suhu inti tumpukan dari DS18B20 (°C)")
    sample_mass_g: Optional[float] = Field(None, ge=0.0, le=2000.0, description="Massa sampel (gram)")
    biomass_moisture_sim_percent: Optional[float] = Field(None, ge=5.0, le=80.0, description="Simulasi sensor kadar air biomassa (% MC)")
    simulation_source: Optional[str] = Field("Wokwi-ESP32-Virtual", max_length=300)
    timestamp_ms: Optional[int] = None

    # Bidang payload format Wokwi Probe (sketch.ino / MQTT payload):
    id: Optional[str] = Field(None, max_length=100)
    tumpuk: Optional[float] = Field(None, description="Suhu tumpukan limbah glagah dari DS18B20 (°C)")
    udara: Optional[float] = Field(None, description="Suhu udara dari DHT22 (°C)")
    hum: Optional[float] = Field(None, description="Kelembapan udara dari DHT22 (% RH)")
    delta: Optional[float] = Field(None, description="Selisih suhu tumpukan - udara (°C)")
    tren: Optional[float] = Field(None, description="Laju perubahan delta suhu")
    skor: Optional[int] = Field(None, description="Skor indikator fermentasi")
    kelas: Optional[str] = Field(None, max_length=50, description="Kelas kondisi limbah di probe lokal")
    rekomendasi: Optional[str] = Field(None, max_length=100, description="Rekomendasi pemanfaatan di probe lokal")
    suhu_tinggi: Optional[bool] = Field(None, description="Flag peringatan suhu tinggi tumpukan")
    error: Optional[str] = Field(None, max_length=300)

class ClassificationRequest(BaseModel):
    ambient_temperature_c: float = Field(..., ge=15.0, le=45.0, description="Suhu udara (°C)")
    ambient_humidity_rh: float = Field(..., ge=20.0, le=100.0, description="Kelembapan relatif udara (% RH)")
    sample_mass_g: float = Field(..., ge=5.0, le=1000.0, description="Massa sampel (gram)")
    biomass_moisture_percent: float = Field(..., ge=5.0, le=80.0, description="Kadar air biomassa (% MC) terkalibrasi")
    post_harvest_age_days: int = Field(..., ge=1, le=90, description="Umur pascapanen (hari)")
    seed_condition_score: int = Field(..., ge=1, le=3, description="Kondisi biji (1: Rontok/Hancur, 2: Kering/Pecah, 3: Utuh/Segar)")
    sample_label: Optional[str] = Field("Sampel Uji Residu Glagah", max_length=120)

class PresetSample(BaseModel):
    id: str
    title: str
    origin: str
    target_hypothesis: str
    description: str
    ambient_temperature_c: float
    ambient_humidity_rh: float
    core_temperature_c: Optional[float] = None
    sample_mass_g: float
    biomass_moisture_percent: float
    post_harvest_age_days: int
    seed_condition_score: int
