from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from core.schemas import ClassificationRequest
from ml.inference import run_classification, get_models

router = APIRouter()

@router.post("", summary="Menjalankan klasifikasi Machine Learning terhadap parameter residu glagah")
async def predict_glagah_sample(payload: ClassificationRequest):
    data = payload.model_dump()
    result = run_classification(data)
    
    if result.get("status") == "MODEL_UNAVAILABLE":
        raise HTTPException(status_code=503, detail=result.get("message"))
        
    return {
        "sample_label": data.get("sample_label", "Sampel Uji"),
        "input_parameters": {
            "ambient_temperature_c": data["ambient_temperature_c"],
            "ambient_humidity_rh": data["ambient_humidity_rh"],
            "sample_mass_g": data["sample_mass_g"],
            "biomass_moisture_percent": data["biomass_moisture_percent"],
            "post_harvest_age_days": data["post_harvest_age_days"],
            "seed_condition_score": data["seed_condition_score"]
        },
        "classification_output": result
    }

@router.get("/model-info", summary="Informasi transparansi arsitektur model Machine Learning")
async def get_model_information():
    rf_model, dt_model, metrics = get_models()
    return {
        "status": "READY" if rf_model is not None else "NOT_TRAINED",
        "primary_algorithm": "Random Forest Classifier (scikit-learn)",
        "comparative_algorithm": "Decision Tree Classifier (scikit-learn)",
        "deep_learning_status": "EXCLUDED (Not Used - Numeric Tabular Data Only)",
        "computer_vision_status": "EXCLUDED (Not Used - Physical-Chemical Parameters Only)",
        "transparency_note": "Model dibangun secara khusus berbasis batasan SNI 01-6235-2000 dan kaidah pengujian benih ISTA.",
        "metrics": metrics
    }
