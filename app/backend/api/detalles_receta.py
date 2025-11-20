from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.detalle_receta_service import (
    agregar_medicamento_a_receta, eliminar_detalle_receta
)

router = APIRouter(prefix="/detalles-receta", tags=["Detalles Receta"])


@router.post("/{receta_id}/{medicamento_id}")
def agregar(receta_id: int, medicamento_id: int, db: Session = Depends(get_db)):
    return agregar_medicamento_a_receta(db, receta_id, medicamento_id)


@router.delete("/{receta_id}/{medicamento_id}")
def eliminar(receta_id: int, medicamento_id: int, db: Session = Depends(get_db)):
    eliminar_detalle_receta(db, receta_id, medicamento_id)
    return {"mensaje": "Medicamento eliminado de la receta"}