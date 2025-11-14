from pydantic import BaseModel, Field
from datetime import date

# ============================
# SCHEMA DE ENTRADA (POST)
# ============================
class TurnoCreate(BaseModel):
    fecha: date
    hora: str
    paciente_nroPaciente: int
    medico_matricula: str
    especialidad_id: int
    sucursal_id: int | None = None
    duracion: int | None = None
    motivo: str | None = None


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

    class Config:
        from_attributes = True
        populate_by_name = True
