from pydantic import BaseModel, Field, ConfigDict
from datetime import date

# ============================
# SCHEMA DE ENTRADA (POST)
# ============================
class TurnoCreate(BaseModel):
    fecha: date = Field(alias="Fecha")
    hora: str = Field(alias="Hora")  # Formato "HH:MM"
    paciente_nroPaciente: int = Field(alias="Paciente_nroPaciente")
    medico_matricula: str = Field(alias="Medico_Matricula")
    especialidad_id: int = Field(alias="Especialidad_Id")
    
    sucursal_id: int | None = Field(default=None, alias="Sucursal_Id")
    duracion: int | None = Field(default=None, alias="Duracion")
    motivo: str | None = Field(default=None, alias="Motivo")

    model_config = ConfigDict(populate_by_name=True)


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
