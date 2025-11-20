from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Especialidad
from app.backend.schemas.especialidad import EspecialidadCreate

def get_especialidades(db: Session):
    return db.query(Especialidad).all()


def get_especialidad_by_id(db: Session, id: int):
    esp = db.query(Especialidad).filter(Especialidad.Id_especialidad == id).first()
    if not esp:
        raise HTTPException(404, "Especialidad no encontrada")
    return esp


def create_especialidad(db: Session, data: EspecialidadCreate):
    nueva = Especialidad(**data.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


def delete_especialidad(db: Session, id: int):
    esp = get_especialidad_by_id(db, id)
    db.delete(esp)
    db.commit()
    return {"detail": "Especialidad eliminada"}