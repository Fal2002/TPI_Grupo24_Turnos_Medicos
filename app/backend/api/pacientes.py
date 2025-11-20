from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.paciente import PacienteCreate, PacienteOut
from app.backend.services.paciente_service import PacienteService
from app.backend.services.paciente_repository import PacienteRepository
from app.backend.services.exceptions import RecursoNoEncontradoError, EmailYaRegistradoError
from typing import List

router = APIRouter(prefix="/pacientes", tags=["Pacientes"])

def get_paciente_service(db: Session = Depends(get_db)) -> PacienteService:
    repo = PacienteRepository(db)
    return PacienteService(repo)

@router.post("/", response_model=PacienteOut, status_code=status.HTTP_201_CREATED)
def crear_paciente_endpoint(payload: PacienteCreate, service: PacienteService = Depends(get_paciente_service)):
    try:
        return service.crear_paciente(payload)
    except EmailYaRegistradoError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.get("/", response_model=List[PacienteOut])
def obtener_pacientes_endpoint(service: PacienteService = Depends(get_paciente_service)):
    return service.obtener_pacientes()

@router.get("/{nro_paciente}", response_model=PacienteOut)
def obtener_paciente_endpoint(nro_paciente: int, service: PacienteService = Depends(get_paciente_service)):
    try:
        return service.obtener_paciente(nro_paciente)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{nro_paciente}", response_model=PacienteOut)
def actualizar_paciente_endpoint(nro_paciente: int, payload: PacienteCreate, service: PacienteService = Depends(get_paciente_service)):
    try:
        return service.actualizar_paciente(nro_paciente, payload)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except EmailYaRegistradoError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{nro_paciente}")
def eliminar_paciente_endpoint(nro_paciente: int, service: PacienteService = Depends(get_paciente_service)):
    try:
        ok = service.eliminar_paciente(nro_paciente)
        if not ok:
            raise RecursoNoEncontradoError(f"Paciente con nro {nro_paciente} no encontrado.")
        return {"msg": "Paciente eliminado correctamente"}
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))