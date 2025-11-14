from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.backend.db.db import get_db
from app.backend.schemas.sucursal import SucursalCreate, SucursalOut
from app.backend.services import sucursal_service

router = APIRouter(prefix="/sucursales", tags=["Sucursales"])


@router.post("/", response_model=SucursalOut)
def crear_sucursal(payload: SucursalCreate, db: Session = Depends(get_db)):
    return sucursal_service.crear_sucursal(db, payload)


@router.get("/", response_model=list[SucursalOut])
def listar_sucursales(db: Session = Depends(get_db)):
    return sucursal_service.listar_sucursales(db)


@router.get("/{id}", response_model=SucursalOut)
def obtener_sucursal(id: int, db: Session = Depends(get_db)):
    return sucursal_service.obtener_sucursal(db, id)


@router.put("/{id}", response_model=SucursalOut)
def actualizar_sucursal(id: int, payload: SucursalCreate, db: Session = Depends(get_db)):
    return sucursal_service.actualizar_sucursal(db, id, payload)


@router.delete("/{id}")
def eliminar_sucursal(id: int, db: Session = Depends(get_db)):
    return sucursal_service.eliminar_sucursal(db, id)
