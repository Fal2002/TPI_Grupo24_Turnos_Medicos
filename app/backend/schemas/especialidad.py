from pydantic import BaseModel
from typing import Optional

class EspecialidadBase(BaseModel):
    descripcion: str

class EspecialidadCreate(EspecialidadBase):
    pass

class EspecialidadOut(EspecialidadBase):
    Id_especialidad: int

    class Config:
        from_attributes = True