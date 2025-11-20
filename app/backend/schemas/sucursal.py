from pydantic import BaseModel
from typing import Optional

class SucursalBase(BaseModel):
    Direccion: Optional[str]
    Nombre: str

class SucursalCreate(SucursalBase):
    pass

class SucursalOut(SucursalBase):
    Id: int

    class Config:
        orm_mode = True