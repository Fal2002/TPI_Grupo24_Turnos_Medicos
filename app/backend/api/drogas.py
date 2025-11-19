from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.droga import DrogaCreate, DrogaUpdate, DrogaOut
from app.backend.services import droga_service

router = APIRouter(prefix="/drogas", tags=["Drogas"])

@router.post("/", response_model=DrogaOut)
def crear_droga(payload: DrogaCreate, db: Session = Depends(get_db)):
    return droga_service.crear_droga(db, payload)

@router.get("/", response_model=list[DrogaOut])
def listar_drogas(db: Session = Depends(get_db)):
    return droga_service.listar_drogas(db)

@router.get("/{id}", response_model=DrogaOut)
def obtener_droga(id: int, db: Session = Depends(get_db)):
    return droga_service.obtener_droga(db, id)

@router.put("/{id}", response_model=DrogaOut)
def actualizar_droga(id: int, payload: DrogaUpdate, db: Session = Depends(get_db)):
    return droga_service.actualizar_droga(db, id, payload)

@router.delete("/{id}")
def eliminar_droga(id: int, db: Session = Depends(get_db)):
    return droga_service.eliminar_droga(db, id)