from pydantic import BaseModel, Field, ConfigDict

class DrogaBase(BaseModel):
    descripcion: str = Field(alias="Descripcion")

    model_config = ConfigDict(populate_by_name=True)

class DrogaCreate(DrogaBase):
    pass

class DrogaOut(DrogaBase):
    id: int = Field(alias="Id")

    class Config:
        from_attributes = True
        populate_by_name = True
