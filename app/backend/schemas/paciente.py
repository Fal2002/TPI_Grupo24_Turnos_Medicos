from pydantic import BaseModel, EmailStr
from typing import Optional

class PacienteBase(BaseModel):
    Nombre: str
    Apellido: str
    Teléfono: Optional[str] = None
    Email: Optional[EmailStr] = None

class PacienteCreate(PacienteBase):
    pass

class PacienteUpdate(BaseModel):
    Nombre: Optional[str] = None
    Apellido: Optional[str] = None
    Telefono: Optional[str] = None
    Email: Optional[EmailStr] = None
    
class PacienteOut(PacienteBase):
    nroPaciente: int

    class Config:
        from_attributes = True