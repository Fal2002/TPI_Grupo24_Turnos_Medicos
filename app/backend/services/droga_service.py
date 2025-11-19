from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Droga
from app.backend.schemas.droga import DrogaCreate, DrogaUpdate

def crear_droga(db: Session, data: DrogaCreate):
    nueva = Droga(Descripcion=data.Descripcion)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

def listar_drogas(db: Session):
    return db.query(Droga).all()

def obtener_droga(db: Session, id: int):
    droga = db.query(Droga).filter(Droga.Id == id).first()
    if not droga:
        raise HTTPException(status_code=404, detail="Droga no encontrada")
    return droga

def actualizar_droga(db: Session, id: int, data: DrogaUpdate):
    droga = obtener_droga(db, id)
    if data.Descripcion is not None:
        droga.Descripcion = data.Descripcion
    db.commit()
    db.refresh(droga)
    return droga

def eliminar_droga(db: Session, id: int):
    droga = obtener_droga(db, id)
    db.delete(droga)
    db.commit()
    return {"msg": "Droga eliminada correctamente"}