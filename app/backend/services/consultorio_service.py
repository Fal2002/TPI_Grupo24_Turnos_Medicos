from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Consultorio
from app.backend.schemas.consultorio import ConsultorioCreate

def get_consultorios(db: Session):
    return db.query(Consultorio).all()


def get_consultorio(db: Session, numero: int, sucursal_id: int):
    cons = db.query(Consultorio).filter(
        Consultorio.Numero == numero,
        Consultorio.Sucursal_Id == sucursal_id
    ).first()

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