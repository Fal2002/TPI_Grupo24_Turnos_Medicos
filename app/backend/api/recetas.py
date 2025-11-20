from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.receta import RecetaOut, RecetaCreate
from app.backend.services.receta_service import crear_receta, get_recetas, get_receta_by_id, eliminar_receta
from typing import List

router = APIRouter(prefix="/recetas", tags=["Recetas"])

@router.get("/", response_model=List[RecetaOut])
def listar_recetas(db: Session = Depends(get_db)):
    return get_recetas(db)

@router.get("/{receta_id}", response_model=RecetaOut)
def obtener_receta(receta_id: int, db: Session = Depends(get_db)):
    return get_receta_by_id(db, receta_id)

@router.post("/", response_model=RecetaOut)
def crear(data: RecetaCreate, db: Session = Depends(get_db)):
    return crear_receta(db, data)

@router.delete("/{receta_id}")
def eliminar(receta_id: int, db: Session = Depends(get_db)):
    eliminar_receta(db, receta_id)
    return {"mensaje": "Receta eliminada"}