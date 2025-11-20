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
        raise HTTPException(status_code=404, detail="Consultorio no encontrado")

    return cons


def create_consultorio(db: Session, data: ConsultorioCreate):
    nuevo = Consultorio(**data.dict())
    db.add(nuevo)
    try:
        db.commit()
        db.refresh(nuevo)
        return nuevo
    except:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="El consultorio ya existe o la sucursal no es válida"
        )


def delete_consultorio(db: Session, numero: int, sucursal_id: int):
    cons = get_consultorio(db, numero, sucursal_id)
    try:
        db.delete(cons)
        db.commit()
        return {"detail": "Consultorio eliminado"}
    except:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo eliminar el consultorio"
        )
