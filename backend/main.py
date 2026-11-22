"""
GlagahSmart AIoT - Backend API Gateway & Machine Learning Service
IDTC 2.0 - AIoT Future Competition 2026
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from api.v1.router import api_router
from config import ALLOWED_HOSTS, API_DOCS_ENABLED, CORS_ORIGINS

app = FastAPI(
    title="GlagahSmart AIoT API",
    description="Smart Classification for Sustainable Glagah Utilization - IDTC 2.0 AIoT Future Competition 2026",
    version="1.0.0",
    docs_url="/docs" if API_DOCS_ENABLED else None,
    redoc_url="/redoc" if API_DOCS_ENABLED else None,
    openapi_url="/openapi.json" if API_DOCS_ENABLED else None,
)

# Reject unexpected Host headers. Configure ALLOWED_HOSTS for the deployment domain.
app.add_middleware(TrustedHostMiddleware, allowed_hosts=ALLOWED_HOSTS)

# CORS is explicitly allow-listed; credentials are not used by this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Accept", "Content-Type"],
)


@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response

app.include_router(api_router, prefix="/api/v1")

@app.get("/", summary="Root status check")
async def root():
    return {
        "project": "GlagahSmart AIoT",
        "tagline": "Smart Classification for Sustainable Glagah Utilization",
        "competition": "IDTC 2.0 - AIoT Future Competition 2026",
        "study_locations": ["Kabupaten Pemalang", "Kabupaten Purbalingga"],
        "status": "Active Backend Service",
        "docs": "/docs",
        "endpoints": {
            "telemetry": "/api/v1/telemetry",
            "predict": "/api/v1/predict",
            "health": "/api/v1/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
