from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import date

class TurnoBase(BaseModel):
    Medico_Matricula: str = Field(alias="Matrícula Médico")
    Especialidad_Id: int = Field(alias="Especialidad")
    Consultorio_Numero: Optional[int] = Field(alias="Número Consultorio")
    Consultorio_Sucursal_Id: Optional[int] = Field(alias="Sucursal Consultorio")
    Duracion: Optional[int] = Field(alias="Duración")
    Motivo: Optional[str] = Field(alias="Motivo")
    Diagnostico: Optional[str] = Field(alias="Diagnóstico")

class TurnoCreate(TurnoBase):
    Fecha: date = Field(alias="Fecha")
    Hora: str = Field(alias="Hora")
    Paciente_nroPaciente: int = Field(alias="Número Paciente")
    model_config = ConfigDict(populate_by_name=True)

class TurnoUpdate(TurnoBase):
    pass

class TurnoOut(TurnoBase):
    Fecha: date
    Hora: str
    Paciente_nroPaciente: int
    estado: Optional[str]

    class Config:
        from_attributes = True
        populate_by_name = True