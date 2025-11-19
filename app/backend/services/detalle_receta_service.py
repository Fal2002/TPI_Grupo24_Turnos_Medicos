from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
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
    try:
        db.commit()
        db.refresh(detalle)
        return detalle
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Detalle ya existe o Receta/Medicamento no son válidos."
        )


def listar_detalles(db: Session):
    return db.query(DetalleReceta).all()

def obtener_detalle(db: Session, receta_id: int, medicamento_id: int):
    det = db.query(DetalleReceta).filter(
        DetalleReceta.Receta_Id == receta_id,
        DetalleReceta.Medicamento_Id == medicamento_id
    ).first()
    if not det:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return det

def eliminar_detalle(db: Session, receta_id: int, medicamento_id: int):
    det = obtener_detalle(db, receta_id, medicamento_id)
    db.delete(det)
    db.commit()
    return {"msg": "Detalle de receta eliminado correctamente"}