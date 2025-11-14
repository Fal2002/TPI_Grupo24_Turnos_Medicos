from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Consultorio

def crear_consultorio(db: Session, payload):
    consultorio = Consultorio(
        Numero=payload.Numero,
        Sucursal_Id=payload.Sucursal_Id
    )

    db.add(consultorio)

    try:
        db.commit()
        db.refresh(consultorio)
        return consultorio
    except:
        db.rollback()
        raise HTTPException(status_code=400, detail="El consultorio ya existe o la sucursal no es válida")


def obtener_consultorios(db: Session):
    return db.query(Consultorio).all()


def obtener_consultorio(db: Session, numero: int, sucursal_id: int):
    consultorio = db.query(Consultorio).filter(
        Consultorio.Numero == numero,
        Consultorio.Sucursal_Id == sucursal_id
    ).first()

    if not consultorio:
        raise HTTPException(status_code=404, detail="Consultorio no encontrado")

    return consultorio


def eliminar_consultorio(db: Session, numero: int, sucursal_id: int):
    consultorio = obtener_consultorio(db, numero, sucursal_id)
    db.delete(consultorio)
    db.commit()
    return {"msg": "Consultorio eliminado correctamente"}
