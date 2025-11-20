from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.medicamento_service import (
    get_medicamentos, get_medicamento_by_id, create_medicamento
)
from app.backend.schemas.medicamento import MedicamentoCreate, MedicamentoOut

router = APIRouter(prefix="/medicamentos", tags=["Medicamentos"])

@router.get("/", response_model=list[MedicamentoOut])
def listar(db: Session = Depends(get_db)):
    return get_medicamentos(db)

@router.get("/{id}", response_model=MedicamentoOut)
def obtener(id: int, db: Session = Depends(get_db)):
    return get_medicamento_by_id(db, id)

@router.post("/", response_model=MedicamentoOut)
def crear(data: MedicamentoCreate, db: Session = Depends(get_db)):
    return create_medicamento(db, data)
