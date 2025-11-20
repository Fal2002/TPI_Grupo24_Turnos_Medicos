from app.backend.services.agenda_repository import AgendaRepository
from app.backend.services.medico_repository import MedicoRepository # Necesario para validar FK
from app.backend.schemas.agenda_excepcional import AgendaExcepcionalCreate
from app.backend.schemas.agenda_regular import AgendaRegularCreate
from app.backend.models.models import AgendaRegular, AgendaExcepcional
from app.backend.services.exceptions import RecursoNoEncontradoError, ValueError
from datetime import datetime, date, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session # Aunque el Service es independiente, la inyección del repo lo requiere


class AgendaService:
    def __init__(self, agenda_repo: AgendaRepository, medico_repo: MedicoRepository):
        #DEPENDENCIAS
        self.agenda_repo = agenda_repo
        self.medico_repo = medico_repo


    def registrar_agenda_excepcional(self, medico_matricula: str, data: AgendaExcepcionalCreate):
       
        if not self.medico_repo.obtener_medico(medico_matricula):
            raise RecursoNoEncontradoError(f"Médico con matrícula {medico_matricula} no encontrado.")

        # Validación de fechas (ej. No puede ser en el pasado)
        try:
            fecha_inicio = datetime.strptime(data.Fecha_inicio, "%Y-%m-%d").date()
            if fecha_inicio < date.today():
                 # 💡 El Service lanza una excepción de negocio
                raise ValueError("La fecha de inicio de la agenda excepcional debe ser futura o igual a hoy.")
            
            # Validación de rangos
            if data.Fecha_inicio > data.Fecha_Fin or data.Hora_inicio >= data.Hora_Fin:
                raise ValueError("El rango de tiempo/fecha es inválido (inicio debe ser anterior al fin).")

        except ValueError as e:
            # Captura errores de formato o lógica de rangos
            raise ValueError(f"Error en datos de agenda excepcional: {str(e)}")
        
        # Persistencia (Llama al Repository)
        return self.agenda_repo.create_agenda_excepcional(medico_matricula, data)


    def registrar_agenda_regular(self, medico_matricula: str, data: AgendaRegularCreate) -> AgendaRegular:
        
        # 1. Validación de Integridad (FKs)
        if not self.medico_repo.get_by_matricula(medico_matricula):
            raise RecursoNoEncontradoError(f"Médico con matrícula {medico_matricula} no encontrado.")

        # 2. Lógica de Negocio (Duración y Consistencia)
        if data.Duracion <= 0:
            raise ValueError("La duración del turno debe ser un valor positivo en minutos.")
            
        if data.Hora_inicio >= data.Hora_fin:
             raise ValueError("La hora de inicio debe ser anterior a la hora de fin.")

        # 3. Persistencia (Llama al Repository)
        # Se asume que el Repository maneja la unicidad de las claves compuestas (Matricula, Especialidad, Dia_de_semana, Hora_inicio)
        return self.agenda_repo.create_agenda_regular(medico_matricula, data)
    
# ----------------------------------------------------
    # Funciones de Consulta (Usadas por el Router de Agenda)
    # ----------------------------------------------------
    def obtener_agendas_regulares(self, medico_matricula: str) -> List[AgendaRegular]:
        # El Service solo llama al Repository para obtener datos (y podría aplicar filtrado o lógica si fuera necesario)
        return self.agenda_repo.get_agendas_regulares_by_medico(medico_matricula)
        
    # Aquí iría el resto del CRUD (Update, Delete) para ambas agendas

    def eliminar_agenda_regular(self, medico_matricula: str, especialidad_id: int, dia_de_semana: int, hora_inicio: str) -> None:
        # 1. Obtener la agenda regular específica
        agendas = self.agenda_repo.get_agendas_regulares_by_medico(medico_matricula)
        agenda_a_eliminar: Optional[AgendaRegular] = None
        
        for agenda in agendas:
            if agenda.Dia_de_semana == dia_de_semana and agenda.Hora_inicio == hora_inicio:
                agenda_a_eliminar = agenda
                break
        
        if not agenda_a_eliminar:
            raise RecursoNoEncontradoError(f"Agenda regular no encontrada para médico {medico_matricula} con especialidad {especialidad_id} en día {dia_de_semana} a las {hora_inicio}.")
        
        # 2. Llamar al Repository para eliminarla
        self.agenda_repo.delete_agenda_regular(agenda_a_eliminar)
    
    def obtener_horarios_disponibles(self, medico_matricula: str, fecha: str):
        """
        Obtiene los horarios disponibles para un médico en una fecha específica.
        Retorna lista de slots disponibles con información de especialidad, duración y sucursal.
        """
        # 1. Validar que el médico existe
        medico = self.medico_repo.get_by_matricula(medico_matricula)
        if not medico:
            raise RecursoNoEncontradoError(f"Médico con matrícula {medico_matricula} no encontrado.")
        
        # 2. Parsear fecha y obtener día de la semana
        try:
            fecha_obj = datetime.strptime(fecha, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Formato de fecha inválido. Use YYYY-MM-DD")
        
        dia_semana = fecha_obj.isoweekday()  # 1=Lunes, 7=Domingo
        
        # 3. Obtener agendas regulares del médico para ese día
        agendas_regulares = self.agenda_repo.get_agendas_regulares_by_medico(medico_matricula)
        agendas_del_dia = [a for a in agendas_regulares if a.Dia_de_semana == dia_semana]
        
        if not agendas_del_dia:
            return []  # No hay agenda configurada para ese día
        
        # 4. Generar slots de tiempo para cada agenda
        slots_disponibles = []
        
        for agenda in agendas_del_dia:
            # Parsear horas
            hora_inicio = datetime.strptime(agenda.Hora_inicio, "%H:%M").time()
            hora_fin = datetime.strptime(agenda.Hora_fin, "%H:%M").time()
            duracion = agenda.Duracion
            
            # Generar slots
            slot_actual = datetime.combine(fecha_obj, hora_inicio)
            slot_fin = datetime.combine(fecha_obj, hora_fin)
            
            while slot_actual < slot_fin:
                hora_slot = slot_actual.strftime("%H:%M")
                
                # Verificar disponibilidad (sin conflictos)
                error = self.agenda_repo.verificar_disponibilidad(
                    medico_matricula, 
                    fecha_obj, 
                    slot_actual.time(), 
                    duracion
                )
                
                # Si no hay error, el slot está disponible
                if error is None:
                    slots_disponibles.append({
                        "fecha": fecha,
                        "hora": hora_slot,
                        "medico_matricula": medico_matricula,
                        "especialidad_id": agenda.Especialidad_Id,
                        "duracion": duracion,
                        "sucursal_id": agenda.Sucursal_Id
                    })
                
                # Avanzar al siguiente slot
                slot_actual += timedelta(minutes=duracion)
        
        return slots_disponibles