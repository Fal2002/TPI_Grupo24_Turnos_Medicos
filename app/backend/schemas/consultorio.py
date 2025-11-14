from pydantic import BaseModel

class ConsultorioBase(BaseModel):
    Numero: int
    Sucursal_Id: int

    class Config:
        from_attributes = True

class ConsultorioCreate(ConsultorioBase):
    pass

class ConsultorioOut(ConsultorioBase):
    pass
