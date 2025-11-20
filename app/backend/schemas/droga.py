from pydantic import BaseModel

class DrogaBase(BaseModel):
    Descripcion: str

class DrogaCreate(DrogaBase):
    pass

class DrogaOut(DrogaBase):
    Id: int

    class Config:
        from_attributes = True