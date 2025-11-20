from app.backend.services.recetas_repository import RecetaRepository
from app.backend.models.models import Receta, DetalleReceta, Medicamento
from app.backend.services.exceptions import RecursoNoEncontradoError
from sqlalchemy.orm import Session
from typing import List

class RecetaService:
    def __init__(self, receta_repo: RecetaRepository, db_session: Session):
        self.receta_repo = receta_repo
        self.db = db_session

    def crear_receta(self, fecha: str, hora: str, paciente_nro: int) -> Receta:
        """Crea una nueva receta asociada a un turno."""
        # Aquí se podría validar que el turno exista usando TurnoRepository si fuera necesario
        nueva_receta = Receta(
            Turno_Fecha=fecha,
            Turno_Hora=hora,
            Turno_Paciente_nroPaciente=paciente_nro
        )
        return self.receta_repo.create(nueva_receta)

    def obtener_recetas(self) -> List[Receta]:
        """Obtiene todas las recetas."""
        return self.receta_repo.get_all()

    def obtener_receta_por_id(self, receta_id: int) -> Receta:
        """Obtiene una receta por su ID, lanzando error si no existe."""
        receta = self.receta_repo.get_by_id(receta_id)
        if not receta:
            raise RecursoNoEncontradoError(f"Receta {receta_id} no encontrada.")
        return receta

    def obtener_recetas_por_turno(self, fecha: str, hora: str, paciente_nro: int) -> List[Receta]:
        """Obtiene las recetas de un turno específico."""
        return self.receta_repo.get_by_turno(fecha, hora, paciente_nro)

    def eliminar_receta(self, receta_id: int) -> None:
        """Elimina una receta por su ID."""
        receta = self.obtener_receta_por_id(receta_id)
        self.receta_repo.delete(receta)

    def agregar_medicamento(self, receta_id: int, medicamento_id: int) -> DetalleReceta:
        """Agrega un medicamento a una receta."""
        # Verificamos que la receta exista
        self.obtener_receta_por_id(receta_id)
        
        # Se podría validar que el medicamento exista si tuviéramos MedicamentoRepository
        # Por ahora confiamos en la integridad referencial de la base de datos
        return self.receta_repo.add_medicamento(receta_id, medicamento_id)

    def obtener_medicamentos_de_receta(self, receta_id: int) -> List[Medicamento]:
        """Obtiene los medicamentos de una receta."""
        self.obtener_receta_por_id(receta_id)
        return self.receta_repo.get_medicamentos_by_receta(receta_id)
