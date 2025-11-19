from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.medicamento import MedicamentoCreate, MedicamentoOut, MedicamentoUpdate
from app.backend.services import medicamento_service

router = APIRouter(prefix="/medicamentos", tags=["Medicamentos"])

@router.post("/", response_model=MedicamentoOut)
def crear_medicamento(payload: MedicamentoCreate, db: Session = Depends(get_db)):
    return medicamento_service.crear_medicamento(db, payload)

@router.get("/", response_model=list[MedicamentoOut])
def listar_medicamentos(db: Session = Depends(get_db)):
    return medicamento_service.listar_medicamentos(db)

@router.get("/{id}", response_model=MedicamentoOut)
def obtener_medicamento(id: int, db: Session = Depends(get_db)):
    return medicamento_service.obtener_medicamento(db, id)

@router.put("/{id}", response_model=MedicamentoOut)
def actualizar_medicamento(id: int, payload: MedicamentoUpdate, db: Session = Depends(get_db)):
    return medicamento_service.actualizar_medicamento(db, id, payload)

@router.delete("/{id}")
def eliminar_medicamento(id: int, db: Session = Depends(get_db)):
    return medicamento_service.eliminar_medicamento(db, id)