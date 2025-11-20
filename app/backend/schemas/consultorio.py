from pydantic import BaseModel
from typing import Optional

class ConsultorioBase(BaseModel):
    Numero: int
    Sucursal_Id: int

class ConsultorioCreate(ConsultorioBase):
    pass

class ConsultorioOut(ConsultorioBase):
    class Config:
        orm_mode = True
