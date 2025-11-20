from pydantic import BaseModel
from typing import Optional

class DetalleRecetaBase(BaseModel):
    Medicamento_Id: int

class DetalleRecetaCreate(DetalleRecetaBase):
    pass

class DetalleRecetaOut(BaseModel):
    Receta_Id: int
    Medicamento_Id: int

    class Config:
        orm_mode = True
