from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.turno import TurnoCreate, TurnoOut
from app.backend.services import turno_service

router = APIRouter(prefix="/turnos", tags=["Turnos"])

# Crear turno
@router.post("/", response_model=TurnoOut)
def crear_turno(payload: TurnoCreate, db: Session = Depends(get_db)):
    return turno_service.crear_turno(db, payload)

# Listar todos los turnos
@router.get("/", response_model=list[TurnoOut])
def listar_turnos(db: Session = Depends(get_db)):
    return turno_service.listar_turnos(db)

# Ejecutar acción de cambio de estado
@router.post("/{fecha}/{hora}/{paciente_id}/{accion}", response_model=TurnoOut)
def ejecutar_accion(
    fecha: str,
    hora: str,
    paciente_id: int,
    accion: str,
    db: Session = Depends(get_db)
):
    return turno_service.ejecutar_accion(db, fecha, hora, paciente_id, accion)
