<<<<<<< HEAD
from pydantic import BaseModel, Field, ConfigDict
=======
from pydantic import BaseModel
from typing import Optional
>>>>>>> cambios-en-backend
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
<<<<<<< HEAD
    fecha: date = Field(alias="Fecha")
    hora: str = Field(alias="Hora")  # Formato "HH:MM"
    paciente_nroPaciente: int = Field(alias="Paciente_nroPaciente")
    medico_matricula: str = Field(alias="Medico_Matricula")
    especialidad_id: int = Field(alias="Especialidad_Id")
    
    sucursal_id: int | None = Field(default=None, alias="Sucursal_Id")
    duracion: int | None = Field(default=None, alias="Duracion")
    motivo: str | None = Field(default=None, alias="Motivo")

    model_config = ConfigDict(populate_by_name=True)
=======
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
>>>>>>> cambios-en-backend

class TurnoUpdate(BaseModel):
    Medico_Matricula: Optional[str]
    Especialidad_Id: Optional[int]
    Consultorio_Numero: Optional[int]
    Consultorio_Sucursal_Id: Optional[int]
    Duracion: Optional[int]
    Motivo: Optional[str]
    Diagnostico: Optional[str]
    Estado_Id: Optional[int]

<<<<<<< HEAD
# ============================
# SCHEMA DE SALIDA
# ============================
class TurnoOut(BaseModel):
    fecha: str = Field(alias="Fecha")
    hora: str = Field(alias="Hora")
    paciente_nroPaciente: int = Field(alias="Paciente_nroPaciente")
    medico_matricula: str = Field(alias="Medico_Matricula")
    especialidad_id: int = Field(alias="Especialidad_Id")
    estado: str | None = Field(default=None)   # <-- se usa la propiedad @property "estado"
    motivo: str | None = Field(default=None, alias="Motivo")
    diagnostico: str | None = Field(default=None, alias="Diagnostico")
    
    # Campos agregados para visualización
    medico_nombre: str | None = Field(default=None)
    medico_apellido: str | None = Field(default=None)
    especialidad_descripcion: str | None = Field(default=None)

    class Config:
        from_attributes = True
        populate_by_name = True

class TurnoUpdate(BaseModel):
    fecha: date | None = Field(default=None, alias="Fecha")
    hora: str | None = Field(default=None, alias="Hora")
    motivo: str | None = Field(default=None, alias="Motivo")
    diagnostico: str | None = Field(default=None, alias="Diagnostico")

    model_config = ConfigDict(populate_by_name=True)
=======
class TurnoOut(TurnoBase):
    estado: Optional[str]
    class Config:
        from_attributes = True
>>>>>>> cambios-en-backend
