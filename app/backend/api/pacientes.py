from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.backend.db.db import get_db
from app.backend.schemas.paciente import PacienteCreate, PacienteBase, PacienteUpdate
from app.backend.services import paciente_service

router = APIRouter(prefix="/pacientes", tags=["Pacientes"])

@router.post("/", response_model=PacienteBase)
def crear_paciente(payload: PacienteCreate, db: Session = Depends(get_db)):
    paciente = paciente_service.crear_paciente(db, payload)
    if paciente is None:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    return paciente


@router.get("/", response_model=List[PacienteBase])
def obtener_pacientes(db: Session = Depends(get_db)):
    return paciente_service.obtener_pacientes(db)


@router.get("/{nro}", response_model=PacienteBase)
def obtener_paciente(nro: int, db: Session = Depends(get_db)):
    paciente = paciente_service.obtener_paciente(db, nro)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return paciente


@router.put("/{nro}", response_model=PacienteBase)
def actualizar_paciente(nro: int, payload: PacienteUpdate, db: Session = Depends(get_db)):
    paciente = paciente_service.actualizar_paciente(db, nro, payload)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return paciente


@router.delete("/{nro}")
def eliminar_paciente(nro: int, db: Session = Depends(get_db)):
    ok = paciente_service.eliminar_paciente(db, nro)
    if not ok:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return {"msg": "Paciente eliminado correctamente"}
