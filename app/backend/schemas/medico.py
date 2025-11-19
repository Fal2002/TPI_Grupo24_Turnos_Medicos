from pydantic import BaseModel, Field
from typing import Optional, List
from app.backend.schemas.especialidad import EspecialidadOut


class MedicoBase(BaseModel):
    Nombre: str
    Apellido: str


class MedicoCreate(MedicoBase):
    Matricula: str
    # ----------------------------------------------------
    email_login: str  # El email que usará el médico para loguearse
    password_temporal: str  # Contraseña inicial
    # ----------------------------------------------------
    especialidades: List[int] = []


# Actualizamos esto:
class MedicoUpdate(BaseModel):
    Nombre: Optional[str] = None
    Apellido: Optional[str] = None
    especialidades: Optional[List[int]] = None  # <--- Nuevo campo opcional


class MedicoOut(MedicoBase):
    Matricula: str
    # Opcional: mostrar el email de login en el resultado
    email_usuario: Optional[str]
    especialidades: List[EspecialidadOut]

    class Config:
        from_attributes = True
