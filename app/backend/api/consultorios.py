
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.backend.db.db import get_db
from app.backend.schemas.consultorio import ConsultorioCreate, ConsultorioOut
from app.backend.services import consultorio_service

router = APIRouter(prefix="/consultorios", tags=["Consultorios"])


@router.post("/", response_model=ConsultorioOut)
def crear(payload: ConsultorioCreate, db: Session = Depends(get_db)):
    return consultorio_service.crear_consultorio(db, payload)


@router.get("/", response_model=list[ConsultorioOut])
def listar(
    db: Session = Depends(get_db),
    sucursal_id: Optional[int] = None,
    numero: Optional[int] = None,
):
    return consultorio_service.obtener_consultorios(db, sucursal_id, numero)


@router.get("/{numero}/{sucursal_id}", response_model=ConsultorioOut)
def obtener(numero: int, sucursal_id: int, db: Session = Depends(get_db)):
    return consultorio_service.obtener_consultorio(db, numero, sucursal_id)


@router.delete("/{numero}/{sucursal_id}")
def eliminar(numero: int, sucursal_id: int, db: Session = Depends(get_db)):
    return consultorio_service.eliminar_consultorio(db, numero, sucursal_id)
