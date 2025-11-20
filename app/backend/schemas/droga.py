from pydantic import BaseModel


class DrogaBase(BaseModel):
    Descripcion: str


class DrogaCreate(DrogaBase):
    pass

<<<<<<< HEAD

class DrogaUpdate(BaseModel):
    Descripcion: str | None = None


class DrogaOut(DrogaBase):
    Id: int

    model_config = {"from_attributes": True}
=======
class DrogaOut(DrogaBase):
    Id: int

    class Config:
        from_attributes = True
>>>>>>> cambios-en-backend
