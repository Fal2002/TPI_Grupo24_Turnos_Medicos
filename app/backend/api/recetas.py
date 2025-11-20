from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.receta import RecetaCreate, RecetaOut, RecetaConMedicamentosOut, MedicamentoOut
from app.backend.services.recetas_service import RecetaService
from app.backend.services.recetas_repository import RecetaRepository
from app.backend.services.exceptions import RecursoNoEncontradoError
from app.backend.core.dependencies import role_required
from typing import List

router = APIRouter(prefix="/recetas", tags=["Recetas"])

def get_receta_service(db: Session = Depends(get_db)) -> RecetaService:
    return RecetaService(
        receta_repo=RecetaRepository(db),
        db_session=db
    )

# ----------------------------------------------------
# Endpoint 1: Crear Receta (CREATE)
# ----------------------------------------------------
@router.post(
    "/",
    response_model=RecetaOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(role_required(["Administrador", "Médico"]))],
)
def crear_receta(
    payload: RecetaCreate, service: RecetaService = Depends(get_receta_service)
):
    try:
        return service.crear_receta(
            fecha=payload.turno_fecha,
            hora=payload.turno_hora,
            paciente_nro=payload.turno_paciente_nro
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# ----------------------------------------------------
# Endpoint 2: Obtener Todas las Recetas
# ----------------------------------------------------
@router.get("/", response_model=List[RecetaOut])
def obtener_todas_las_recetas(service: RecetaService = Depends(get_receta_service)):
    return service.obtener_recetas()

# ----------------------------------------------------
# Endpoint 3: Obtener Receta por ID
# ----------------------------------------------------
@router.get("/{receta_id}", response_model=RecetaConMedicamentosOut)
def obtener_receta_por_id(
    receta_id: int, service: RecetaService = Depends(get_receta_service)
):
    try:
        receta = service.obtener_receta_por_id(receta_id)
        medicamentos = service.obtener_medicamentos_de_receta(receta_id)
        
        # Construimos la respuesta combinada
        return RecetaConMedicamentosOut(
            **receta.__dict__,
            medicamentos=[MedicamentoOut.model_validate(m) for m in medicamentos]
        )
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

# ----------------------------------------------------
# Endpoint 4: Obtener Recetas por Turno
# ----------------------------------------------------
@router.get("/turno/{fecha}/{hora}/{paciente_nro}", response_model=List[RecetaOut])
def obtener_recetas_por_turno(
    fecha: str,
    hora: str,
    paciente_nro: int,
    service: RecetaService = Depends(get_receta_service)
):
    return service.obtener_recetas_por_turno(fecha, hora, paciente_nro)

# ----------------------------------------------------
# Endpoint 5: Eliminar Receta
# ----------------------------------------------------
@router.delete("/{receta_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_receta(
    receta_id: int,
    service: RecetaService = Depends(get_receta_service),
):
    try:
        service.eliminar_receta(receta_id)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

# ----------------------------------------------------
# Endpoint 6: Agregar Medicamento a Receta
# ----------------------------------------------------
@router.post(
    "/{receta_id}/medicamentos/{medicamento_id}",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(role_required(["Administrador", "Médico"]))],
)
def agregar_medicamento_a_receta(
    receta_id: int,
    medicamento_id: int,
    service: RecetaService = Depends(get_receta_service)
):
    try:
        service.agregar_medicamento(receta_id, medicamento_id)
        return {"message": "Medicamento agregado exitosamente"}
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# ----------------------------------------------------
# Endpoint 7: Obtener Medicamentos de una Receta
# ----------------------------------------------------
@router.get("/{receta_id}/medicamentos", response_model=List[MedicamentoOut])
def obtener_medicamentos_de_receta(
    receta_id: int,
    service: RecetaService = Depends(get_receta_service)
):
    try:
        return service.obtener_medicamentos_de_receta(receta_id)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
