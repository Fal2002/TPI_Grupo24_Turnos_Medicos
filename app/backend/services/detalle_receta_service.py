from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.backend.models.models import DetalleReceta
from app.backend.schemas.detalle_receta import DetalleRecetaCreate

def crear_detalle_receta(db: Session, data: DetalleRecetaCreate):
    detalle = DetalleReceta(
        Receta_Id=data.Receta_Id,
        Medicamento_Id=data.Medicamento_Id,
        Dosis=data.Dosis,
        Frecuencia=data.Frecuencia
    )
    db.add(detalle)
    db.commit()
    db.refresh(detalle)
    return detalle

def listar_detalles(db: Session):
    return db.query(DetalleReceta).all()

def obtener_detalle(db: Session, id: int):
    det = db.query(DetalleReceta).filter(DetalleReceta.Id == id).first()
    if not det:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return det

def eliminar_detalle(db: Session, id: int):
    det = obtener_detalle(db, id)
    db.delete(det)
    db.commit()
    return {"msg": "Detalle de receta eliminado correctamente"}