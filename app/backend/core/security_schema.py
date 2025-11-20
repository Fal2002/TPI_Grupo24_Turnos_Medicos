from fastapi.openapi.models import HTTPBearer
from fastapi.security import HTTPBearer as SecurityHTTPBearer

bearer_scheme = SecurityHTTPBearer(auto_error=True)