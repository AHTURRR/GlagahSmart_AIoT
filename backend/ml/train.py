"""
GlagahSmart AIoT - Model Training & Evaluation Script
IDTC 2.0 - AIoT Future Competition 2026

Melatih dan membandingkan dua algoritma Machine Learning:
1. Random Forest Classifier (Model Utama)
2. Decision Tree Classifier (Model Pembanding)
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

try:
    from ml.dataset_generator import generate_glagah_dataset
except ImportError:
    from dataset_generator import generate_glagah_dataset

FEATURE_COLUMNS = [
    "ambient_temperature_c",
    "ambient_humidity_rh",
    "sample_mass_g",
    "biomass_moisture_percent",
    "post_harvest_age_days",
    "seed_condition_score"
]

TARGET_COLUMN = "target_class"

def train_and_evaluate(save_to_disk: bool = True):
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    data_dir = os.path.join(os.path.dirname(__file__), "data")

    csv_path = os.path.join(data_dir, "glagah_synthetic_dataset.csv")
    if os.path.exists(csv_path):
        print(f"[TRAIN] Memuat dataset dari: {csv_path}")
        df = pd.read_csv(csv_path)
    else:
        print("[TRAIN] Menghasilkan dataset baru...")
        df = generate_glagah_dataset(1200)
        if save_to_disk:
            os.makedirs(data_dir, exist_ok=True)
            df.to_csv(csv_path, index=False)

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"[TRAIN] Jumlah Data Latih: {len(X_train)}, Data Uji: {len(X_test)}")

    # 1. Model Utama: Random Forest
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        min_samples_split=4,
        random_state=42
    )
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)
    rf_report = classification_report(y_test, rf_preds, output_dict=True)

    # 2. Model Pembanding: Decision Tree
    dt_model = DecisionTreeClassifier(
        max_depth=5,
        min_samples_split=5,
        random_state=42
    )
    dt_model.fit(X_train, y_train)
    dt_preds = dt_model.predict(X_test)
    dt_acc = accuracy_score(y_test, dt_preds)
    dt_report = classification_report(y_test, dt_preds, output_dict=True)

    # Feature Importance (Random Forest)
    rf_importance = dict(zip(FEATURE_COLUMNS, [round(float(v), 4) for v in rf_model.feature_importances_]))
    dt_importance = dict(zip(FEATURE_COLUMNS, [round(float(v), 4) for v in dt_model.feature_importances_]))

    # Simpan metrik dan perbandingan
    metrics = {
        "dataset_info": {
            "total_samples": len(df),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "classes": sorted(list(y.unique())),
            "features": FEATURE_COLUMNS,
            "status": "Synthetic Baseline Model (Awaiting Laboratory Validation)"
        },
        "random_forest": {
            "accuracy": round(float(rf_acc), 4),
            "report": rf_report,
            "feature_importance": rf_importance
        },
        "decision_tree": {
            "accuracy": round(float(dt_acc), 4),
            "report": dt_report,
            "feature_importance": dt_importance
        }
    }

    if save_to_disk:
        try:
            os.makedirs(models_dir, exist_ok=True)
            rf_path = os.path.join(models_dir, "random_forest_model.joblib")
            dt_path = os.path.join(models_dir, "decision_tree_model.joblib")
            joblib.dump(rf_model, rf_path)
            joblib.dump(dt_model, dt_path)

            metrics_path = os.path.join(models_dir, "model_metrics.json")
            with open(metrics_path, "w", encoding="utf-8") as f:
                json.dump(metrics, f, indent=2, ensure_ascii=False)
            print(f"\n[OK] Model berhasil disimpan di: {models_dir}")
        except OSError as exc:
            print(f"\n[WARN] Tidak dapat menyimpan model ke disk ({exc}); menggunakan model di memori.")

    print("\n================ HASIL EVALUASI ================")
    print(f"Random Forest Accuracy : {rf_acc * 100:.2f}%")
    print(f"Decision Tree Accuracy : {dt_acc * 100:.2f}%")
    print("\nFeature Importances (Random Forest):")
    for feat, imp in sorted(rf_importance.items(), key=lambda x: x[1], reverse=True):
        print(f" - {feat:25s}: {imp * 100:.2f}%")

    return rf_model, dt_model, metrics

if __name__ == "__main__":
    train_and_evaluate()
