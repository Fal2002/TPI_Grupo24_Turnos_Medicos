from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Consultorio
from app.backend.schemas.consultorio import ConsultorioCreate

<<<<<<< HEAD

def crear_consultorio(db: Session, payload):
    consultorio = Consultorio(Numero=payload.Numero, Sucursal_Id=payload.Sucursal_Id)

    db.add(consultorio)

    try:
        db.commit()
        db.refresh(consultorio)
        return consultorio
    except:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="El consultorio ya existe o la sucursal no es válida",
        )


def obtener_consultorios(
    db: Session, sucursal_id: Optional[int] = None, numero: Optional[int] = None
):
    query = db.query(Consultorio)
    if sucursal_id is not None:
        query = query.filter(Consultorio.Sucursal_Id == sucursal_id)
    if numero is not None:
        query = query.filter(Consultorio.Numero == numero)
    return query.all()


def obtener_consultorio(db: Session, numero: int, sucursal_id: int):
    consultorio = (
        db.query(Consultorio)
        .filter(Consultorio.Numero == numero, Consultorio.Sucursal_Id == sucursal_id)
        .first()
    )
=======
def get_consultorios(db: Session):
    return db.query(Consultorio).all()


def get_consultorio(db: Session, numero: int, sucursal_id: int):
    cons = db.query(Consultorio).filter(
        Consultorio.Numero == numero,
        Consultorio.Sucursal_Id == sucursal_id
    ).first()
>>>>>>> cambios-en-backend

    if not cons:
        raise HTTPException(404, "Consultorio no encontrado")

    return cons


def create_consultorio(db: Session, data: ConsultorioCreate):
    nuevo = Consultorio(**data.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def delete_consultorio(db: Session, numero: int, sucursal_id: int):
    cons = get_consultorio(db, numero, sucursal_id)
    db.delete(cons)
    db.commit()
    return {"detail": "Consultorio eliminado"}