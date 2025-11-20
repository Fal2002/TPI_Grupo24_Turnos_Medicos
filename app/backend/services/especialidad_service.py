from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Especialidad
from app.backend.schemas.especialidad import EspecialidadCreate, EspecialidadUpdate


def get_especialidades(db: Session):
    return db.query(Especialidad).all()


def get_especialidad_by_id(db: Session, id: int):
    esp = db.query(Especialidad).filter(Especialidad.Id_especialidad == id).first()
    if not esp:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    return esp


def create_especialidad(db: Session, data: EspecialidadCreate):
    nueva = Especialidad(**data.dict())
    db.add(nueva)
    try:
        db.commit()
        db.refresh(nueva)
        return nueva
    except:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="La especialidad ya existe o los datos son inválidos"
        )


def update_especialidad(db: Session, id: int, data: EspecialidadUpdate):
    esp = get_especialidad_by_id(db, id)

    if data.descripcion is not None:
        esp.descripcion = data.descripcion

    try:
        db.commit()
        db.refresh(esp)
        return esp
    except:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo actualizar la especialidad"
        )


def delete_especialidad(db: Session, id: int):
    esp = get_especialidad_by_id(db, id)
    try:
        db.delete(esp)
        db.commit()
        return {"detail": "Especialidad eliminada"}
    except:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo eliminar la especialidad"
        )
