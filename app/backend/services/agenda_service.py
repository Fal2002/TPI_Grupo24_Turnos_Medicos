from app.backend.services.agenda_repository import AgendaRepository
from app.backend.services.medico_repository import (
    MedicoRepository,
)  # Necesario para validar FK
from app.backend.schemas.agenda_excepcional import AgendaExcepcionalCreate
from app.backend.schemas.agenda_regular import AgendaRegularCreate
from app.backend.models.models import AgendaRegular, AgendaExcepcional
from app.backend.services.exceptions import RecursoNoEncontradoError, ValueError
from datetime import datetime, date, timedelta, time
from typing import List, Optional
from sqlalchemy.orm import (
    Session,
)  # Aunque el Service es independiente, la inyección del repo lo requiere


class AgendaService:
    def __init__(self, agenda_repo: AgendaRepository, medico_repo: MedicoRepository):
        # DEPENDENCIAS
        self.agenda_repo = agenda_repo
        self.medico_repo = medico_repo

    def registrar_agenda_excepcional(
        self, medico_matricula: str, data: AgendaExcepcionalCreate
    ):

        if not self.medico_repo.get_by_matricula(medico_matricula):
            raise RecursoNoEncontradoError(
                f"Médico con matrícula {medico_matricula} no encontrado."
            )

        # Validación de fechas (ej. No puede ser en el pasado)
        try:
            fecha_inicio = datetime.strptime(data.Fecha_inicio, "%Y-%m-%d").date()
            if fecha_inicio < date.today():
                # 💡 El Service lanza una excepción de negocio
                raise ValueError(
                    "La fecha de inicio de la agenda excepcional debe ser futura o igual a hoy."
                )

            # Validación de rangos
            if data.Fecha_inicio > data.Fecha_Fin or ((data.Hora_inicio >= data.Hora_Fin) and (data.Fecha_inicio == data.Fecha_Fin)):
                raise ValueError(
                    "El rango de tiempo/fecha es inválido (inicio debe ser anterior al fin)."
                )

        except ValueError as e:
            # Captura errores de formato o lógica de rangos
            raise ValueError(f"Error en datos de agenda excepcional: {str(e)}")

        # Persistencia (Llama al Repository)
        return self.agenda_repo.create_agenda_excepcional(medico_matricula, data)

    def registrar_agenda_regular(
        self, medico_matricula: str, data: AgendaRegularCreate
    ) -> AgendaRegular:

        # 1. Validación de Integridad (FKs)
        if not self.medico_repo.get_by_matricula(medico_matricula):
            raise RecursoNoEncontradoError(
                f"Médico con matrícula {medico_matricula} no encontrado."
            )

        # 2. Lógica de Negocio (Duración y Consistencia)
        if data.Duracion <= 0:
            raise ValueError(
                "La duración del turno debe ser un valor positivo en minutos."
            )

        if data.Hora_inicio >= data.Hora_fin:
            raise ValueError("La hora de inicio debe ser anterior a la hora de fin.")

        # 3. Persistencia (Llama al Repository)
        # Se asume que el Repository maneja la unicidad de las claves compuestas (Matricula, Especialidad, Dia_de_semana, Hora_inicio)
        return self.agenda_repo.create_agenda_regular(medico_matricula, data)

    def obtener_agendas_excepcionales(
        self, medico_matricula: str ) -> List[AgendaExcepcional]:
        return self.agenda_repo.get_agendas_excepcionales_by_medico(medico_matricula)
    # ----------------------------------------------------
    # Funciones de Consulta (Usadas por el Router de Agenda)
    # ----------------------------------------------------
    def obtener_agendas_regulares(self, medico_matricula: str) -> List[AgendaRegular]:
        # El Service solo llama al Repository para obtener datos (y podría aplicar filtrado o lógica si fuera necesario)
        return self.agenda_repo.get_agendas_regulares_by_medico(medico_matricula)

    # Aquí iría el resto del CRUD (Update, Delete) para ambas agendas

    def eliminar_agenda_regular(
        self,
        medico_matricula: str,
        especialidad_id: int,
        dia_de_semana: int,
        hora_inicio: str,
    ) -> None:
        # 1. Obtener la agenda regular específica
        agendas = self.agenda_repo.get_agendas_regulares_by_medico(medico_matricula)
        agenda_a_eliminar: Optional[AgendaRegular] = None

        for agenda in agendas:
            if (
                agenda.Dia_de_semana == dia_de_semana
                and agenda.Hora_inicio == hora_inicio
            ):
                agenda_a_eliminar = agenda
                break

        if not agenda_a_eliminar:
            raise RecursoNoEncontradoError(
                f"Agenda regular no encontrada para médico {medico_matricula} con especialidad {especialidad_id} en día {dia_de_semana} a las {hora_inicio}."
            )

        # 2. Llamar al Repository para eliminarla
        self.agenda_repo.delete_agenda_regular(agenda_a_eliminar)

    def eliminar_agenda_excepcional(
        self, medico_matricula: str, especialidad_id: int, fecha_inicio: str, hora_inicio: str
    ) -> None:
        # 1. Obtener la agenda excepcional específica
        agenda = self.agenda_repo.get_agenda_excepcional_by_pk(medico_matricula, especialidad_id, fecha_inicio, hora_inicio)

        if not agenda:
            raise RecursoNoEncontradoError(
                f"Agenda excepcional no encontrada para médico {medico_matricula}."
            )

        # 2. Llamar al Repository para eliminarla
        self.agenda_repo.delete_agenda_excepcional(agenda)

    def consultar_agenda_disponible(
        self, medico_matricula: str, fecha: date
    ) -> List[dict]:
        return self.obtener_turnos_disponibles(medico_matricula, fecha, fecha)

    def obtener_turnos_disponibles(
        self, medico_matricula: str, fecha_inicio: date, fecha_fin: date
    ) -> List[dict]:
        # 1. Obtener datos
        agendas_regulares = self.agenda_repo.get_agendas_regulares_by_medico(
            medico_matricula
        )
        agendas_excepcionales = self.agenda_repo.get_agendas_excepcionales_by_rango(
            medico_matricula, fecha_inicio, fecha_fin
        )
        turnos = self.agenda_repo.get_turnos_by_rango(
            medico_matricula, fecha_inicio, fecha_fin
        )

        available_slots = []

        # Mapa de duraciones por especialidad (para agendas excepcionales)
        duraciones_por_especialidad = {}
        for ag in agendas_regulares:
            duraciones_por_especialidad[ag.Especialidad_Id] = ag.Duracion

        current_date = fecha_inicio
        while current_date <= fecha_fin:
            day_of_week = current_date.isoweekday()

            # Candidatos del día
            daily_slots = []

            # A. Agendas Regulares
            for ag in agendas_regulares:
                if ag.Dia_de_semana == day_of_week:
                    start_dt = datetime.combine(
                        current_date, datetime.strptime(ag.Hora_inicio, "%H:%M").time()
                    )
                    end_dt = datetime.combine(
                        current_date, datetime.strptime(ag.Hora_fin, "%H:%M").time()
                    )

                    curr_dt = start_dt
                    while curr_dt + timedelta(minutes=ag.Duracion) <= end_dt:
                        daily_slots.append(
                            {
                                "fecha": current_date.strftime("%Y-%m-%d"),
                                "hora": curr_dt.strftime("%H:%M"),
                                "medico_matricula": medico_matricula,
                                "especialidad_id": ag.Especialidad_Id,
                                "duracion": ag.Duracion,
                                "sucursal_id": ag.Sucursal_Id,
                            }
                        )
                        curr_dt += timedelta(minutes=ag.Duracion)

            # B. Agendas Excepcionales (Disponibles)
            for ag in agendas_excepcionales:
                ag_inicio = datetime.strptime(ag.Fecha_inicio, "%Y-%m-%d").date()
                ag_fin = datetime.strptime(ag.Fecha_Fin, "%Y-%m-%d").date()

                if ag_inicio <= current_date <= ag_fin and ag.Es_Disponible == 1:
                    duracion = duraciones_por_especialidad.get(
                        ag.Especialidad_Id, 20
                    )  # Default 20 min

                    start_dt = datetime.combine(
                        current_date, datetime.strptime(ag.Hora_inicio, "%H:%M").time()
                    )
                    end_dt = datetime.combine(
                        current_date, datetime.strptime(ag.Hora_Fin, "%H:%M").time()
                    )

                    curr_dt = start_dt
                    while curr_dt + timedelta(minutes=duracion) <= end_dt:
                        slot = {
                            "fecha": current_date.strftime("%Y-%m-%d"),
                            "hora": curr_dt.strftime("%H:%M"),
                            "medico_matricula": medico_matricula,
                            "especialidad_id": ag.Especialidad_Id,
                            "duracion": duracion,
                            "sucursal_id": ag.Consultorio_Sucursal_Id,
                        }
                        # Evitar duplicados exactos
                        if slot not in daily_slots:
                            daily_slots.append(slot)
                        curr_dt += timedelta(minutes=duracion)

            # C. Filtrar Bloqueos y Turnos
            final_slots = []
            for slot in daily_slots:
                slot_start = datetime.combine(
                    current_date, datetime.strptime(slot["hora"], "%H:%M").time()
                )
                slot_end = slot_start + timedelta(minutes=slot["duracion"])

                is_blocked = False

                # 1. Chequear Bloqueos Excepcionales
                for ag in agendas_excepcionales:
                    ag_inicio = datetime.strptime(ag.Fecha_inicio, "%Y-%m-%d").date()
                    ag_fin = datetime.strptime(ag.Fecha_Fin, "%Y-%m-%d").date()

                    if ag_inicio <= current_date <= ag_fin and ag.Es_Disponible == 0:
                        block_start = datetime.combine(
                            current_date,
                            datetime.strptime(ag.Hora_inicio, "%H:%M").time(),
                        )
                        block_end = datetime.combine(
                            current_date, datetime.strptime(ag.Hora_Fin, "%H:%M").time()
                        )

                        if slot_start < block_end and block_start < slot_end:
                            is_blocked = True
                            break

                if is_blocked:
                    continue

                # 2. Chequear Turnos
                for turno in turnos:
                    if turno.Fecha == slot["fecha"]:
                        turno_start = datetime.combine(
                            current_date, datetime.strptime(turno.Hora, "%H:%M").time()
                        )
                        turno_end = turno_start + timedelta(minutes=turno.Duracion)

                        if slot_start < turno_end and turno_start < slot_end:
                            is_blocked = True
                            break

                if not is_blocked:
                    final_slots.append(slot)

            available_slots.extend(final_slots)
            current_date += timedelta(days=1)

        return available_slots
