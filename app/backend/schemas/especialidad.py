from pydantic import BaseModel
from typing import Optional

class EspecialidadBase(BaseModel):
    descripcion: str


class EspecialidadUpdate(BaseModel):
    descripcion: Optional[str] = None

class EspecialidadCreate(EspecialidadBase):
    pass

class EspecialidadOut(EspecialidadBase):
    Id_especialidad: int

    class Config:
        from_attributes = True