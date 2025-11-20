from typing import Optional
from sqlalchemy.orm import Session
<<<<<<< HEAD
from app.backend.models.models import Especialidad
from app.backend.schemas.especialidad import EspecialidadCreate, EspecialidadUpdate


def crear_especialidad(db: Session, payload: EspecialidadCreate):
    nueva = Especialidad(descripcion=payload.descripcion)
=======
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
>>>>>>> cambios-en-backend
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

<<<<<<< HEAD

def obtener_especialidades(
    db: Session, nombre: Optional[str] = None, id: Optional[int] = None
):
    query = db.query(Especialidad)
    if id is not None:
        query = query.filter(Especialidad.Id_especialidad == id)
    if nombre is not None:
        query = query.filter(Especialidad.descripcion.ilike(f"%{nombre}%"))
    return query.all()


def obtener_especialidad(db: Session, especialidad_id: int):
    return (
        db.query(Especialidad)
        .filter(Especialidad.Id_especialidad == especialidad_id)
        .first()
    )


def actualizar_especialidad(
    db: Session, especialidad_id: int, payload: EspecialidadUpdate
):
    esp = obtener_especialidad(db, especialidad_id)
    if not esp:
        return None

    if payload.descripcion is not None:
        esp.descripcion = payload.descripcion
    if payload.descripcion is not None:
        esp.descripcion = payload.descripcion

    db.commit()
    db.refresh(esp)
    return esp


def eliminar_especialidad(db: Session, especialidad_id: int):
    esp = obtener_especialidad(db, especialidad_id)
    if not esp:
        return False
=======
>>>>>>> cambios-en-backend

def delete_especialidad(db: Session, id: int):
    esp = get_especialidad_by_id(db, id)
    db.delete(esp)
    db.commit()
<<<<<<< HEAD
    return True
=======
    return {"detail": "Especialidad eliminada"}
>>>>>>> cambios-en-backend
