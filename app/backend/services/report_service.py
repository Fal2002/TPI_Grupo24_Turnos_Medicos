# (GeneradorReportes)

from app.backend.services.reports.strategy import StrategyReports # La interfaz
from app.backend.services.reports.by_medico import ReportePorMedicoStrategy # Una estrategia concreta
from app.backend.services.reports.by_especialidad import ReportePorEspecialidadStrategy
from app.backend.services.reports.atendidos import ReporteAtendidosStrategy
from app.backend.services.reports.asistencias_grafico import ReporteGraficoAsistenciasStrategy

from app.backend.services.turno_repository import TurnoRepository
from app.backend.services.exceptions import RecursoNoEncontradoError, ValueError
from typing import Dict, Any, Type, Optional

class ReportService:
    """
    Contexto para el Patrón Strategy. 
    Contiene la referencia a la Estrategia y delega la generación del reporte.
    """
    
    # Mapeo de strings (del Router) a clases Strategy concretas
    STRATEGY_MAP: Dict[str, Type[StrategyReports]] = {
        "medico": ReportePorMedicoStrategy,
        "especialidad": ReportePorEspecialidadStrategy,
        "atendidos": ReporteAtendidosStrategy,
        "asistencias": ReporteGraficoAsistenciasStrategy,
    }

    def __init__(self, turno_repo: TurnoRepository):
        # El contexto solo necesita el repositorio para pasarlo a las estrategias
        self.turno_repo = turno_repo
        # Inicialmente no tiene una estrategia seleccionada
        self._strategy: Optional[StrategyReports] = None

    def set_strategy(self, strategy_type: str):
        """
        Selecciona la estrategia (el tipo de reporte) a usar.
        :param strategy_type: La clave del STRATEGY_MAP (ej. "medico")
        """
        StrategyClass = self.STRATEGY_MAP.get(strategy_type)
        if not StrategyClass:
            raise RecursoNoEncontradoError(f"Tipo de reporte '{strategy_type}' no soportado.")
        
        # 💡 CRÍTICO: Instancia la clase de estrategia, inyectándole el TurnoRepository
        self._strategy = StrategyClass(self.turno_repo)

    def generate_report(self, start_date: str, end_date: str, **kwargs) -> Dict[str, Any]:
        """
        Ejecuta la estrategia actualmente seleccionada.
        """
        if not self._strategy:
            raise ValueError("No se ha seleccionado ninguna estrategia de reporte.")
            
        # 💡 DELEGACIÓN: Llama al método abstracto de la estrategia concreta
        return self._strategy.generate_report(start_date, end_date, **kwargs)