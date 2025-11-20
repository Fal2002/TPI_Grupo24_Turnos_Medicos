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
<<<<<<< HEAD
    UltimaVisita: Optional[str] = None
    ProximoTurno: Optional[str] = None
=======

>>>>>>> cambios-en-backend
    class Config:
        from_attributes = True