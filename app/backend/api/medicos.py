from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.backend.db.db import get_db
from app.backend.services.medico_service import (
    get_medicos, get_medico_by_id, create_medico, delete_medico
)
from app.backend.schemas.medico import MedicoCreate, MedicoOut, MedicoUpdate
from app.backend.services.medico_repository import MedicoRepository
from app.backend.services.user_repository import UserRepository 
from app.backend.services.exceptions import MatriculaDuplicadaError, EmailDuplicadoError 
from app.backend.core.dependencies import get_current_user, role_required


router = APIRouter(prefix="/medicos", tags=["Medicos"])

def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db)

def get_medico_service(
    db: Session = Depends(get_db),
    user_repo: UserRepository = Depends(get_user_repository)
) -> MedicoService:
    repo = MedicoRepository(db)
    return MedicoService(repo, user_repo) 


@router.get("/", 
    response_model=List[MedicoOut],
    dependencies=[role_required(["Administrador", "Médico"])]
)
def listar(medico_service: MedicoService = Depends(get_medico_service)):
    return medico_service.get_medicos()

@router.get("/{matricula}", response_model=MedicoOut)
def obtener(matricula: str, medico_service: MedicoService = Depends(get_medico_service)):
    medico = medico_service.get_medico_by_id(matricula)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return medico

@router.post("/", 
    response_model=MedicoOut, 
    status_code=status.HTTP_201_CREATED,
    dependencies=[role_required(["Administrador"])]
)
def crear(payload: MedicoCreate, medico_service: MedicoService = Depends(get_medico_service)):
    try:
        return medico_service.crear_medico(payload)
    
    except MatriculaDuplicadaError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    
    except EmailDuplicadoError as e: 
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{matricula}", 
    dependencies=[role_required(["Administrador"])]
)
def eliminar(matricula: str, medico_service: MedicoService = Depends(get_medico_service)):
    ok = medico_service.delete_medico(matricula)
    if not ok:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return {"msg": "Médico eliminado correctamente"}

@router.put("/{matricula}", 
    response_model=MedicoOut,
    dependencies=[role_required(["Administrador"])]
)
def actualizar_medico(
    matricula: str,
    payload: MedicoUpdate,
    medico_service: MedicoService = Depends(get_medico_service)
):
    medico = medico_service.actualizar_medico(matricula, payload)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return medico
