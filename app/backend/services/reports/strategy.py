from abc import ABC, abstractmethod
from typing import Any, Dict, List
# Se asume que el TurnoRepository será inyectado aquí
# from app.backend.services.turnos_repository import TurnoRepository 

class StrategyReports(ABC):
    """
    Interfaz abstracta para todos los tipos de reportes (Estrategias).
    Define el método común 'generate_report'.
    """
    
    def __init__(self, turno_repo: Any): # Usamos Any para simplificar la inyección del repo
        self.turno_repo = turno_repo
        
    @abstractmethod
    def generate_report(self, start_date: str, end_date: str, **kwargs) -> Dict[str, Any]:
        """
        Debe ser implementado por todas las estrategias concretas para generar el reporte específico.
        """
        pass