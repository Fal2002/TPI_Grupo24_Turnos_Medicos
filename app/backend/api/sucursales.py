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
def listar(db: Session = Depends(get_db)):
    return get_sucursales(db)

@router.get("/{id}", response_model=SucursalOut)
def obtener(id: int, db: Session = Depends(get_db)):
    return get_sucursal_by_id(db, id)

@router.post("/", response_model=SucursalOut)
def crear(data: SucursalCreate, db: Session = Depends(get_db)):
    return create_sucursal(db, data)

@router.put("/{id}", response_model=SucursalOut)
def actualizar(id: int, data: SucursalCreate, db: Session = Depends(get_db)):
    return update_sucursal(db, id, data)

@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    return delete_sucursal(db, id)
