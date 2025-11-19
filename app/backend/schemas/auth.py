# app/backend/schemas/auth.py

from pydantic import BaseModel, Field

# -----------------
# 1. Entrada de Login
# -----------------
class LoginRequest(BaseModel):
    """Schema para recibir las credenciales del usuario (email y contraseña)."""
    email: str = Field(..., description="Email de inicio de sesión")
    password: str = Field(..., description="Contraseña en texto plano")

# -----------------
# 2. Salida (Token JWT)
# -----------------
class TokenResponse(BaseModel):
    """Schema para devolver el token de acceso generado."""
    access_token: str
    token_type: str = "bearer"