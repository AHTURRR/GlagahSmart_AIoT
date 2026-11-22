from fastapi import APIRouter
from api.v1.endpoints import telemetry, predict, health

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["Wokwi IoT Telemetry"])
api_router.include_router(predict.router, prefix="/predict", tags=["Machine Learning Classification"])
