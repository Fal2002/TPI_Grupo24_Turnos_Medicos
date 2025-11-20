from pydantic import BaseModel

class EstadoBase(BaseModel):
    Descripcion: str

class EstadoCreate(EstadoBase):
    pass

class EstadoOut(EstadoBase):
    Id: int

    class Config:
        from_attributes = True