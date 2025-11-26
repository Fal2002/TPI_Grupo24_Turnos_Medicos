from __future__ import annotations
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.backend.models.models import Receta, DetalleReceta, Medicamento
from typing import List, Optional


class RecetaRepository:
    """Clase responsable de la interacción directa con la tabla Recetas."""

    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Receta]:
        """Obtiene todas las recetas."""
        return self.db.query(Receta).all()

    def get_by_id(self, receta_id: int) -> Optional[Receta]:
        """Obtiene una receta por su ID."""
        return self.db.query(Receta).filter(Receta.Id == receta_id).first()

    def get_by_turno(self, fecha: str, hora: str, paciente_nro: int) -> List[Receta]:
        """Obtiene las recetas asociadas a un turno específico."""
        return (
            self.db.query(Receta)
            .filter(
                Receta.Turno_Fecha == fecha,
                Receta.Turno_Hora == hora,
                Receta.Turno_Paciente_nroPaciente == paciente_nro,
            )
            .all()
        )

    def create(self, receta_data: Receta) -> Receta:
        """Persiste una nueva receta en la DB."""
        self.db.add(receta_data)
        try:
            self.db.commit()
        except IntegrityError as e:
            self.db.rollback()
            raise e

        self.db.refresh(receta_data)
        return receta_data

    def delete(self, receta: Receta) -> None:
        """Elimina una receta de la base de datos."""
        self.db.delete(receta)
        self.db.commit()

    def add_medicamento(self, receta_id: int, medicamento_id: int) -> DetalleReceta:
        """Agrega un medicamento a una receta (crea un DetalleReceta)."""
        detalle = DetalleReceta(Receta_Id=receta_id, Medicamento_Id=medicamento_id)
        self.db.add(detalle)
        try:
            self.db.commit()
        except IntegrityError as e:
            self.db.rollback()
            raise e

        self.db.refresh(detalle)
        return detalle

    def get_medicamentos_by_receta(self, receta_id: int) -> List[Medicamento]:
        """Obtiene los medicamentos asociados a una receta."""
        return (
            self.db.query(Medicamento)
            .join(DetalleReceta, DetalleReceta.Medicamento_Id == Medicamento.Id)
            .filter(DetalleReceta.Receta_Id == receta_id)
            .all()
        )
