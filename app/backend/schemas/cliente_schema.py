from pydantic import BaseModel
from typing import Optional


class ClienteBase(BaseModel):
    Nombre: str
    Apellido: str
    Telefono: Optional[str] = None
    Email: Optional[str] = None


class ClienteCreate(ClienteBase):
    pass


class ClienteSchema(ClienteBase):
    nroPaciente: int

    class Config:
        orm_mode = True
