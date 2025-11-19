from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.services.report_service import ReportService
from app.backend.services.turno_repository import TurnoRepository
from app.backend.core.dependencies import role_required, get_current_user  # RBAC
from app.backend.services.exceptions import RecursoNoEncontradoError
from typing import Dict, Any, List, Optional
from datetime import date  # Para tipado de fechas en el query

router = APIRouter(prefix="/reportes", tags=["Reportes"])


# 💡 Helper para la inyección del TurnoRepository
def get_turno_repository(db: Session = Depends(get_db)) -> TurnoRepository:
    return TurnoRepository(db)


# 💡 Helper para la inyección del ReportService
def get_report_service(
    turno_repo: TurnoRepository = Depends(get_turno_repository),
) -> ReportService:
    return ReportService(turno_repo)


# ----------------------------------------------------
# Endpoint Único: GET /api/reportes
# ----------------------------------------------------
@router.get(
    "/",
    response_model=Dict[str, Any],
    # Solo Administradores pueden generar reportes
    dependencies=[Depends(role_required(["Administrador"]))],
)
def generar_reporte(
    # Parámetros obligatorios (Query Parameters)
    type: str = Query(..., description="Tipo de reporte a generar (ej: 'medico')"),
    start_date: date = Query(..., description="Fecha de inicio (YYYY-MM-DD)"),
    end_date: date = Query(..., description="Fecha de fin (YYYY-MM-DD)"),
    # Parámetro opcional para el reporte por médico
    matricula: Optional[str] = Query(
        None, description="Matrícula del médico (solo si type='medico')"
    ),
    # Inyección del Service
    service: ReportService = Depends(get_report_service),
):
    """Genera un reporte estadístico o listado basado en la estrategia seleccionada."""

    try:
        # 1. Selecciona la Estrategia
        service.set_strategy(type)

        # 2. Ejecuta el Reporte, pasando todos los parámetros necesarios
        report_output = service.generate_report(
            start_date=str(start_date),  # Convertir date a str para el Repository
            end_date=str(end_date),  # Convertir date a str para el Repository
            matricula=matricula,  # Pasa la matrícula como kwargs
        )

        return report_output

    except RecursoNoEncontradoError as e:
        # Si el tipo de reporte no existe o falta una FK (ej. matrícula)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    except ValueError as e:
        # Errores de validación interna
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
