from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.medicamento import MedicamentoCreate, MedicamentoOut
from app.backend.services.medicamento_service import MedicamentoService
from app.backend.services.medicamento_repository import MedicamentoRepository
from app.backend.services.exceptions import RecursoNoEncontradoError
from app.backend.core.dependencies import role_required
from typing import List

router = APIRouter(prefix="/medicamentos", tags=["Medicamentos"])

def get_medicamento_service(db: Session = Depends(get_db)) -> MedicamentoService:
    return MedicamentoService(MedicamentoRepository(db), db)

@router.post("/", response_model=MedicamentoOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(role_required(["Administrador", "Médico"]))])
def crear_medicamento(payload: MedicamentoCreate, service: MedicamentoService = Depends(get_medicamento_service)):
    return service.crear_medicamento(payload)

@router.get("/", response_model=List[MedicamentoOut])
def obtener_medicamentos(service: MedicamentoService = Depends(get_medicamento_service)):
    return service.obtener_medicamentos()

@router.get("/{id}", response_model=MedicamentoOut)
def obtener_medicamento(id: int, service: MedicamentoService = Depends(get_medicamento_service)):
    try:
        return service.obtener_medicamento_por_id(id)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(role_required(["Administrador"]))])
def eliminar_medicamento(id: int, service: MedicamentoService = Depends(get_medicamento_service)):
    try:
        service.eliminar_medicamento(id)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
