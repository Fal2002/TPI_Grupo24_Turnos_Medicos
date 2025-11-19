# app/backend/services/medico_repository.py

from sqlalchemy.orm import Session
from app.backend.models.models import (
    Especialidad,
    Medico,
)  # Asume que tu Medico model está importado
from typing import List
from app.backend.schemas.medico import MedicoUpdate  # Para tipado en el update


class MedicoRepository:
    """Clase responsable de la interacción directa con la tabla Medicos en la DB."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_matricula(self, matricula: str) -> Medico | None:
        """Obtiene un médico por su matrícula."""
        return self.db.query(Medico).filter(Medico.Matricula == matricula).first()

    def get_all(self) -> List[Medico]:
        """Obtiene todos los médicos."""
        return self.db.query(Medico).all()

    def create(self, medico_data: Medico, especialidades_ids: List[int]) -> Medico:
        """Persiste un nuevo objeto Medico en la DB."""
        # Convertir IDs en objetos Especialidad
        especialidades_objs = (
            self.db.query(Especialidad)
            .filter(Especialidad.Id_especialidad.in_(especialidades_ids))
            .all()
        )
        medico_data.especialidades = especialidades_objs

        self.db.add(medico_data)
        self.db.commit()
        self.db.refresh(medico_data)
        return medico_data

    def update(self, medico: Medico, data: MedicoUpdate) -> Medico:
        """Actualiza los campos de un médico existente."""
        if data.Nombre is not None:
            medico.Nombre = data.Nombre
        if data.Apellido is not None:
            medico.Apellido = data.Apellido
        if data.especialidades is not None:
            print("Updating especialidades to IDs:", data.especialidades)
            # Convertir IDs en objetos Especialidad
            especialidades_objs = (
                self.db.query(Especialidad)
                .filter(Especialidad.Id_especialidad.in_(data.especialidades))
                .all()
            )
            medico.especialidades = especialidades_objs

        self.db.commit()
        self.db.refresh(medico)
        return medico

    def delete(self, medico: Medico) -> None:
        """Elimina un médico de la DB."""
        self.db.delete(medico)
        self.db.commit()
