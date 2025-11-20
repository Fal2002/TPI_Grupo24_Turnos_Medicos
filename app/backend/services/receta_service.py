from sqlalchemy.orm import Session, joinedload
from app.backend.models.models import Receta, Turno, DetalleReceta

def crear_receta(db: Session, data):
    turno = db.query(Turno).filter(
        Turno.Fecha == data.Turno_Fecha,
        Turno.Hora == data.Turno_Hora,
        Turno.Paciente_nroPaciente == data.Turno_Paciente_nroPaciente
    ).first()

    if not turno:
        raise Exception("El turno especificado no existe")

    receta = Receta(
        Turno_Fecha=data.Turno_Fecha,
        Turno_Hora=data.Turno_Hora,
        Turno_Paciente_nroPaciente=data.Turno_Paciente_nroPaciente,
    )
    db.add(receta)
    db.commit()
    db.refresh(receta)

    # asociar detalles existentes
    for det_id in getattr(data, "Detalles_Ids", []):
        detalle = db.query(DetalleReceta).filter(DetalleReceta.Id == det_id).first()
        if not detalle:
            raise Exception(f"Detalle con ID {det_id} no existe")
        detalle.Receta_Id = receta.Id

    db.commit()
    db.refresh(receta)
    return receta

def get_recetas(db: Session):
    return db.query(Receta).options(
        joinedload(Receta.detalles).joinedload(DetalleReceta.medicamento)
    ).all()

def get_receta_by_id(db: Session, receta_id: int):
    return db.query(Receta).options(
        joinedload(Receta.detalles).joinedload(DetalleReceta.medicamento)
    ).filter(Receta.Id == receta_id).first()

def eliminar_receta(db: Session, receta_id: int):
    receta = get_receta_by_id(db, receta_id)
    if not receta:
        raise Exception("Receta no encontrada")
    db.delete(receta)
    db.commit()
    return True