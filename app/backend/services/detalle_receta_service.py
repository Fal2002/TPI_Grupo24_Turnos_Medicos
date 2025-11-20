from sqlalchemy.orm import Session
from app.backend.models.models import DetalleReceta, Receta, Medicamento


def agregar_medicamento_a_receta(db: Session, receta_id: int, medicamento_id: int):
    receta = db.query(Receta).filter(Receta.Id == receta_id).first()
    if not receta:
        raise Exception("La receta no existe")

    medicamento = db.query(Medicamento).filter(Medicamento.Id == medicamento_id).first()
    if not medicamento:
        raise Exception("Medicamento no existe")

    existe = db.query(DetalleReceta).filter(
        DetalleReceta.Receta_Id == receta_id,
        DetalleReceta.Medicamento_Id == medicamento_id
    ).first()

    if existe:
        raise Exception("El medicamento ya está asociado a la receta")

    detalle = DetalleReceta(
        Receta_Id=receta_id,
        Medicamento_Id=medicamento_id
    )
    db.add(detalle)
    db.commit()
    db.refresh(detalle)
    return detalle


def eliminar_detalle_receta(db: Session, receta_id: int, medicamento_id: int):
    detalle = db.query(DetalleReceta).filter(
        DetalleReceta.Receta_Id == receta_id,
        DetalleReceta.Medicamento_Id == medicamento_id
    ).first()

    if not detalle:
        raise Exception("Detalle no encontrado")

    db.delete(detalle)
    db.commit()
    return True