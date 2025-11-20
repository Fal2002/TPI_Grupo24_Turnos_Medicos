from pydantic import BaseModel, Field, ConfigDict

class MedicamentoBase(BaseModel):
    nombre: str = Field(alias="Nombre")
    dosis: str | None = Field(default=None, alias="dosis")
    droga_id: int | None = Field(default=None, alias="Droga_Id")

    model_config = ConfigDict(populate_by_name=True)

class MedicamentoCreate(MedicamentoBase):
    pass

class MedicamentoOut(MedicamentoBase):
    id: int = Field(alias="Id")

    class Config:
        from_attributes = True
        populate_by_name = True
