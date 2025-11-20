from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.sucursal_service import (
    get_sucursales, get_sucursal_by_id, create_sucursal,
    update_sucursal, delete_sucursal
)
from app.backend.schemas.sucursal import SucursalCreate, SucursalOut

router = APIRouter(prefix="/sucursales", tags=["Sucursales"])

@router.get("/", response_model=list[SucursalOut])
<<<<<<< HEAD
def listar_sucursales(
    db: Session = Depends(get_db),
    id: Optional[int] = None,
    nombre: Optional[str] = None,
    direccion: Optional[str] = None,
):
    return sucursal_service.listar_sucursales(db, id, nombre, direccion)

=======
def listar(db: Session = Depends(get_db)):
    return get_sucursales(db)
>>>>>>> cambios-en-backend

@router.get("/{id}", response_model=SucursalOut)
def obtener(id: int, db: Session = Depends(get_db)):
    return get_sucursal_by_id(db, id)

@router.post("/", response_model=SucursalOut)
def crear(data: SucursalCreate, db: Session = Depends(get_db)):
    return create_sucursal(db, data)

@router.put("/{id}", response_model=SucursalOut)
<<<<<<< HEAD
def actualizar_sucursal(
    id: int, payload: SucursalCreate, db: Session = Depends(get_db)
):
    return sucursal_service.actualizar_sucursal(db, id, payload)

=======
def actualizar(id: int, data: SucursalCreate, db: Session = Depends(get_db)):
    return update_sucursal(db, id, data)
>>>>>>> cambios-en-backend

@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    return delete_sucursal(db, id)
