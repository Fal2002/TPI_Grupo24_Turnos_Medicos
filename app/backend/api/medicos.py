from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.medico_service import (
    get_medicos, get_medico_by_id, create_medico, delete_medico
)
from app.backend.schemas.medico import MedicoCreate, MedicoOut

router = APIRouter(prefix="/medicos", tags=["Medicos"])

@router.get("/", response_model=list[MedicoOut])
def listar(db: Session = Depends(get_db)):
    return get_medicos(db)

@router.get("/{matricula}", response_model=MedicoOut)
def obtener(matricula: str, db: Session = Depends(get_db)):
    return get_medico_by_id(db, matricula)

@router.post("/", response_model=MedicoOut)
def crear(data: MedicoCreate, db: Session = Depends(get_db)):
    return create_medico(db, data)

@router.delete("/{matricula}")
def eliminar(matricula: str, db: Session = Depends(get_db)):
    return delete_medico(db, matricula)
