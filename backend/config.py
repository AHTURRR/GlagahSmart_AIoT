"""Environment-backed configuration for the API service."""

import os
from urllib.parse import urlparse


def _csv_env(name: str, default: str) -> list[str]:
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


def _normalize_host(raw: str) -> str:
    cleaned = raw.strip()
    if "://" in cleaned:
        parsed = urlparse(cleaned)
        if parsed.hostname:
            return parsed.hostname
    return cleaned.split("/")[0].strip()


def _build_allowed_hosts() -> list[str]:
    hosts: list[str] = []
    for item in _csv_env("ALLOWED_HOSTS", "localhost,127.0.0.1"):
        normalized = _normalize_host(item)
        if normalized and normalized not in hosts:
            hosts.append(normalized)

    # Ensure local loopback health checks inside containers always succeed
    for loopback in ("localhost", "127.0.0.1"):
        if loopback not in hosts:
            hosts.append(loopback)

    # Auto-register Render external hostname when deployed on Render
    render_host = os.getenv("RENDER_EXTERNAL_HOSTNAME", "").strip()
    if render_host:
        normalized_render = _normalize_host(render_host)
        if normalized_render and normalized_render not in hosts:
            hosts.append(normalized_render)

    return hosts


def _build_cors_origins() -> list[str]:
    origins: list[str] = []
    for item in _csv_env("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"):
        normalized = item.rstrip("/")
        if normalized and normalized not in origins:
            origins.append(normalized)
    return origins


ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
ALLOWED_HOSTS = _build_allowed_hosts()
CORS_ORIGINS = _build_cors_origins()
API_DOCS_ENABLED = os.getenv("API_DOCS_ENABLED", "true").lower() == "true"

