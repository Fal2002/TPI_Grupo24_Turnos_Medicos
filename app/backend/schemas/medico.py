from pydantic import BaseModel
from typing import Optional, List

class MedicoBase(BaseModel):
    Nombre: str
    Apellido: str

class MedicoCreate(MedicoBase):
    Matricula: str
    email_login: str
    password_temporal: str
    especialidades: List[int] 


class MedicoUpdate(BaseModel):
    Nombre: Optional[str] = None
    Apellido: Optional[str] = None


class MedicoOut(MedicoBase):
    Matricula: str
    email_login: Optional[str]
    especialidades: List[int] 

    class Config:
        from_attributes = True