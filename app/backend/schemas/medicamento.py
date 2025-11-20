from pydantic import BaseModel

<<<<<<< HEAD

# --- Dosis ---
class DosisCreate(BaseModel):
    cantidad: float
    unidad: str
    frecuencia: str


class DosisUpdate(BaseModel):
    cantidad: Optional[float] = None
    unidad: Optional[str] = None
    frecuencia: Optional[str] = None


# --- Medicamento ---
=======

>>>>>>> cambios-en-backend
class MedicamentoBase(BaseModel):
    Nombre: str
    Cantidad: float
    Unidad: str
    Frecuencia: str
    Droga_Id: int



class MedicamentoCreate(MedicamentoBase):
    pass

<<<<<<< HEAD

class MedicamentoUpdate(BaseModel):
    Nombre: Optional[str] = None
    Droga_Id: Optional[int] = None
    dosis: Optional[DosisUpdate] = None


# --- Salida ---
class DrogaNested(BaseModel):
=======

class MedicamentoOut(MedicamentoBase):
>>>>>>> cambios-en-backend
    Id: int

    class Config:
<<<<<<< HEAD
        from_attributes = True


class MedicamentoOut(BaseModel):
    Id: int
    Nombre: str
    Droga: Optional[DrogaNested] = None
    Dosis: Optional[dict] = None

    @classmethod
    def from_orm_obj(cls, med):
        dosis = (
            {
                "dosis_cantidad": med.dosis_cantidad,
                "dosis_unidad": med.dosis_unidad,
                "dosis_frecuencia": med.dosis_frecuencia,
            }
            if any([med.dosis_cantidad, med.dosis_unidad, med.dosis_frecuencia])
            else None
        )

        return cls(
            Id=med.Id,
            Nombre=med.Nombre,
            Droga=getattr(med, "droga", None),  # nombre de la relación en SQLAlchemy
            Dosis=dosis,
        )

    class Config:
        from_attributes = True
=======
        from_attributes = True
>>>>>>> cambios-en-backend
