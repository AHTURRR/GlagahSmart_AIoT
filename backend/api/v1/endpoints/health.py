from fastapi import APIRouter
import time

router = APIRouter()

_start_time = time.time()

@router.get("/health", summary="Health check endpoint")
async def health_check():
    return {
        "service": "GlagahSmart AIoT Backend Engine",
        "competition": "IDTC 2.0 - AIoT Future Competition 2026",
        "status": "HEALTHY",
        "uptime_seconds": round(time.time() - _start_time, 2)
    }
