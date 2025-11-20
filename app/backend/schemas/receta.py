from pydantic import BaseModel
from typing import List
from datetime import date
from app.backend.schemas.detalle_receta import DetalleRecetaOut

class RecetaBase(BaseModel):
    Turno_Fecha: date
    Turno_Hora: str
    Turno_Paciente_nroPaciente: int

class RecetaCreate(RecetaBase):
    Detalles_Ids: List[int] = []

class RecetaOut(RecetaBase):
    Id: int
    detalles: List[DetalleRecetaOut] = []

    class Config:
        from_attributes = True