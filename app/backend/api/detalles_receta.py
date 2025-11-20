from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.detalle_receta_service import (
    crear_detalle, eliminar_detalle, get_detalles, get_detalle_by_id
)
from app.backend.schemas.detalle_receta import DetalleRecetaOut, DetalleRecetaCreate

router = APIRouter(prefix="/detalles-receta", tags=["Detalles Receta"])

@router.post("/", response_model=DetalleRecetaOut)
def crear(data: DetalleRecetaCreate, db: Session = Depends(get_db)):
    return crear_detalle(db, data.Medicamento_Id)

@router.get("/", response_model=list[DetalleRecetaOut])
def listar(db: Session = Depends(get_db)):
    return get_detalles(db)

@router.get("/{detalle_id}", response_model=DetalleRecetaOut)
def obtener(detalle_id: int, db: Session = Depends(get_db)):
    return get_detalle_by_id(db, detalle_id)

@router.delete("/{detalle_id}")
def eliminar(detalle_id: int, db: Session = Depends(get_db)):
    eliminar_detalle(db, detalle_id)
    return {"mensaje": "Detalle eliminado"}