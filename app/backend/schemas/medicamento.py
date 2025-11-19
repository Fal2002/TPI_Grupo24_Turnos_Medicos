from pydantic import BaseModel

class DosisBase(BaseModel):
    cantidad: float
    unidad: str
    frecuencia: str

class DosisCreate(DosisBase):
    pass

class DosisUpdate(BaseModel):
    cantidad: float | None = None
    unidad: str | None = None
    frecuencia: str | None = None

class MedicamentoBase(BaseModel):
    Nombre: str
    Droga_Id: int | None = None

class MedicamentoCreate(MedicamentoBase):
    dosis: DosisCreate

class MedicamentoUpdate(BaseModel):
    Nombre: str | None = None
    Droga_Id: int | None = None
    dosis: DosisUpdate | None = None

class DrogaNested(BaseModel):
    Id: int
    Descripcion: str

    model_config = {"from_attributes": True}

class MedicamentoOut(BaseModel):
    Id: int
    Nombre: str
    Droga: DrogaNested | None
    Dosis: dict | None

    @classmethod
    def model_validate(cls, med):
        dosis = None
        if med.dosis_cantidad is not None or med.dosis_unidad is not None or med.dosis_frecuencia is not None:
            dosis = {
                "cantidad": med.dosis_cantidad,
                "unidad": med.dosis_unidad,
                "frecuencia": med.dosis_frecuencia
            }
        return cls(
            Id=med.Id,
            Nombre=med.Nombre,
            Droga=med.droga,
            Dosis=dosis
        )

    class Config:
        from_attributes = True