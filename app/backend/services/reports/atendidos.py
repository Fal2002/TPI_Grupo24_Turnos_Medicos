from .strategy import StrategyReports
from typing import Any, Dict


class ReporteAtendidosStrategy(StrategyReports):
    """Estrategia para generar el reporte de 'Pacientes atendidos en un rango de fechas'."""

    def generate_report(
        self, start_date: str, end_date: str, **kwargs
    ) -> Dict[str, Any]:

        pacientes_data = self.turno_repo.get_pacientes_atendidos(start_date, end_date)

        reporte = {
            "title": "Pacientes Atendidos y Finalizados",
            "periodo": f"{start_date} a {end_date}",
            "total_registros": len(pacientes_data),
            "data": pacientes_data,
        }

        return reporte
