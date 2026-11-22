"""
GlagahSmart AIoT - Domain-Grounded Dataset Generator
IDTC 2.0 - AIoT Future Competition 2026

Generator dataset sintetis berbasis aturan domain ilmiah & standar SNI:
- SNI 01-6235-2000 (Briket Arang Biomassa: Kadar air ideal <= 8-12%)
- Aturan Pengujian Benih (ISTA Rules: Viabilitas benih segar, umur pascapanen < 7-10 hari)
- Standar Dekomposisi Kompos (SNI 19-7030-2004: Kelembapan bahan organik 40-60%)
"""

import numpy as np
import pandas as pd
import os

def generate_glagah_dataset(n_samples: int = 1200, random_state: int = 42) -> pd.DataFrame:
    np.random.seed(random_state)
    
    samples_per_class = n_samples // 3
    data = []

    # 1. KELAS: BENIH (Seed Propagation)
    # Ciri: Masih segar, umur pascapanen singkat (1-7 hari), biji utuh (skor 3), kadar air moderat (10-18%)
    for _ in range(samples_per_class):
        temp = np.random.normal(27.0, 2.5)
        rh = np.random.normal(70.0, 6.0)
        mass = np.random.normal(120.0, 30.0)
        moisture = np.random.normal(13.5, 2.0)
        age = np.random.randint(1, 8)
        seed_cond = np.random.choice([2, 3], p=[0.1, 0.9])
        
        data.append({
            "ambient_temperature_c": round(np.clip(temp, 20.0, 36.0), 2),
            "ambient_humidity_rh": round(np.clip(rh, 50.0, 90.0), 2),
            "sample_mass_g": round(np.clip(mass, 30.0, 350.0), 2),
            "biomass_moisture_percent": round(np.clip(moisture, 9.0, 19.0), 2),
            "post_harvest_age_days": int(age),
            "seed_condition_score": int(seed_cond),
            "target_class": "Benih"
        })

    # 2. KELAS: BRIKET BIOMASSA (Biomass Briquette)
    # Ciri: Kering (kadar air < 14%), serbuk rontokan/bunga kering (skor biji 1-2), umur simpan kering bervariasi
    for _ in range(samples_per_class):
        temp = np.random.normal(29.5, 3.0)
        rh = np.random.normal(58.0, 8.0)
        mass = np.random.normal(85.0, 25.0)
        moisture = np.random.normal(10.5, 2.0) # Sangat sesuai SNI briket
        age = np.random.randint(5, 35)
        seed_cond = np.random.choice([1, 2], p=[0.65, 0.35])
        
        data.append({
            "ambient_temperature_c": round(np.clip(temp, 22.0, 38.0), 2),
            "ambient_humidity_rh": round(np.clip(rh, 40.0, 75.0), 2),
            "sample_mass_g": round(np.clip(mass, 20.0, 250.0), 2),
            "biomass_moisture_percent": round(np.clip(moisture, 6.5, 14.5), 2),
            "post_harvest_age_days": int(age),
            "seed_condition_score": int(seed_cond),
            "target_class": "Briket Biomassa"
        })

    # 3. KELAS: PUPUK KOMPOS (Organic Compost)
    # Ciri: Lembap/basah (> 25% - 60%), terdegradasi/rontok hancur (skor biji 1), umur pascapanen lama atau tercampur
    for _ in range(samples_per_class):
        temp = np.random.normal(26.0, 2.5)
        rh = np.random.normal(82.0, 7.0)
        mass = np.random.normal(180.0, 45.0)
        moisture = np.random.normal(38.0, 8.5) # Lembap untuk pengomposan aerob
        age = np.random.randint(10, 50)
        seed_cond = np.random.choice([1, 2], p=[0.85, 0.15])
        
        data.append({
            "ambient_temperature_c": round(np.clip(temp, 21.0, 35.0), 2),
            "ambient_humidity_rh": round(np.clip(rh, 65.0, 95.0), 2),
            "sample_mass_g": round(np.clip(mass, 40.0, 400.0), 2),
            "biomass_moisture_percent": round(np.clip(moisture, 22.0, 65.0), 2),
            "post_harvest_age_days": int(age),
            "seed_condition_score": int(seed_cond),
            "target_class": "Pupuk Kompos"
        })

    df = pd.DataFrame(data)
    # Acak urutan baris
    df = df.sample(frac=1.0, random_state=random_state).reset_index(drop=True)
    return df

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(out_dir, exist_ok=True)
    csv_path = os.path.join(out_dir, "glagah_synthetic_dataset.csv")
    df = generate_glagah_dataset(1200)
    df.to_csv(csv_path, index=False)
    print(f"[DATASET GENERATOR] Berhasil membuat {len(df)} sampel data!")
    print(f"[DATASET GENERATOR] Disimpan di: {csv_path}")
    print(df["target_class"].value_counts())
