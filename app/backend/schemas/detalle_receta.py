from pydantic import BaseModel

class DetalleRecetaBase(BaseModel):
    Receta_Id: int
    Medicamento_Id: int
    Dosis: str | None = None
    Frecuencia: str | None = None

    class Config:
        from_attributes = True # Se agrega Config a Base para consistencia

class DetalleRecetaCreate(DetalleRecetaBase):
    pass

class DetalleRecetaOut(DetalleRecetaBase):
    pass