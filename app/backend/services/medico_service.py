from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Medico, MedicoEspecialidad
from app.backend.schemas.medico import MedicoCreate

def get_medicos(db: Session):
    return db.query(Medico).all()


def get_medico_by_id(db: Session, matricula: str):
    med = db.query(Medico).filter(Medico.Matricula == matricula).first()
    if not med:
        raise HTTPException(404, "Médico no encontrado")
    return med


def create_medico(db: Session, data: MedicoCreate):
    especialidades = data.especialidades
    medico_data = data.dict(exclude={"especialidades"})

    nuevo = Medico(**medico_data)
    db.add(nuevo)
    db.commit()

    # Relación muchos a muchos
    for esp in especialidades:
        rel = MedicoEspecialidad(Medico_Matricula=nuevo.Matricula, Especialidad_Id=esp)
        db.add(rel)

    db.commit()
    db.refresh(nuevo)
    return nuevo


def delete_medico(db: Session, matricula: str):
    med = get_medico_by_id(db, matricula)
    db.delete(med)
    db.commit()
    return {"detail": "Médico eliminado"}