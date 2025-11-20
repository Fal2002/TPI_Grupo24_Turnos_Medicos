from pydantic import BaseModel, EmailStr
from typing import Optional

class PacienteBase(BaseModel):
    Nombre: str
    Apellido: str
    Teléfono: Optional[str]
    Email: Optional[EmailStr]

class PacienteCreate(PacienteBase):
    pass

class PacienteOut(PacienteBase):
    nroPaciente: int

    class Config:
        orm_mode = True