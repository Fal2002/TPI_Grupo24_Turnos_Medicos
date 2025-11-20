from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Turno
from app.backend.schemas.turno import TurnoCreate, TurnoUpdate

def get_turnos(db: Session):
    return db.query(Turno).all()


def get_turno(db: Session, fecha: str, hora: str, paciente_id: int):
    t = db.query(Turno).filter(
        Turno.Fecha == fecha,
        Turno.Hora == hora,
        Turno.Paciente_nroPaciente == paciente_id
    ).first()

    if not t:
        raise HTTPException(404, "Turno no encontrado")

    return t


def create_turno(db: Session, data: TurnoCreate):
    nuevo = Turno(**data.dict())
    nuevo.Estado_Id = 1
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def update_turno(db: Session, fecha: str, hora: str, paciente_id: int, data: TurnoUpdate):
    t = get_turno(db, fecha, hora, paciente_id)

    for k, v in data.dict(exclude_unset=True).items():
        setattr(t, k, v)

    db.commit()
    db.refresh(t)
    return t


def delete_turno(db: Session, fecha: str, hora: str, paciente_id: int):
    t = get_turno(db, fecha, hora, paciente_id)
    db.delete(t)
    db.commit()
    return {"detail": "Turno eliminado"}