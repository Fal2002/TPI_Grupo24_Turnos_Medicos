from fastapi import APIRouter, Depends
from datetime import date
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.turno_service import (
    get_turnos, get_turno, create_turno, update_turno, delete_turno
)
from app.backend.schemas.turno import TurnoCreate, TurnoUpdate, TurnoOut

router = APIRouter(prefix="/turnos", tags=["Turnos"])

@router.get("/", response_model=list[TurnoOut])
def listar(db: Session = Depends(get_db)):
    return get_turnos(db)

@router.get("/{fecha}/{hora}/{paciente_id}", response_model=TurnoOut)
def obtener(fecha: date, hora: str, paciente_id: int, db: Session = Depends(get_db)):
    return get_turno(db, fecha, hora, paciente_id)

@router.post("/", response_model=TurnoOut)
def crear(data: TurnoCreate, db: Session = Depends(get_db)):
    return create_turno(db, data)

@router.put("/{fecha}/{hora}/{paciente_id}", response_model=TurnoOut)
def actualizar(fecha: str, hora: str, paciente_id: int, data: TurnoUpdate, db: Session = Depends(get_db)):
    return update_turno(db, fecha, hora, paciente_id, data)

@router.delete("/{fecha}/{hora}/{paciente_id}")
def eliminar(fecha: date, hora: str, paciente_id: int, db: Session = Depends(get_db)):
    return delete_turno(db, fecha, hora, paciente_id)
