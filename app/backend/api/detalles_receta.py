from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.detalle_receta import DetalleRecetaCreate, DetalleRecetaOut
from app.backend.services import detalle_receta_service

router = APIRouter(prefix="/detalles-receta", tags=["Detalles Receta"])

@router.post("/", response_model=DetalleRecetaOut)
def crear_detalle(payload: DetalleRecetaCreate, db: Session = Depends(get_db)):
    return detalle_receta_service.crear_detalle_receta(db, payload)

@router.get("/", response_model=list[DetalleRecetaOut])
def listar_detalles(db: Session = Depends(get_db)):
    return detalle_receta_service.listar_detalles(db)

@router.get("/{id}", response_model=DetalleRecetaOut)
def obtener_detalle(id: int, db: Session = Depends(get_db)):
    return detalle_receta_service.obtener_detalle(db, id)

@router.delete("/{id}")
def eliminar_detalle(id: int, db: Session = Depends(get_db)):
    return detalle_receta_service.eliminar_detalle(db, id)