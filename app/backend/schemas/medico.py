from pydantic import BaseModel, Field
from typing import Optional

class MedicoBase(BaseModel):
    Nombre: str
    Apellido: str

class MedicoCreate(MedicoBase):
    Matricula: str
    # ----------------------------------------------------
    email_login: str # El email que usará el médico para loguearse
    password_temporal: str # Contraseña inicial
    # ----------------------------------------------------

class MedicoUpdate(BaseModel):
    Nombre: Optional[str] = None
    Apellido: Optional[str] = None

class MedicoOut(MedicoBase):
    Matricula: str
    # Opcional: mostrar el email de login en el resultado
    email_usuario: Optional[str]

    class Config:
        from_attributes = True
