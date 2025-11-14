from pydantic import BaseModel

class SucursalBase(BaseModel):
    Nombre: str
    Direccion: str | None = None

class SucursalCreate(SucursalBase):
    pass

class SucursalOut(SucursalBase):
    Id: int

    class Config:
        from_attributes = True
