from pydantic import BaseModel
from app.backend.schemas.medicamento import MedicamentoOut

class DetalleRecetaCreate(BaseModel):
    Medicamento_Id: int

class DetalleRecetaOut(BaseModel):
    Id: int
    medicamento: MedicamentoOut

    class Config:
        from_attributes = True

DetalleRecetaOut.update_forward_refs()
