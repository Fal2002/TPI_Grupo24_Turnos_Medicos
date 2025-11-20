from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Paciente
from app.backend.schemas.paciente import PacienteCreate

def get_pacientes(db: Session):
    return db.query(Paciente).all()


def get_paciente_by_id(db: Session, id: int):
    pac = db.query(Paciente).filter(Paciente.nroPaciente == id).first()
    if not pac:
        raise HTTPException(404, "Paciente no encontrado")
    return pac


def create_paciente(db: Session, data: PacienteCreate):
    nuevo = Paciente(**data.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def update_paciente(db: Session, id: int, data: PacienteCreate):
    pac = get_paciente_by_id(db, id)
    for k, v in data.dict().items():
        setattr(pac, k, v)
    db.commit()
    db.refresh(pac)
    return pac


def delete_paciente(db: Session, id: int):
    pac = get_paciente_by_id(db, id)
    db.delete(pac)
    db.commit()
    return {"detail": "Paciente eliminado"}