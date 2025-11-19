from sqlalchemy.orm import Session
from app.backend.models.models import Turno
from typing import List
from app.backend.services.exceptions import HorarioNoDisponibleError, IntegrityError

class TurnoRepository:
    """Clase responsable de la interacción directa con la tabla Turnos."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_pk(self, fecha: str, hora: str, paciente_nro: int) -> Turno | None:
        """Obtiene un turno por su clave primaria compuesta."""
        # Se asume que las claves primarias son Fecha, Hora y Paciente_nroPaciente
        return self.db.query(Turno).filter(
            Turno.Fecha == fecha,
            Turno.Hora == hora,
            Turno.Paciente_nroPaciente == paciente_nro
        ).first()

    def create(self, turno_data: Turno) -> Turno:
        """Persiste un nuevo objeto Turno en la DB."""
        self.db.add(turno_data)
        
        try:
            self.db.commit()
        except IntegrityError as e:
            self.db.rollback()
            # 💡 Lanzamos una excepción de negocio específica
            # Si el error es por la PK, el paciente ya tiene turno en esa hora/fecha.
            if "UNIQUE constraint failed: Turnos.Fecha, Turnos.Hora, Turnos.Paciente_nroPaciente" in str(e):
                raise HorarioNoDisponibleError("El paciente ya tiene un turno asignado para esa fecha y hora.")
            # Si es otra FK, lo dejamos pasar al Service (o creamos otra excepción)
            raise e
            
        self.db.refresh(turno_data)
        return turno_data

    def update(self, turno: Turno) -> Turno:
        """Persiste los cambios en un objeto Turno existente (usado para cambios de estado)."""
        # Solo necesitamos commit() y refresh() ya que el objeto ya está en la sesión
        self.db.commit()
        self.db.refresh(turno)
        return turno
    
    def get_all(self) -> List[Turno]:
        """Obtiene todos los turnos."""
        return self.db.query(Turno).all()

    def delete(self, turno: Turno) -> None:
        """Elimina un turno de la base de datos."""
        self.db.delete(turno)
        self.db.commit()

    # Aquí se podrían agregar métodos específicos para reportes, ej. get_turnos_by_medico_and_fecha()