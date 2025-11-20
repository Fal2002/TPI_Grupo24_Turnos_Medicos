from pydantic import BaseModel


class MedicamentoBase(BaseModel):
    Nombre: str
    Cantidad: float
    Unidad: str
    Frecuencia: str
    Droga_Id: int


class MedicamentoCreate(MedicamentoBase):
    pass


class MedicamentoOut(MedicamentoBase):
    Id: int

    class Config:
        orm_mode = True