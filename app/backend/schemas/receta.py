from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

# ============================
# MEDICAMENTO
# ============================
class MedicamentoBase(BaseModel):
    nombre: str = Field(alias="Nombre")
    dosis: str | None = Field(default=None, alias="dosis")
    droga_id: int | None = Field(default=None, alias="Droga_Id")

    model_config = ConfigDict(populate_by_name=True)

class MedicamentoCreate(MedicamentoBase):
    pass

class MedicamentoOut(MedicamentoBase):
    id: int = Field(alias="Id")

    class Config:
        from_attributes = True
        populate_by_name = True

# ============================
# RECETA
# ============================
class RecetaCreate(BaseModel):
    turno_fecha: str = Field(alias="Turno_Fecha")
    turno_hora: str = Field(alias="Turno_Hora")
    turno_paciente_nro: int = Field(alias="Turno_Paciente_nroPaciente")

    model_config = ConfigDict(populate_by_name=True)

class RecetaOut(BaseModel):
    id: int = Field(alias="Id")
    turno_fecha: str = Field(alias="Turno_Fecha")
    turno_hora: str = Field(alias="Turno_Hora")
    turno_paciente_nro: int = Field(alias="Turno_Paciente_nroPaciente")
    
    class Config:
        from_attributes = True
        populate_by_name = True

class RecetaConMedicamentosOut(RecetaOut):
    medicamentos: List[MedicamentoOut] = Field(default_factory=list)
