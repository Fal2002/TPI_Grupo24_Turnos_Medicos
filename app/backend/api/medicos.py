from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.backend.db.db import get_db
from app.backend.services.medico_service import MedicoService
from app.backend.services.medico_repository import MedicoRepository
from app.backend.services.user_repository import UserRepository
from app.backend.schemas.medico import MedicoCreate, MedicoOut, MedicoUpdate
from app.backend.services.exceptions import MatriculaDuplicadaError, EmailDuplicadoError
from app.backend.core.dependencies import get_current_user, role_required

router = APIRouter(prefix="/medicos", tags=["Medicos"])


# (Esto se encarga de crear el objeto Service con todas sus dependencias)
def get_medico_service(db: Session = Depends(get_db)) -> MedicoService:
    repo = MedicoRepository(db)
    return MedicoService(repo)


@router.post(
    "/",
    response_model=MedicoOut,
    status_code=status.HTTP_201_CREATED,
    # dependencies=[Depends(role_required(["Administrador"]))],
)
def crear_medico(
    payload: MedicoCreate, medico_service: MedicoService = Depends(get_medico_service)
):
    try:
        return medico_service.crear_medico(payload)

    except MatriculaDuplicadaError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.get(
    "/",
    response_model=List[MedicoOut],
    # dependencies=[Depends(role_required(["Administrador", "Médico"]))],
)
def obtener_medicos(
    matricula: Optional[str] = None,
    nombre: Optional[str] = None,
    especialidad: Optional[str] = None,
    medico_service: MedicoService = Depends(get_medico_service),
):
    return medico_service.obtener_medicos(matricula, nombre, especialidad)


@router.get("/{matricula}", response_model=MedicoOut)
def obtener_medico(
    matricula: str, medico_service: MedicoService = Depends(get_medico_service)
):
    medico = medico_service.obtener_medico(matricula)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return medico


@router.put(
    "/{matricula}",
    response_model=MedicoOut,
    # dependencies=[Depends(role_required(["Administrador"]))],
)
def actualizar_medico(
    matricula: str,
    payload: MedicoUpdate,
    medico_service: MedicoService = Depends(get_medico_service),
):
    medico = medico_service.actualizar_medico(matricula, payload)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return medico


@router.delete(
    "/{matricula}",
    # dependencies=[Depends(role_required(["Administrador"]))]
)
def eliminar_medico(
    matricula: str, medico_service: MedicoService = Depends(get_medico_service)
):
    ok = medico_service.eliminar_medico(matricula)
    if not ok:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return {"msg": "Médico eliminado correctamente"}


# obtener especialidades de un medico
@router.get(
    "/{matricula}/especialidades",
    response_model=List[str],
    # dependencies=[Depends(role_required(["Administrador", "Médico"]))],
)
def obtener_especialidades_medico(
    matricula: str, medico_service: MedicoService = Depends(get_medico_service)
):
    especialidades = medico_service.obtener_especialidades_medico(matricula)
    if especialidades is None:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return especialidades
