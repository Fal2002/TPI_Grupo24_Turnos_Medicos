from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Sucursal
from app.backend.schemas.sucursal import SucursalCreate


# Crear sucursal
def crear_sucursal(db: Session, data: SucursalCreate):
    nueva = Sucursal(Nombre=data.Nombre, Direccion=data.Direccion)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


# Listar sucursales
def listar_sucursales(
    db: Session,
    id: Optional[int] = None,
    nombre: Optional[str] = None,
    direccion: Optional[str] = None,
):
    query = db.query(Sucursal)
    if id:
        query = query.filter(Sucursal.Id == id)
    if nombre:
        query = query.filter(Sucursal.Nombre.ilike(f"%{nombre}%"))
    if direccion:
        query = query.filter(Sucursal.Direccion.ilike(f"%{direccion}%"))
    return query.all()


# Obtener sucursal por ID
def obtener_sucursal(db: Session, id: int):
    suc = db.query(Sucursal).filter(Sucursal.Id == id).first()
    if not suc:
        raise HTTPException(404, "Sucursal no encontrada")
    return suc


# Actualizar sucursal
def actualizar_sucursal(db: Session, id: int, data: SucursalCreate):
    suc = obtener_sucursal(db, id)

    suc.Nombre = data.Nombre
    suc.Direccion = data.Direccion

    db.commit()
    db.refresh(suc)
    return suc


# Eliminar sucursal
def eliminar_sucursal(db: Session, id: int):
    suc = obtener_sucursal(db, id)

    db.delete(suc)
    db.commit()
    return {"msg": "Sucursal eliminada correctamente"}
