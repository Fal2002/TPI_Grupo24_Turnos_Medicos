from .strategy import StrategyReports
from typing import Any, Dict

class ReporteGraficoAsistenciasStrategy(StrategyReports):
    """Estrategia para generar el reporte de 'Estadísticas de Asistencia vs. Inasistencia'."""

    def generate_report(self, start_date: str, end_date: str, **kwargs) -> Dict[str, Any]:
        
        # 💡 LÓGICA CLAVE: Llama al método de conteo
        stats_data = self.turno_repo.count_asistencia_vs_inasistencia(start_date, end_date)
        
        # Lógica para calcular porcentajes y formatear para el gráfico
        total = sum(item['Total_Turnos'] for item in stats_data)
        
        if total == 0:
            return {
                "title": "Estadísticas de Asistencia",
                "total_registros": 0,
                "data": [],
                "summary": "No hay turnos finalizados o ausentes en el periodo."
            }

        asistencia = next((item['Total_Turnos'] for item in stats_data if item['Tipo_Registro'] == 'Finalizado'), 0)
        inasistencia = next((item['Total_Turnos'] for item in stats_data if item['Tipo_Registro'] == 'Ausente'), 0)

        reporte = {
            "title": "Estadísticas de Asistencia vs. Inasistencia",
            "periodo": f"{start_date} a {end_date}",
            "total_turnos_evaluados": total,
            "data": stats_data,
            "summary": {
                "asistencia_porcentaje": f"{(asistencia / total) * 100:.2f}%",
                "inasistencia_porcentaje": f"{(inasistencia / total) * 100:.2f}%",
            }
        }
        
        return reporte