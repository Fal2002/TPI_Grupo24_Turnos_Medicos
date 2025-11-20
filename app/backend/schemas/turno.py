from pydantic import BaseModel
from typing import Optional
from datetime import date

class TurnoBase(BaseModel):
    Fecha: date
    Hora: str
    Paciente_nroPaciente: int
    Medico_Matricula: str
    Especialidad_Id: int
    Estado_Id: Optional[int]
    Consultorio_Numero: Optional[int]
    Consultorio_Sucursal_Id: Optional[int]
    Duracion: Optional[int]
    Motivo: Optional[str]
    Diagnostico: Optional[str]

class TurnoCreate(BaseModel):
    Fecha: date
    Hora: str
    Paciente_nroPaciente: int
    Medico_Matricula: str
    Especialidad_Id: int
    Consultorio_Numero: int
    Consultorio_Sucursal_Id: int
    Duracion: Optional[int]
    Motivo: Optional[str]
    Diagnostico: Optional[str]

class TurnoUpdate(BaseModel):
    Medico_Matricula: Optional[str]
    Especialidad_Id: Optional[int]
    Consultorio_Numero: Optional[int]
    Consultorio_Sucursal_Id: Optional[int]
    Duracion: Optional[int]
    Motivo: Optional[str]
    Diagnostico: Optional[str]
    Estado_Id: Optional[int]

class TurnoOut(TurnoBase):
    estado: Optional[str]
    class Config:
        from_attributes = True