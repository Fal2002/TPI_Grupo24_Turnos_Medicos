from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
<<<<<<< HEAD
from typing import List, Optional
from app.backend.db.db import get_db
from app.backend.schemas.especialidad import (
    EspecialidadCreate,
    EspecialidadOut,
    EspecialidadUpdate,
)
from app.backend.services import especialidad_service

router = APIRouter(prefix="/especialidades", tags=["Especialidades"])

=======
from app.backend.db.db import get_db
from app.backend.services.especialidad_service import (
    get_especialidades, get_especialidad_by_id,
    create_especialidad, delete_especialidad
)
from app.backend.schemas.especialidad import EspecialidadCreate, EspecialidadOut

router = APIRouter(prefix="/especialidades", tags=["Especialidades"])

@router.get("/", response_model=list[EspecialidadOut])
def listar(db: Session = Depends(get_db)):
    return get_especialidades(db)

@router.get("/{id}", response_model=EspecialidadOut)
def obtener(id: int, db: Session = Depends(get_db)):
    return get_especialidad_by_id(db, id)
>>>>>>> cambios-en-backend

@router.post("/", response_model=EspecialidadOut)
def crear(data: EspecialidadCreate, db: Session = Depends(get_db)):
    return create_especialidad(db, data)

<<<<<<< HEAD

@router.get("/", response_model=List[EspecialidadOut])
def listar_especialidades(
    nombre: Optional[str] = None,
    id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    return especialidad_service.obtener_especialidades(db, nombre, id)


@router.get("/{especialidad_id}", response_model=EspecialidadOut)
def obtener_especialidad(especialidad_id: int, db: Session = Depends(get_db)):
    esp = especialidad_service.obtener_especialidad(db, especialidad_id)
    if not esp:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    return esp


@router.put("/{especialidad_id}", response_model=EspecialidadOut)
def actualizar_especialidad(
    especialidad_id: int, payload: EspecialidadUpdate, db: Session = Depends(get_db)
):
    esp = especialidad_service.actualizar_especialidad(db, especialidad_id, payload)
    if not esp:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    return esp


@router.delete("/{especialidad_id}")
def eliminar_especialidad(especialidad_id: int, db: Session = Depends(get_db)):
    ok = especialidad_service.eliminar_especialidad(db, especialidad_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    return {"message": "Especialidad eliminada correctamente"}
=======
@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    return delete_especialidad(db, id)
>>>>>>> cambios-en-backend
