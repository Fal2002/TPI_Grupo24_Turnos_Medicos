from app.backend.services.agenda_repository import AgendaRepository 
from app.backend.services.medico_repository import MedicoRepository 
from app.backend.services.turno_repository import TurnoRepository
from app.backend.services.paciente_repository import PacienteRepository 
from app.backend.services.exceptions import RecursoNoEncontradoError, HorarioNoDisponibleError, TransicionInvalidaError
from app.backend.schemas.turno import TurnoCreate
from app.backend.models.models import Turno, Estado 
from app.backend.state.turno_state import EstadoTurno 
from datetime import datetime
from sqlalchemy.orm import Session
from typing import Literal, List

# Asume que esta función helper existe y es correcta
def get_estado_id(db: Session, descripcion: str) -> int:
    estado = db.query(Estado).filter(Estado.Descripcion == descripcion).first()
    if not estado:
        raise Exception(f"El estado '{descripcion}' no existe en la base de datos. Ejecute init_estados.")
    return estado.Id

class TurnoService:
    def __init__(self, turno_repo: TurnoRepository, agenda_repo: AgendaRepository, medico_repo: MedicoRepository, paciente_repo: PacienteRepository, db_session: Session):
        self.turno_repo = turno_repo
        self.agenda_repo = agenda_repo
        self.medico_repo = medico_repo
        self.paciente_repo = paciente_repo
        self.db = db_session
        self.ESTADO_PENDIENTE_ID = get_estado_id(self.db, "Pendiente")


    def registrar_turno(self, data: TurnoCreate) -> Turno:
        
        # 1. Lógica de Integridad (Verificación de FKs)
        if not self.medico_repo.get_by_matricula(data.medico_matricula):
            raise RecursoNoEncontradoError(f"Médico {data.medico_matricula} no existe.")
        
        if not self.paciente_repo.get_by_id(data.paciente_nroPaciente):
            raise RecursoNoEncontradoError(f"Paciente {data.paciente_nroPaciente} no existe.")

        # LÓGICA DE VALIDACIÓN CRÍTICA: Chequeo de PK Compuesta (Paciente no puede tener 2 turnos a la misma hora)
        pk_data = {"fecha": str(data.fecha), "hora": data.hora, "paciente_nro": data.paciente_nroPaciente}
        if self.turno_repo.get_by_pk(**pk_data):
            raise HorarioNoDisponibleError("El paciente ya tiene un turno agendado para esa misma fecha y hora.")


        # 2. Lógica de Disponibilidad (CRÍTICA)
        fecha_turno = datetime.strptime(str(data.fecha), "%Y-%m-%d").date()
        hora_turno = datetime.strptime(data.hora, "%H:%M").time()
        duracion_turno = data.duracion if data.duracion else 30 
        
        motivo_indisponible = self.agenda_repo.verificar_disponibilidad(
            data.medico_matricula, fecha_turno, hora_turno, duracion_turno
        )

        if motivo_indisponible:
            # Si el repository devuelve un string de error, lo lanzamos. ¡Esto debería funcionar ahora!
            raise HorarioNoDisponibleError(motivo_indisponible)

        # 3. Preparación y Creación
        nuevo_turno = Turno(
            **data.model_dump(by_alias=True, exclude_none=True), 
            Estado_Id=self.ESTADO_PENDIENTE_ID, 
        )
        
        # 4. Persistencia
        return self.turno_repo.create(nuevo_turno)

    # ... (El resto de la clase se mantiene igual)
    def _obtener_turno_o_404(self, pk_data: dict) -> Turno:
        turno = self.turno_repo.get_by_pk(**pk_data)
        if not turno:
            raise RecursoNoEncontradoError("Turno no encontrado con la PK dada.")
        return turno
    def obtener_turnos_por_medico(self, matricula: str) -> List[Turno]:
        return self.turno_repo.get_by_medico_matricula(matricula)
    
    def obtener_turnos_por_paciente(self, nro_paciente: int) -> List[Turno]:
        return self.turno_repo.get_by_paciente_nro(nro_paciente)
        
    def cambiar_estado(self, pk_data: dict, accion: str) -> Turno:
        turno = self._obtener_turno_o_404(pk_data)
        try:
            state_instance: EstadoTurno = turno.get_state(self.db) 
            transicion_func = getattr(state_instance, accion)
            transicion_func() 
        except AttributeError:
            raise TransicionInvalidaError(f"Transición '{accion}' no permitida para el estado actual: {turno.estado}.")
        except Exception as e:
            raise TransicionInvalidaError(str(e))
        return self.turno_repo.update(turno)

    def obtener_turnos(self) -> List[Turno]:
        return self.turno_repo.get_all()
    
    def eliminar_turno(self, pk_data: dict) -> None:
        turno = self._obtener_turno_o_404(pk_data)
        self.turno_repo.delete(turno)

    def modificar_turno(self, pk_data: dict, nuevos_datos: dict) -> Turno:
        turno = self._obtener_turno_o_404(pk_data)
        for key, value in nuevos_datos.items():
            setattr(turno, key, value)
        return self.turno_repo.update(turno)
