from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.turno import TurnoCreate, TurnoOut, TurnoUpdate
from app.backend.services.turno_service import TurnoService
from app.backend.services.turno_repository import TurnoRepository
from app.backend.services.agenda_repository import AgendaRepository
from app.backend.services.medico_repository import MedicoRepository
from app.backend.services.paciente_repository import PacienteRepository
from app.backend.services.exceptions import RecursoNoEncontradoError, HorarioNoDisponibleError, TransicionInvalidaError
from app.backend.core.dependencies import role_required
from typing import List, Literal
from datetime import date

router = APIRouter(prefix="/turnos", tags=["Turnos"])

def get_turno_service(db: Session = Depends(get_db)) -> TurnoService:
    return TurnoService(
        turno_repo=TurnoRepository(db),
        agenda_repo=AgendaRepository(db),
        medico_repo=MedicoRepository(db),
        paciente_repo=PacienteRepository(db),
        db_session=db
    )

@router.post("/", response_model=TurnoOut, status_code=status.HTTP_201_CREATED,
             dependencies=[role_required(["Administrador", "Paciente"])])
def crear_turno_endpoint(payload: TurnoCreate, service: TurnoService = Depends(get_turno_service)):
    try:
        return service.registrar_turno(payload)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except HorarioNoDisponibleError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.get("/", response_model=List[TurnoOut])
def listar_turnos_endpoint(service: TurnoService = Depends(get_turno_service)):
    return service.obtener_turnos()

@router.get("/{fecha}/{hora}/{nro_paciente}", response_model=TurnoOut)
def obtener_turno_endpoint(fecha: date, hora: str, nro_paciente: int,
                           service: TurnoService = Depends(get_turno_service)):
    try:
        pk_data = {"fecha": fecha, "hora": hora, "paciente_nro": nro_paciente}
        return service.obtener_turno(pk_data)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{fecha}/{hora}/{nro_paciente}", response_model=TurnoOut)
def actualizar_turno_endpoint(fecha: date, hora: str, nro_paciente: int, payload: TurnoUpdate,
                              service: TurnoService = Depends(get_turno_service)):
    try:
        pk_data = {"fecha": fecha, "hora": hora, "paciente_nro": nro_paciente}
        return service.actualizar_turno(pk_data, payload)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except HorarioNoDisponibleError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.patch("/{fecha}/{hora}/{nro_paciente}/{accion}", response_model=TurnoOut,
              dependencies=[role_required(["Administrador", "Médico"])])
def cambiar_estado_turno_endpoint(fecha: str, hora: str, nro_paciente: int,
                                  accion: Literal["confirmar", "cancelar", "reprogramar", "atender", "finalizar", "anunciar", "marcarAusente"],
                                  service: TurnoService = Depends(get_turno_service)):
    pk_data = {"fecha": fecha, "hora": hora, "paciente_nro": nro_paciente}
    try:
        return service.cambiar_estado(pk_data, accion)
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except TransicionInvalidaError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HorarioNoDisponibleError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{fecha}/{hora}/{nro_paciente}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_turno_endpoint(fecha: str, hora: str, nro_paciente: int,
                            service: TurnoService = Depends(get_turno_service)):
    pk_data = {"fecha": fecha, "hora": hora, "paciente_nro": nro_paciente}
    try:
        service.eliminar_turno(pk_data)
        return {"msg": "Turno eliminado exitosamente."}
    except RecursoNoEncontradoError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turno no encontrado")