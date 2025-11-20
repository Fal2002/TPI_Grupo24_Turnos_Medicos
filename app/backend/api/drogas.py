from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.droga_service import (
    get_drogas, get_droga_by_id, create_droga
)
from app.backend.schemas.droga import DrogaCreate, DrogaOut

router = APIRouter(prefix="/drogas", tags=["Drogas"])

@router.get("/", response_model=list[DrogaOut])
def listar(db: Session = Depends(get_db)):
    return get_drogas(db)

@router.get("/{id}", response_model=DrogaOut)
def obtener(id: int, db: Session = Depends(get_db)):
    return get_droga_by_id(db, id)

@router.post("/", response_model=DrogaOut)
def crear(data: DrogaCreate, db: Session = Depends(get_db)):
    return create_droga(db, data)
