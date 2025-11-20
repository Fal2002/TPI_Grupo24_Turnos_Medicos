from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.agenda_excepcional import AgendaExcepcionalCreate, AgendaExcepcionalOut
from app.backend.schemas.agenda_regular import AgendaRegularCreate, AgendaRegularOut
from app.backend.services.agenda_service import AgendaService
from app.backend.services.agenda_repository import AgendaRepository
from app.backend.services.medico_repository import MedicoRepository # Necesario para inyección
from app.backend.services.exceptions import RecursoNoEncontradoError, ValueError as AppValueError
from typing import List

router = APIRouter(prefix="/agendas", tags=["Agendas"])


def get_agenda_service(db: Session = Depends(get_db)) -> AgendaService:
    agenda_repo = AgendaRepository(db)
    medico_repo = MedicoRepository(db) # Necesario para que el service valide la FK
    return AgendaService(agenda_repo, medico_repo)



@router.post("/medicos/{matricula}/agenda/excepcional", response_model=AgendaExcepcionalOut, status_code=status.HTTP_201_CREATED)
def registrar_agenda_excepcional(
    matricula: str,
    payload: AgendaExcepcionalCreate, 
    service: AgendaService = Depends(get_agenda_service)
):
    try:
        return service.registrar_agenda_excepcional(matricula, payload)
        
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        
    except AppValueError as e:
        # Errores de lógica de rangos (ej. fecha pasada)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/medicos/{matricula}/agenda/regular", response_model=AgendaRegularOut, status_code=status.HTTP_201_CREATED)
def registrar_agenda_regular(
    matricula: str,
    payload: AgendaRegularCreate, 
    service: AgendaService = Depends(get_agenda_service)
):
    try:
        return service.registrar_agenda_regular(matricula, payload)
        
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        
    except AppValueError as e:
        # Errores de lógica de rangos (ej. Duración < 0)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))



@router.get("/medicos/{matricula}/agenda/regular", response_model=List[AgendaRegularOut])
def obtener_agendas_regulares(
    matricula: str, 
    service: AgendaService = Depends(get_agenda_service)
):
    try:
        return service.obtener_agendas_regulares(matricula)
        
    except RecursoNoEncontradoError as e:
        # Podría ser lanzado si el MedicoRepository (usado internamente por el service) lo verifica
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    

@router.delete("/medicos/{matricula}/agenda/regular/{agenda_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_agenda_regular(
    matricula: str,
    especialidad_id: int,
    dia_de_semana: int,
    hora_inicio: str,
    service: AgendaService = Depends(get_agenda_service)
):
    try:
        service.eliminar_agenda_regular(matricula, especialidad_id, dia_de_semana, hora_inicio)
        
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))