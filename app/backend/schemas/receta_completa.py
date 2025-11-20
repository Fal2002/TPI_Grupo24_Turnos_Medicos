from pydantic import BaseModel

class MedicamentoRecetaOut(BaseModel):
    Id: int
    Nombre: str
    Droga_Id: int | None
    Dosis: dict | None

    model_config = {"from_attributes": True}

class RecetaCompletaOut(BaseModel):
    Receta_Id: int
    Fecha: str
    Hora: str
    Paciente: dict
    Medico: dict
    Especialidad: str | None
    Sucursal: str | None
    Medicamentos: list[MedicamentoRecetaOut]

    model_config = {"from_attributes": True}