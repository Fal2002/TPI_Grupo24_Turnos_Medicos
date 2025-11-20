from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.receta import RecetaCreate, RecetaOut
from app.backend.schemas.receta_completa import RecetaCompletaOut
from app.backend.services import receta_service


router = APIRouter(prefix="/recetas", tags=["Recetas"])


@router.post("/", response_model=RecetaOut)
def crear_receta(payload: RecetaCreate, db: Session = Depends(get_db)):
    return receta_service.crear_receta(db, payload)


@router.get("/", response_model=list[RecetaOut])
def listar_recetas(db: Session = Depends(get_db)):
    return receta_service.listar_recetas(db)


@router.get("/{id}", response_model=RecetaOut)
def obtener_receta(id: int, db: Session = Depends(get_db)):
    return receta_service.obtener_receta(db, id)


@router.delete("/{id}")
def eliminar_receta(id: int, db: Session = Depends(get_db)):
    return receta_service.eliminar_receta(db, id)


@router.get("/{id}/completa", response_model=RecetaCompletaOut)
def obtener_receta_completa(id: int, db: Session = Depends(get_db)):
    return receta_service.obtener_receta_completa(db, id)