from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.backend.db.db import get_db
from app.backend.schemas.medico import MedicoCreate, MedicoOut, MedicoUpdate
from app.backend.services import medico_service

router = APIRouter(prefix="/medicos", tags=["Medicos"])


@router.post("/", response_model=MedicoOut)
def crear_medico(payload: MedicoCreate, db: Session = Depends(get_db)):
    return medico_service.crear_medico(db, payload)


@router.get("/", response_model=List[MedicoOut])
def obtener_medicos(
    matricula: Optional[str] = Query(None, description="Filtrar por matrícula"),
    nombre: Optional[str] = Query(None, description="Filtrar por nombre o apellido"),
    especialidad: Optional[str] = Query(
        None, description="Filtrar por nombre de especialidad"
    ),
    db: Session = Depends(get_db),
):
    """
    Obtiene la lista de médicos. Si se envían parámetros, filtra los resultados.
    """
    # Se asume que medico_service.obtener_medicos ha sido actualizado para aceptar estos argumentos
    return medico_service.obtener_medicos(
        db, matricula=matricula, nombre=nombre, especialidad=especialidad
    )


@router.get("/{matricula}", response_model=MedicoOut)
def obtener_medico(matricula: str, db: Session = Depends(get_db)):
    medico = medico_service.obtener_medico(db, matricula)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return medico


@router.put("/{matricula}", response_model=MedicoOut)
def actualizar_medico(
    matricula: str, payload: MedicoUpdate, db: Session = Depends(get_db)
):
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
