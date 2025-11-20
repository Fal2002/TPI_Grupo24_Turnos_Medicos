from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.backend.models.models import AgendaRegular, AgendaExcepcional, Turno, Medico
from app.backend.schemas.agenda_excepcional import AgendaExcepcionalCreate
from app.backend.schemas.agenda_regular import AgendaRegularCreate
from datetime import date, time, datetime, timedelta
from typing import List, Optional


class AgendaRepository:
    def __init__(self, db: Session):
        self.db = db

    # ==================================================================
    def create_agenda_excepcional(
        self, medico_matricula: str, data: AgendaExcepcionalCreate
    ) -> AgendaExcepcional:
        # ... (Tu código de creación se mantiene) ...
        agenda = AgendaExcepcional(
            Medico_Matricula=medico_matricula,
            Especialidad_Id=data.Especialidad_Id,
            Fecha_inicio=data.Fecha_inicio,
            Hora_inicio=data.Hora_inicio,
            Fecha_Fin=data.Fecha_Fin,
            Hora_Fin=data.Hora_Fin,
            Es_Disponible=data.Es_Disponible,
            Motivo=data.Motivo,
            Consultorio_Numero=data.Consultorio_Numero,
            Consultorio_Sucursal_Id=data.Consultorio_Sucursal_Id,
        )
        self.db.add(agenda)
        self.db.commit()
        self.db.refresh(agenda)
        return agenda

    def create_agenda_regular(
        self, medico_matricula: str, data: AgendaRegularCreate
    ) -> AgendaRegular:
        # ... (Tu código de creación se mantiene) ...
        agenda = AgendaRegular(
            Medico_Matricula=medico_matricula,
            Especialidad_Id=data.Especialidad_Id,
            Dia_de_semana=data.Dia_de_semana,
            Hora_inicio=data.Hora_inicio,
            Hora_fin=data.Hora_fin,
            Duracion=data.Duracion,
            Sucursal_Id=data.Sucursal_Id,
        )
        self.db.add(agenda)
        self.db.commit()
        self.db.refresh(agenda)
        return agenda

    def get_agendas_regulares_by_medico(
        self, medico_matricula: str
    ) -> List[AgendaRegular]:
        return (
            self.db.query(AgendaRegular)
            .filter(AgendaRegular.Medico_Matricula == medico_matricula)
            .all()
        )

    def get_agenda_regular_by_pk(
        self, medico_matricula: str, dia_de_semana: int, hora_inicio: str
    ) -> AgendaRegular | None:
        return (
            self.db.query(AgendaRegular)
            .filter(
                AgendaRegular.Medico_Matricula == medico_matricula,
                AgendaRegular.Dia_de_semana == dia_de_semana,
                AgendaRegular.Hora_inicio == hora_inicio,
            )
            .first()
        )

    def get_agendas_excepcionales_by_medico(
        self, medico_matricula: str
    ) -> List[AgendaExcepcional]:
        return (
            self.db.query(AgendaExcepcional)
            .filter(AgendaExcepcional.Medico_Matricula == medico_matricula)
            .all()
        )

    def delete_agenda_regular(self, agenda: AgendaRegular) -> None:
        self.db.delete(agenda)
        self.db.commit()

    # ==================================================================

    def verificar_disponibilidad(
        self, medico_matricula: str, fecha_turno: date, hora_turno: time, duracion: int
    ) -> str | None:
        """
        Verifica la disponibilidad y conflictos. Retorna un mensaje de error (str) o None (disponible).
        """

        # --- CÓDIGO DE PREPARACIÓN DE HORA (USANDO %H:%M) ---
        hora_inicio_str = hora_turno.strftime("%H:%M")

        turno_datetime = datetime.combine(fecha_turno, hora_turno)
        turno_fin = turno_datetime + timedelta(minutes=duracion)
        hora_fin_str = turno_fin.strftime("%H:%M")

        # 1. CHEQUEO DE CONFLICTO con Turnos Existentes: (¡CORREGIDO!)
        # Solapamiento Simplificado: Chequea si otro turno empieza a la misma hora para ese médico.
        turno_ocupado = (
            self.db.query(Turno)
            .filter(
                Turno.Medico_Matricula == medico_matricula,
                Turno.Fecha == fecha_turno.strftime("%Y-%m-%d"),
                Turno.Estado_Id.in_([1, 2, 7]),
            )
            .all()
        )

        for turno_existente in turno_ocupado:
            try:
                exist_inicio = datetime.combine(
                    fecha_turno, datetime.strptime(turno_existente.Hora, "%H:%M").time()
                )
            except ValueError:
                print(
                    f"ALERTA: Formato de hora inconsistente en DB: {turno_existente.Hora}"
                )
                continue

            exist_duracion = (
                turno_existente.Duracion
                if turno_existente.Duracion and turno_existente.Duracion > 0
                else 30
            )
            exist_fin = exist_inicio + timedelta(minutes=exist_duracion)

            if turno_datetime < exist_fin and turno_fin > exist_inicio:
                return f"El horario solicitado esta ocupado con otro turno que comenzó a las {turno_existente.Hora} y finaliza a las {exist_fin.strftime('%H:%M')}."

        # 2. CHEQUEO DE BLOQUEO Excepcional:
        bloqueo = (
            self.db.query(AgendaExcepcional)
            .filter(
                AgendaExcepcional.Medico_Matricula == medico_matricula,
                AgendaExcepcional.Es_Disponible
                == 0,  # Marcado como NO disponible (Bloqueo)
                AgendaExcepcional.Fecha_inicio <= fecha_turno.strftime("%Y-%m-%d"),
                AgendaExcepcional.Fecha_Fin >= fecha_turno.strftime("%Y-%m-%d"),
                # Lógica de solapamiento de horas
                AgendaExcepcional.Hora_inicio <= hora_inicio_str,
                AgendaExcepcional.Hora_Fin >= hora_fin_str,
            )
            .first()
        )

        if bloqueo:
            return f"El médico tiene un bloqueo excepcional activo en el horario solicitado por: {bloqueo.Motivo}"

        # 3. VERIFICAR COBERTURA (¿El médico dijo que sí?)

        # A. Chequeo de DISPONIBILIDAD excepcional:
        disponibilidad_excepcional = (
            self.db.query(AgendaExcepcional)
            .filter(
                AgendaExcepcional.Medico_Matricula == medico_matricula,
                AgendaExcepcional.Es_Disponible == 1,  # Marcado como Disponible
                AgendaExcepcional.Fecha_inicio <= fecha_turno.strftime("%Y-%m-%d"),
                AgendaExcepcional.Fecha_Fin >= fecha_turno.strftime("%Y-%m-%d"),
                AgendaExcepcional.Hora_inicio <= hora_inicio_str,
                AgendaExcepcional.Hora_Fin >= hora_fin_str,
            )
            .first()
        )

        if disponibilidad_excepcional:
            return None  # ¡OK! Cobertura excepcional encontrada.

        # B. Chequeo de Agendas Regulares (Solo si no hay excepción activa)
        dia_semana = fecha_turno.isoweekday()

        cobertura_regular = (
            self.db.query(AgendaRegular)
            .filter(
                AgendaRegular.Medico_Matricula == medico_matricula,
                AgendaRegular.Dia_de_semana == dia_semana,
                AgendaRegular.Hora_inicio <= hora_inicio_str,
                AgendaRegular.Hora_fin >= hora_fin_str,
            )
            .first()
        )

        if cobertura_regular:
            return None  # ¡OK! Cobertura regular encontrada.

        # 4. DECISIÓN FINAL: Si no encontró NINGUNA cobertura, es un error.
        dia_semana = fecha_turno.isoweekday()

        agenda_solo_por_dia = (
            self.db.query(AgendaRegular)
            .filter(
                AgendaRegular.Medico_Matricula == medico_matricula,
                AgendaRegular.Dia_de_semana == dia_semana,
            )
            .first()
        )

        if not agenda_solo_por_dia:
            dias = {
                1: "Lunes",
                2: "Martes",
                3: "Miércoles",
                4: "Jueves",
                5: "Viernes",
                6: "Sábado",
                7: "Domingo",
            }
            nombre_dia = dias.get(dia_semana, "Día no reconocido")

            return f"El médico no tiene agenda configurada para el día {nombre_dia} ({fecha_turno.strftime('%Y-%m-%d')})."
        else:
            franja_inicio = agenda_solo_por_dia.Hora_inicio
            franja_fin = agenda_solo_por_dia.Hora_fin
            return f"El horario solicitado ({hora_inicio_str}) está fuera de la franja laboral definida para ese día. Franja: {franja_inicio} a {franja_fin}."

    def get_agendas_excepcionales_by_rango(
        self, medico_matricula: str, fecha_inicio: date, fecha_fin: date
    ) -> List[AgendaExcepcional]:
        return (
            self.db.query(AgendaExcepcional)
            .filter(
                AgendaExcepcional.Medico_Matricula == medico_matricula,
                AgendaExcepcional.Fecha_inicio <= fecha_fin.strftime("%Y-%m-%d"),
                AgendaExcepcional.Fecha_Fin >= fecha_inicio.strftime("%Y-%m-%d"),
            )
            .all()
        )

    def get_turnos_by_rango(
        self, medico_matricula: str, fecha_inicio: date, fecha_fin: date
    ) -> List[Turno]:
        return (
            self.db.query(Turno)
            .filter(
                Turno.Medico_Matricula == medico_matricula,
                Turno.Fecha >= fecha_inicio.strftime("%Y-%m-%d"),
                Turno.Fecha <= fecha_fin.strftime("%Y-%m-%d"),
                Turno.Estado_Id.in_(
                    [1, 2, 7]
                ),  # Pendiente, Confirmado, Anunciado (Ocupan lugar)
            )
            .all()
        )

    def delete_agenda_excepcional(self, agenda: AgendaExcepcional) -> None:
        self.db.delete(agenda)
        self.db.commit()

    def get_agenda_excepcional_by_pk(
        self,
        medico_matricula: str,
        especialidad_id: int,
        fecha_inicio: str,
        hora_inicio: str,
    ) -> AgendaExcepcional | None:
        return (
            self.db.query(AgendaExcepcional)
            .filter(
                AgendaExcepcional.Medico_Matricula == medico_matricula,
                AgendaExcepcional.Especialidad_Id == especialidad_id,
                AgendaExcepcional.Fecha_inicio == fecha_inicio,
                AgendaExcepcional.Hora_inicio == hora_inicio,
            )
            .first()
        )
