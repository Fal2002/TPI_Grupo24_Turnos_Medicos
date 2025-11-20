from .strategy import StrategyReports
from typing import Any, Dict

class ReportePorEspecialidadStrategy(StrategyReports):
    """Estrategia para generar el reporte de 'Cantidad de turnos por especialidad'."""

    def generate_report(self, start_date: str, end_date: str, **kwargs) -> Dict[str, Any]:
        
        turnos_data = self.turno_repo.count_turnos_by_especialidad(start_date, end_date)
        
        reporte = {
            "title": "Cantidad de Turnos por Especialidad",
            "periodo": f"{start_date} a {end_date}",
            "total_registros": len(turnos_data),
            "data": turnos_data
        }
        
        return reporte