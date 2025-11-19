from .strategy import StrategyReports
from typing import Any, Dict, List
#from app.backend.services.turnos_repository import TurnoRepository # Inyectado

class ReportePorMedicoStrategy(StrategyReports):
    """Estrategia para generar el reporte de 'Listado de turnos por médico'."""

    def generate_report(self, start_date: str, end_date: str, **kwargs) -> Dict[str, Any]:
        
        medico_matricula = kwargs.get("matricula")
        if not medico_matricula:
            # En un entorno real, lanzarías una excepción aquí
            return {"error": "Se requiere la matrícula para este reporte."}
            
        # 💡 LÓGICA CLAVE: El Repository tiene que tener el método para esta consulta compleja.
        # Aquí llamarías al TurnoRepository, que hace el JOIN necesario.
        
        turnos_data = self.turno_repo.get_turnos_by_medico_and_dates(
            medico_matricula, start_date, end_date
        )
        
        # Formatear el resultado
        reporte = {
            "title": f"Turnos del Médico {medico_matricula}",
            "periodo": f"{start_date} a {end_date}",
            "total_turnos": len(turnos_data),
            "data": turnos_data
        }
        
        return reporte