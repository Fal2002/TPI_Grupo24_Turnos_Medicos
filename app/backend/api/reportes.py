from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.report_service import ReportService
from app.backend.services.turno_repository import TurnoRepository
from app.backend.core.dependencies import role_required, get_current_user # RBAC
from app.backend.services.exceptions import RecursoNoEncontradoError
from typing import Dict, Any, List, Optional
from datetime import date

router = APIRouter(prefix="/reportes", tags=["Reportes"])


def get_turno_repository(db: Session = Depends(get_db)) -> TurnoRepository:
    return TurnoRepository(db)

def get_report_service(turno_repo: TurnoRepository = Depends(get_turno_repository)) -> ReportService:
    return ReportService(turno_repo)


@router.get("/", 
    response_model=Dict[str, Any],
    dependencies=[role_required(["Administrador"])] 
)
def generar_reporte(
    type: str = Query(..., description="Tipo de reporte a generar (ej: 'medico')"),
    start_date: date = Query(..., description="Fecha de inicio (YYYY-MM-DD)"),
    end_date: date = Query(..., description="Fecha de fin (YYYY-MM-DD)"),
    
    matricula: Optional[str] = Query(None, description="Matrícula del médico (solo si type='medico')"),
    
    service: ReportService = Depends(get_report_service)
):
    
    try:
        service.set_strategy(type)
        
        report_output = service.generate_report(
            start_date=str(start_date), 
            end_date=str(end_date),    
            matricula=matricula        
        )
        
        return report_output
        
    except RecursoNoEncontradoError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))