from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Medicamento
from app.backend.schemas.medicamento import MedicamentoCreate

def get_medicamentos(db: Session):
    return db.query(Medicamento).all()


def get_medicamento_by_id(db: Session, id: int):
    med = db.query(Medicamento).filter(Medicamento.Id == id).first()
    if not med:
        raise HTTPException(404, "Medicamento no encontrado")
    return med


def create_medicamento(db: Session, data: MedicamentoCreate):
    nuevo = Medicamento(**data.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo