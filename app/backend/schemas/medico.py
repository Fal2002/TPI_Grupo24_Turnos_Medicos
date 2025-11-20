from pydantic import BaseModel
from typing import Optional, List

class MedicoBase(BaseModel):
    Matricula: str
    Nombre: str
    Apellido: str

class MedicoCreate(MedicoBase):
    especialidades: List[int] 

class MedicoOut(MedicoBase):
    especialidades: List[int] 

    class Config:
        orm_mode = True