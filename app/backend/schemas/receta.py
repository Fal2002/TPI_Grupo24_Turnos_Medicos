from pydantic import BaseModel
from typing import List
from app.backend.schemas.medicamento import MedicamentoOut


class RecetaBase(BaseModel):
    Turno_Fecha: str
    Turno_Hora: str
    Turno_Paciente_nroPaciente: int


class RecetaCreate(BaseModel):
    Turno_Fecha: str
    Turno_Hora: str
    Turno_Paciente_nroPaciente: int
    Medicamentos_Ids: List[int] 


class DetalleRecetaOut(BaseModel):
    Medicamento: MedicamentoOut

    class Config:
        orm_mode = True


class RecetaOut(RecetaBase):
    Id: int
    detalles: List[DetalleRecetaOut]

    class Config:
        orm_mode = True
