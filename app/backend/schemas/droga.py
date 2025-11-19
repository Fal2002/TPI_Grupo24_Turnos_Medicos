from pydantic import BaseModel

class DrogaBase(BaseModel):
    Descripcion: str

class DrogaCreate(DrogaBase):
    pass

class DrogaUpdate(BaseModel):
    Descripcion: str | None = None

class DrogaOut(DrogaBase):
    Id: int

    model_config = {
        "from_attributes": True
    }