from pydantic import BaseModel
from typing import Optional, List


class MedicoBase(BaseModel):
    Nombre: str
    Apellido: str


class MedicoCreate(MedicoBase):
    Matricula: str
    especialidades: List[int] = []


# Actualizamos esto:
class MedicoUpdate(BaseModel):
    Nombre: Optional[str] = None
    Apellido: Optional[str] = None
    especialidades: Optional[List[int]] = None  # <--- Nuevo campo opcional


class MedicoOut(MedicoBase):
    Matricula: str
    especialidades: List[int]

    class Config:
        from_attributes = True
