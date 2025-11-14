from pydantic import BaseModel
from typing import Optional

class MedicoBase(BaseModel):
    Nombre: str
    Apellido: str

class MedicoCreate(MedicoBase):
    Matricula: str

class MedicoUpdate(BaseModel):
    Nombre: Optional[str] = None
    Apellido: Optional[str] = None

class MedicoOut(MedicoBase):
    Matricula: str

    class Config:
        from_attributes = True
