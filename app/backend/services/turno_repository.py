from __future__ import annotations
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from sqlalchemy.exc import IntegrityError
from app.backend.models.models import Turno, Medico, Paciente, Estado, Especialidad
from typing import List, Optional, Dict, Any
from app.backend.services.exceptions import HorarioNoDisponibleError


class TurnoRepository:
    """Clase responsable de la interacción directa con la tabla Turnos."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_pk(
        self, fecha: str, hora: str, paciente_nro: int
    ) -> Optional[Turno]:  # Corregido: Turno | None
        """Obtiene un turno por su clave primaria compuesta."""

        return (
            self.db.query(Turno)
            .filter(
                Turno.Fecha == fecha,
                Turno.Hora == hora,
                Turno.Paciente_nroPaciente == paciente_nro,
            )
            .first()
        )

    def create(self, turno_data: Turno) -> Turno:
        """Persiste un nuevo objeto Turno en la DB."""
        self.db.add(turno_data)

        try:
            self.db.commit()
        except IntegrityError as e:
            self.db.rollback()

            if (
                "UNIQUE constraint failed: Turnos.Fecha, Turnos.Hora, Turnos.Paciente_nroPaciente"
                in str(e)
            ):
                raise HorarioNoDisponibleError(
                    "El paciente ya tiene un turno asignado para esa fecha y hora."
                )

            raise e

        self.db.refresh(turno_data)
        return turno_data

    def update(self, turno: Turno) -> Turno:
        """Persiste los cambios en un objeto Turno existente (usado para cambios de estado)."""

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

    # =========================================================================
    # ROL DE SOPORTE PARA REPORTES (CONSULTAS COMPLEJAS)
    # =========================================================================

    def get_turnos_by_medico_and_dates(
        self, medico_matricula: str, start_date: str, end_date: str
    ) -> List[dict]:
        """
        Obtiene el listado de turnos de un médico en un período.
        """
        query = self.db.query(
            Turno.Fecha,
            Turno.Hora,
            Paciente.Nombre.label("Paciente_Nombre"),
            Paciente.Apellido.label("Paciente_Apellido"),
            Estado.Descripcion.label("Estado_Turno"),
            Turno.Duracion,
        ).join(Medico, Medico.Matricula == Turno.Medico_Matricula)

        query = query.join(Paciente, Paciente.nroPaciente == Turno.Paciente_nroPaciente)
        query = query.join(Estado, Estado.Id == Turno.Estado_Id)
        query = query.filter(
            Turno.Medico_Matricula == medico_matricula,
            and_(Turno.Fecha >= start_date, Turno.Fecha <= end_date),
        ).order_by(Turno.Fecha, Turno.Hora)

        result = query.all()
        return [row._asdict() for row in result]

    def count_turnos_by_especialidad(
        self, start_date: str, end_date: str
    ) -> List[dict]:
        """
        Cuenta la cantidad de turnos por especialidad dentro de un rango de fechas.
        """
        query = self.db.query(
            Especialidad.descripcion.label("Especialidad_Nombre"),
            func.count(Turno.Especialidad_Id).label("Total_Turnos"),
        )
        query = query.join(
            Especialidad, Especialidad.Id_especialidad == Turno.Especialidad_Id
        )  # CLAVE CORREGIDA
        query = query.filter(
            and_(Turno.Fecha >= start_date, Turno.Fecha <= end_date)
        ).group_by(Especialidad.descripcion)

        result = query.all()
        return [row._asdict() for row in result]

    def get_pacientes_atendidos(self, start_date: str, end_date: str) -> List[dict]:
        """
        [MÉTODO FALTANTE] Obtiene el listado de pacientes atendidos (Turnos en estado 'Finalizado' o 'Atendido').
        """
        # Obtenemos los IDs de los estados de interés
        estados_finales = (
            self.db.query(Estado)
            .filter(Estado.Descripcion.in_(["Finalizado", "Atendido"]))
            .all()
        )
        estado_ids = [e.Id for e in estados_finales]

        if not estado_ids:
            return []

        query = self.db.query(
            Turno.Fecha,
            Turno.Hora,
            Paciente.nroPaciente.label("Nro_Paciente"),
            Paciente.Nombre.label("Paciente_Nombre"),
            Paciente.Apellido.label("Paciente_Apellido"),
            Estado.Descripcion.label("Estado_Final"),
        ).join(Paciente, Paciente.nroPaciente == Turno.Paciente_nroPaciente)

        query = query.join(Estado, Estado.Id == Turno.Estado_Id)
        query = query.filter(
            Turno.Estado_Id.in_(estado_ids),
            and_(Turno.Fecha >= start_date, Turno.Fecha <= end_date),
        ).order_by(Turno.Fecha)

        result = query.all()
        return [row._asdict() for row in result]

    def count_asistencia_vs_inasistencia(
        self, start_date: str, end_date: str
    ) -> List[dict]:
        """
        Cuenta el total de turnos en estado 'Finalizado' (Asistencia) y 'Ausente' (Inasistencia).
        """

        estados_interes = (
            self.db.query(Estado)
            .filter(Estado.Descripcion.in_(["Finalizado", "Ausente"]))
            .all()
        )
        estado_ids = [e.Id for e in estados_interes]

        if not estado_ids:
            return []

        query = self.db.query(
            Estado.Descripcion.label("Tipo_Registro"),
            func.count(Turno.Estado_Id).label("Total_Turnos"),
        )
        query = query.join(Estado, Estado.Id == Turno.Estado_Id)
        query = query.filter(
            Turno.Estado_Id.in_(estado_ids),
            and_(Turno.Fecha >= start_date, Turno.Fecha <= end_date),
        ).group_by(Estado.Descripcion)

        result = query.all()
        return [row._asdict() for row in result]

    def get_turnos_all_medicos_in_period(
        self, start_date: str, end_date: str
    ) -> List[dict]:
        """
        Obtiene el listado de turnos de TODOS los médicos en un período.
        """
        query = self.db.query(
            Turno.Fecha,
            Turno.Hora,
            Medico.Nombre.label("Medico_Nombre"),
            Medico.Apellido.label("Medico_Apellido"),
            Medico.Matricula.label("Medico_Matricula"),
            Paciente.Nombre.label("Paciente_Nombre"),
            Paciente.Apellido.label("Paciente_Apellido"),
            Estado.Descripcion.label("Estado_Turno"),
            Turno.Duracion,
        ).join(Medico, Medico.Matricula == Turno.Medico_Matricula)

        query = query.join(Paciente, Paciente.nroPaciente == Turno.Paciente_nroPaciente)
        query = query.join(Estado, Estado.Id == Turno.Estado_Id)
        query = query.filter(
            and_(Turno.Fecha >= start_date, Turno.Fecha <= end_date)
        ).order_by(Medico.Apellido, Medico.Nombre, Turno.Fecha, Turno.Hora)

        result = query.all()
        return [row._asdict() for row in result]
