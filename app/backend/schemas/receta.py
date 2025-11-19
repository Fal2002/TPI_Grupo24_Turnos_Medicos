from pydantic import BaseModel

class RecetaBase(BaseModel):
    Turno_Fecha: str
    Turno_Hora: str
    Turno_Paciente_nroPaciente: int

class RecetaCreate(RecetaBase):
    pass

class RecetaOut(RecetaBase):
    Id: int

    model_config = {
        "from_attributes": True
    }