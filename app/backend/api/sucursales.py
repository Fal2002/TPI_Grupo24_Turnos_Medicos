from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.sucursal import SucursalCreate, SucursalOut
from app.backend.services.sucursal_service import SucursalService
from app.backend.services.sucursal_repository import SucursalRepository
from app.backend.services.exceptions import RecursoNoEncontradoError
from typing import List

router = APIRouter(prefix="/sucursales", tags=["Sucursales"])

def get_sucursal_service(db: Session = Depends(get_db)) -> SucursalService:
    repo = SucursalRepository(db)
    return SucursalService(repo)

@router.post("/", response_model=SucursalOut, status_code=status.HTTP_201_CREATED)
def crear_sucursal_endpoint(payload: SucursalCreate, service: SucursalService = Depends(get_sucursal_service)):
    return service.crear_sucursal(payload)

@router.get("/", response_model=List[SucursalOut])
def listar_sucursales_endpoint(service: SucursalService = Depends(get_sucursal_service)):
    return service.listar_sucursales()

@router.get("/{id}", response_model=SucursalOut)
def obtener_sucursal_endpoint(id: int, service: SucursalService = Depends(get_sucursal_service)):
    try:
        return service.obtener_sucursal(id)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{id}", response_model=SucursalOut)
def actualizar_sucursal_endpoint(id: int, payload: SucursalCreate, service: SucursalService = Depends(get_sucursal_service)):
    try:
        return service.actualizar_sucursal(id, payload)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.delete("/{id}")
def eliminar_sucursal_endpoint(id: int, service: SucursalService = Depends(get_sucursal_service)):
    try:
        ok = service.eliminar_sucursal(id)
        if not ok:
            raise RecursoNoEncontradoError(f"Sucursal con id {id} no encontrada.")
        return {"msg": "Sucursal eliminada correctamente"}
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))