from pydantic import BaseModel
from datetime import date

class RecetaBase(BaseModel):
    Turno_Fecha: date
    Turno_Hora: str
    Turno_Paciente_nroPaciente: int

class RecetaCreate(RecetaBase):
    pass

class RecetaOut(RecetaBase):

    Id: int
    model_config = {
        "from_attributes": True
    }