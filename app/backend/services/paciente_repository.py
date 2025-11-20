from sqlalchemy.orm import Session
from app.backend.models.models import Paciente
from typing import List


class PacienteRepository:
    """Clase responsable de la interacción directa con la tabla Pacientes en la DB."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, nro_paciente: int) -> Paciente | None:
        """Obtiene un paciente por su nroPaciente (Primary Key)."""
        return (
            self.db.query(Paciente).filter(Paciente.nroPaciente == nro_paciente).first()
        )

    def get_by_email(self, email: str) -> Paciente | None:
        """Obtiene un paciente por su email (para verificar unicidad)."""
        return self.db.query(Paciente).filter(Paciente.Email == email).first()

    def get_by_user_id(self, user_id: int) -> Paciente | None:
        """Obtiene un paciente por su User_Id."""
        return self.db.query(Paciente).filter(Paciente.User_Id == user_id).first()

    def get_all(self) -> List[Paciente]:
        """Obtiene todos los pacientes."""
        return self.db.query(Paciente).all()

    def get_by_medico(
        self, medico_matricula: str, especialidad_id: int = None
    ) -> List[Paciente]:
        """Obtiene todos los pacientes asociados a un médico específico, opcionalmente filtrando por especialidad."""
        query = self.db.query(Paciente)

        if especialidad_id:
            query = query.filter(
                Paciente.turnos.any(
                    Medico_Matricula=medico_matricula, Especialidad_Id=especialidad_id
                )
            )
        else:
            query = query.filter(Paciente.turnos.any(Medico_Matricula=medico_matricula))

        return query.all()

    def get_by_filters(
        self, numero: str | None = None, nombre: str | None = None
    ) -> List[Paciente]:
        """Obtiene pacientes aplicando filtros opcionales."""
        query = self.db.query(Paciente)

        if numero:
            query = query.filter(Paciente.nroPaciente.like(f"%{numero}%"))

        if nombre:
            query = query.filter(
                (Paciente.Nombre.ilike(f"%{nombre}%"))
                | (Paciente.Apellido.ilike(f"%{nombre}%"))
            )

        return query.all()

    def create(self, paciente_data: Paciente) -> Paciente:
        """Persiste un nuevo objeto Paciente en la DB."""
        self.db.add(paciente_data)
        self.db.commit()
        self.db.refresh(paciente_data)
        return paciente_data

    # Aquí iría el update y delete. Se omite para brevedad, pero seguiría el patrón de MedicoRepository.
