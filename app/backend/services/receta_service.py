from sqlalchemy.orm import Session
from app.backend.models.models import Receta, DetalleReceta, Medicamento, Turno
from app.backend.schemas.receta import RecetaCreate


def crear_receta(db: Session, data: RecetaCreate):
    turno = db.query(Turno).filter(
        Turno.Fecha == data.turno_fecha,
        Turno.Hora == data.turno_hora,
        Turno.Paciente_nroPaciente == data.turno_paciente_nroPaciente
    ).first()

    if not turno:
        raise Exception("El turno especificado no existe")

    receta = Receta(
        Turno_Fecha=data.turno_fecha,
        Turno_Hora=data.turno_hora,
        Turno_Paciente_nroPaciente=data.turno_paciente_nroPaciente,
    )
    db.add(receta)
    db.commit()
    db.refresh(receta)

    for med_id in data.medicamentos_ids:
        medicamento = db.query(Medicamento).filter(Medicamento.Id == med_id).first()
        if not medicamento:
            raise Exception(f"Medicamento con ID {med_id} no existe")

        detalle = DetalleReceta(
            Receta_Id=receta.Id,
            Medicamento_Id=med_id
        )
        db.add(detalle)

    db.commit()
    db.refresh(receta)

    return receta


def get_recetas(db: Session):
    return db.query(Receta).all()


def get_receta_by_id(db: Session, receta_id: int):
    return db.query(Receta).filter(Receta.Id == receta_id).first()


def eliminar_receta(db: Session, receta_id: int):
    receta = get_receta_by_id(db, receta_id)
    if not receta:
        raise Exception("Receta no encontrada")
    db.delete(receta)
    db.commit()
    return True