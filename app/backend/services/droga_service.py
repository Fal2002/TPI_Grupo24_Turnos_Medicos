from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Droga
from app.backend.schemas.droga import DrogaCreate

def get_drogas(db: Session):
    return db.query(Droga).all()


def get_droga_by_id(db: Session, id: int):
    d = db.query(Droga).filter(Droga.Id == id).first()
    if not d:
        raise HTTPException(404, "Droga no encontrada")
    return d


def create_droga(db: Session, data: DrogaCreate):
    nueva = Droga(**data.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva