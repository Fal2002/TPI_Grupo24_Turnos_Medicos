from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.consultorio_service import (
    get_consultorios, get_consultorio, create_consultorio, delete_consultorio
)
from app.backend.schemas.consultorio import ConsultorioCreate, ConsultorioOut

router = APIRouter(prefix="/consultorios", tags=["Consultorios"])

@router.get("/", response_model=list[ConsultorioOut])
<<<<<<< HEAD
def listar(
    db: Session = Depends(get_db),
    sucursal_id: Optional[int] = None,
    numero: Optional[int] = None,
):
    return consultorio_service.obtener_consultorios(db, sucursal_id, numero)

=======
def listar(db: Session = Depends(get_db)):
    return get_consultorios(db)
>>>>>>> cambios-en-backend

@router.get("/{numero}/{sucursal_id}", response_model=ConsultorioOut)
def obtener(numero: int, sucursal_id: int, db: Session = Depends(get_db)):
    return get_consultorio(db, numero, sucursal_id)

@router.post("/", response_model=ConsultorioOut)
def crear(data: ConsultorioCreate, db: Session = Depends(get_db)):
    return create_consultorio(db, data)

@router.delete("/{numero}/{sucursal_id}")
def eliminar(numero: int, sucursal_id: int, db: Session = Depends(get_db)):
    return delete_consultorio(db, numero, sucursal_id)
