from sqlalchemy.orm import Session, joinedload
from app.backend.models.models import Medico # Asume que tu Medico model está importado
from typing import List
from app.backend.schemas.medico import MedicoUpdate # Para tipado en el update

class MedicoRepository:
    """Clase responsable de la interacción directa con la tabla Medicos en la DB."""
    
    def __init__(self, db: Session):
        self.db = db

    def get_by_matricula(self, matricula: str) -> Medico | None:
        """Obtiene un médico por su matrícula."""
        return self.db.query(Medico).options(joinedload(Medico.user)).filter(Medico.Matricula == matricula).first()

    def get_all(self) -> List[Medico]:
        """Obtiene todos los médicos."""
        return self.db.query(Medico).options(joinedload(Medico.user)).all()

    def create(self, medico_data: Medico) -> Medico:
        """Persiste un nuevo objeto Medico en la DB."""
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
        
        self.db.commit()
        self.db.refresh(medico)
        return medico

    def delete(self, medico: Medico) -> None:
        """Elimina un médico de la DB."""
        self.db.delete(medico)
        self.db.commit()