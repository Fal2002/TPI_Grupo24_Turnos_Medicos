from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.paciente_service import (
    get_pacientes, get_paciente_by_id, create_paciente,
    update_paciente, delete_paciente
)
from app.backend.schemas.paciente import PacienteCreate, PacienteOut

router = APIRouter(prefix="/pacientes", tags=["Pacientes"])

@router.get("/", response_model=list[PacienteOut])
def listar(db: Session = Depends(get_db)):
    return get_pacientes(db)

@router.get("/{id}", response_model=PacienteOut)
def obtener(id: int, db: Session = Depends(get_db)):
    return get_paciente_by_id(db, id)

@router.post("/", response_model=PacienteOut)
def crear(data: PacienteCreate, db: Session = Depends(get_db)):
    return create_paciente(db, data)

@router.put("/{id}", response_model=PacienteOut)
def actualizar(id: int, data: PacienteCreate, db: Session = Depends(get_db)):
    return update_paciente(db, id, data)

@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    return delete_paciente(db, id)
