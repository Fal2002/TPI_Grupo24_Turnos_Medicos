# app/backend/core/security_schema.py

from fastapi.openapi.models import HTTPBearer
from fastapi.security import HTTPBearer as SecurityHTTPBearer

# Esquema que Swagger usa para mostrar el botón "Authorize"
bearer_scheme = SecurityHTTPBearer(auto_error=True)
