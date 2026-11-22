"""Environment-backed configuration for the API service."""

import os


def _csv_env(name: str, default: str) -> list[str]:
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
ALLOWED_HOSTS = _csv_env("ALLOWED_HOSTS", "localhost,127.0.0.1")
CORS_ORIGINS = _csv_env("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
API_DOCS_ENABLED = os.getenv("API_DOCS_ENABLED", "true").lower() == "true"

