from pydantic import BaseModel

class EspecialidadBase(BaseModel):
    descripcion: str

class EspecialidadCreate(EspecialidadBase):
    pass

class EspecialidadUpdate(BaseModel):
    descripcion: str | None = None

class EspecialidadOut(EspecialidadBase):
    Id_especialidad: int

    class Config:
        from_attributes = True  # reemplaza orm_mode
