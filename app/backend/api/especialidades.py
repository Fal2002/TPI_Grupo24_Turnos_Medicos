from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.especialidad_service import (
    get_especialidades, get_especialidad_by_id,
    create_especialidad, delete_especialidad
)
from app.backend.schemas.especialidad import EspecialidadCreate, EspecialidadOut

router = APIRouter(prefix="/especialidades", tags=["Especialidades"])

@router.get("/", response_model=list[EspecialidadOut])
def listar(db: Session = Depends(get_db)):
    return get_especialidades(db)

@router.get("/{id}", response_model=EspecialidadOut)
def obtener(id: int, db: Session = Depends(get_db)):
    return get_especialidad_by_id(db, id)

@router.post("/", response_model=EspecialidadOut)
def crear(data: EspecialidadCreate, db: Session = Depends(get_db)):
    return create_especialidad(db, data)

@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    return delete_especialidad(db, id)
