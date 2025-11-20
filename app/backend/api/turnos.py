from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.turno import TurnoCreate, TurnoOut
from app.backend.services.turno_service import TurnoService
from app.backend.services.turno_repository import TurnoRepository
from app.backend.services.agenda_repository import AgendaRepository
from app.backend.services.medico_repository import MedicoRepository
from app.backend.services.paciente_repository import PacienteRepository
from app.backend.services.exceptions import (
    RecursoNoEncontradoError,
    HorarioNoDisponibleError,
    TransicionInvalidaError,
)
from app.backend.core.dependencies import get_current_user, role_required
from typing import List, Literal

router = APIRouter(prefix="/turnos", tags=["Turnos"])


# 💡 Función de Inyección de Dependencia para TurnoService
def get_turno_service(db: Session = Depends(get_db)) -> TurnoService:
    # Instancia y pasa todas las dependencias
    return TurnoService(
        turno_repo=TurnoRepository(db),
        agenda_repo=AgendaRepository(db),
        medico_repo=MedicoRepository(db),
        paciente_repo=PacienteRepository(db),
        db_session=db,  # Pasa la sesión para el Patrón State
    )


# ----------------------------------------------------
# Endpoint 1: Registrar Turno (CREATE)
# ----------------------------------------------------
@router.post(
    "/",
    response_model=TurnoOut,
    status_code=status.HTTP_201_CREATED,
    # dependencies=[Depends(role_required(["Administrador", "Paciente"]))],
)
def registrar_turno(
    payload: TurnoCreate, service: TurnoService = Depends(get_turno_service)
):
    try:
        return service.registrar_turno(payload)

    except RecursoNoEncontradoError as e:
        # Falla de FK (Médico/Paciente no existe)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    except HorarioNoDisponibleError as e:
        # Falla de Lógica de Negocio (Superposición/Fuera de Agenda)
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


# ----------------------------------------------------
# Endpoint 2: Obtener Todos los Turnos
# ----------------------------------------------------
@router.get("/", response_model=List[TurnoOut])
def obtener_todos_los_turnos(service: TurnoService = Depends(get_turno_service)):
    return service.obtener_turnos()


# ----------------------------------------------------
# Endpoint 3: Cambios de Estado (Patrón State)
# ----------------------------------------------------
@router.patch(
    "/{fecha}/{hora}/{nro_paciente}/{accion}",
    response_model=TurnoOut,
    dependencies=[Depends(role_required(["Administrador", "Médico"]))],
)
def gestionar_estado_turno(
    fecha: str,
    hora: str,
    nro_paciente: int,
    # FastAPI valida que solo se envíen estas acciones
    accion: Literal[
        "confirmar",
        "cancelar",
        "reprogramar",
        "atender",
        "finalizar",
        "anunciar",
        "marcarAusente",
    ],
    service: TurnoService = Depends(get_turno_service),
):
    pk_data = {"fecha": fecha, "hora": hora, "paciente_nro": nro_paciente}

    try:
        return service.cambiar_estado(pk_data, accion)

    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    except TransicionInvalidaError as e:
        # El Service lanzó la excepción porque el Patrón State no permite la acción
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    except HorarioNoDisponibleError as e:
        # En caso de que la acción implique reprogramar y haya un conflicto
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


# ----------------------------------------------------
# Endpoint 4: Eliminar turno
# ----------------------------------------------------
@router.delete("/{fecha}/{hora}/{nro_paciente}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_turno_endpoint(
    fecha: str,
    hora: str,
    nro_paciente: int,
    service: TurnoService = Depends(get_turno_service),
):
    pk_data = {"fecha": fecha, "hora": hora, "paciente_nro": nro_paciente}
    try:
        service.eliminar_turno(pk_data)

        return "Turno eliminado exitosamente."

    except RecursoNoEncontradoError as e:
        # Falla de recurso no encontrado (404)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Turno no encontrado"
        )
