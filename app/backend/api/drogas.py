from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.droga import DrogaCreate, DrogaOut
from app.backend.services.droga_service import DrogaService
from app.backend.services.droga_repository import DrogaRepository
from app.backend.services.exceptions import RecursoNoEncontradoError
from app.backend.core.dependencies import role_required
from typing import List

router = APIRouter(prefix="/drogas", tags=["Drogas"])


def get_droga_service(db: Session = Depends(get_db)) -> DrogaService:
    return DrogaService(DrogaRepository(db), db)


@router.post(
    "/",
    response_model=DrogaOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(role_required(["Administrador", "Médico"]))],
)
def crear_droga(
    payload: DrogaCreate, service: DrogaService = Depends(get_droga_service)
):
    return service.crear_droga(payload)


@router.get("/", response_model=List[DrogaOut])
def obtener_drogas(service: DrogaService = Depends(get_droga_service)):
    return service.obtener_drogas()


@router.get("/{id}", response_model=DrogaOut)
def obtener_droga(id: int, service: DrogaService = Depends(get_droga_service)):
    try:
        return service.obtener_droga_por_id(id)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(role_required(["Administrador"]))],
)
def eliminar_droga(id: int, service: DrogaService = Depends(get_droga_service)):
    try:
        service.eliminar_droga(id)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
