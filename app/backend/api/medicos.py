from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.backend.db.db import get_db
from app.backend.schemas.medico import MedicoCreate, MedicoOut, MedicoUpdate
from app.backend.services import medico_service

router = APIRouter(prefix="/medicos", tags=["Medicos"])

@router.post("/", response_model=MedicoOut)
def crear_medico(payload: MedicoCreate, db: Session = Depends(get_db)):
    return medico_service.crear_medico(db, payload)


@router.get("/", response_model=List[MedicoOut])
def obtener_medicos(db: Session = Depends(get_db)):
    return medico_service.obtener_medicos(db)


@router.get("/{matricula}", response_model=MedicoOut)
def obtener_medico(matricula: str, db: Session = Depends(get_db)):
    medico = medico_service.obtener_medico(db, matricula)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return medico


@router.put("/{matricula}", response_model=MedicoOut)
def actualizar_medico(matricula: str, payload: MedicoUpdate, db: Session = Depends(get_db)):
    medico = medico_service.actualizar_medico(db, matricula, payload)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return medico


@router.delete("/{matricula}")
def eliminar_medico(matricula: str, db: Session = Depends(get_db)):
    ok = medico_service.eliminar_medico(db, matricula)
    if not ok:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return {"msg": "Médico eliminado correctamente"}
