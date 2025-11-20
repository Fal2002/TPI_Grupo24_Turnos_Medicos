from .strategy import StrategyReports
from typing import Any, Dict, List

# from app.backend.services.turnos_repository import TurnoRepository # Inyectado


class ReportePorMedicoStrategy(StrategyReports):
    """Estrategia para generar el reporte de 'Listado de turnos de todos los médicos'."""

    def generate_report(
        self, start_date: str, end_date: str, **kwargs
    ) -> Dict[str, Any]:

        # Ya no se requiere matrícula, se obtienen todos los médicos
        turnos_data = self.turno_repo.get_turnos_all_medicos_in_period(
            start_date, end_date
        )

        # Formatear el resultado
        reporte = {
            "title": "Reporte de Turnos por Médico (Todos)",
            "periodo": f"{start_date} a {end_date}",
            "total_registros": len(turnos_data),
            "data": turnos_data,
        }

        return reporte
