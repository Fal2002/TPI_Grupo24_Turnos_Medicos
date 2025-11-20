from sqlalchemy.orm import Session
from app.backend.models.models import DetalleReceta, Medicamento
from app.backend.schemas.detalle_receta import DetalleRecetaOut

def crear_detalle(db: Session, medicamento_id: int):
    medicamento = db.query(Medicamento).filter(Medicamento.Id == medicamento_id).first()
    if not medicamento:
        raise Exception("Medicamento no existe")

    detalle = DetalleReceta(Medicamento_Id=medicamento_id)
    db.add(detalle)
    db.commit()
    db.refresh(detalle)
    return detalle

def asociar_detalle_a_receta(db: Session, receta_id: int, detalle_id: int):
    detalle = db.query(DetalleReceta).filter(DetalleReceta.Id == detalle_id).first()
    if not detalle:
        raise Exception("Detalle no encontrado")
    detalle.Receta_Id = receta_id
    db.commit()
    db.refresh(detalle)
    return detalle

def eliminar_detalle(db: Session, detalle_id: int):
    detalle = db.query(DetalleReceta).filter(DetalleReceta.Id == detalle_id).first()
    if not detalle:
        raise Exception("Detalle no encontrado")
    db.delete(detalle)
    db.commit()
    return True

def get_detalles(db: Session):
    return db.query(DetalleReceta).all()

def get_detalle_by_id(db: Session, detalle_id: int):
    detalle = db.query(DetalleReceta).filter(DetalleReceta.Id == detalle_id).first()
    if not detalle:
        raise Exception("Detalle no encontrado")
    return detalle