from app.backend.schemas.paciente import (
    PacienteCreate,
    PacienteUpdate,
)  # Asumimos estos schemas
from app.backend.models.models import Paciente
from app.backend.services.paciente_repository import PacienteRepository
from app.backend.services.exceptions import (
    RecursoNoEncontradoError,
    EmailYaRegistradoError,
)
from typing import List, Optional
from datetime import datetime


class PacienteService:
    """Contiene la lógica de negocio para la gestión de Pacientes."""

    def __init__(self, paciente_repo: PacienteRepository):
        # 💡 Inyección de Dependencia
        self.paciente_repo = paciente_repo

    def crear_paciente(self, data: PacienteCreate) -> Paciente:

        # Lógica de Negocio: Verificar Unicidad del Email
        if data.Email and self.paciente_repo.get_by_email(data.Email):
            # Lanza la excepción si el email ya existe
            raise EmailYaRegistradoError(
                f"El email '{data.Email}' ya está en uso por otro paciente."
            )

        # Modelado del Paciente
        nuevo_paciente = Paciente(
            Nombre=data.Nombre,
            Apellido=data.Apellido,
            Telefono=data.Telefono,
            Email=data.Email,
            # Los campos del DER deben coincidir con los atributos del Model
        )

        # Persistencia (Llama al Repository)
        return self.paciente_repo.create(nuevo_paciente)

    def obtener_pacientes(
        self, numero: Optional[str] = None, nombre: Optional[str] = None
    ) -> List[Paciente]:
        return self.paciente_repo.get_by_filters(numero=numero, nombre=nombre)

    def obtener_paciente(self, nro_paciente: int) -> Paciente:
        paciente = self.paciente_repo.get_by_id(nro_paciente)
        if not paciente:
            # Lanza la excepción si no lo encuentra
            raise RecursoNoEncontradoError(
                f"Paciente con nro {nro_paciente} no encontrado."
            )
        return paciente
    
    def obtener_paciente_por_medico(self, medico_matricula: str, especialidad_id: Optional[int] = None) -> List[Paciente]:
        pacientes = self.paciente_repo.get_by_medico(medico_matricula, especialidad_id)
        if not pacientes:
            # Lanza la excepción si no lo encuentra
            raise RecursoNoEncontradoError(
                f"No se encontraron pacientes para el médico con Matrícula {medico_matricula}."
            )
        
        hoy = datetime.now().date()
        ahora = datetime.now().time()

        for p in pacientes:
            # Filtrar turnos de este médico y especialidad
            turnos_medico = [
                t for t in p.turnos 
                if t.Medico_Matricula == medico_matricula and (especialidad_id is None or t.Especialidad_Id == especialidad_id)
            ]
            
            # Helper para convertir fecha/hora string a objetos comparables
            def parse_turno_datetime(t):
                try:
                    fecha = datetime.strptime(t.Fecha, "%Y-%m-%d").date()
                    hora = datetime.strptime(t.Hora, "%H:%M").time()
                    return fecha, hora
                except ValueError:
                    return None, None

            # Calcular Ultima Visita (Pasada)
            visitas_pasadas = []
            visitas_futuras = []

            for t in turnos_medico:
                t_fecha, t_hora = parse_turno_datetime(t)
                if not t_fecha or not t_hora:
                    continue
                
                if t_fecha < hoy or (t_fecha == hoy and t_hora < ahora):
                    visitas_pasadas.append(t)
                else:
                    visitas_futuras.append(t)

            # Ordenar Pasadas: Descendente (la más reciente primero)
            visitas_pasadas.sort(key=lambda x: (x.Fecha, x.Hora), reverse=True)
            p.UltimaVisita = visitas_pasadas[0].Fecha if visitas_pasadas else None

            # Ordenar Futuras: Ascendente (la más próxima primero)
            visitas_futuras.sort(key=lambda x: (x.Fecha, x.Hora))
            p.ProximoTurno = visitas_futuras[0].Fecha if visitas_futuras else None

        return pacientes

    def obtener_paciente_por_usuario(self, user_id: int) -> Paciente:
        paciente = self.paciente_repo.get_by_user_id(user_id)
        if not paciente:
            raise RecursoNoEncontradoError(
                f"Paciente asociado al usuario {user_id} no encontrado."
            )
        return paciente

    def actualizar_paciente(self, nro_paciente: int, data: PacienteUpdate) -> Paciente:
        paciente = self.paciente_repo.get_by_id(nro_paciente)
        if not paciente:
            raise RecursoNoEncontradoError(
                f"Paciente con nro {nro_paciente} no encontrado."
            )

        # Lógica de Negocio: Verificar Unicidad del Email si se está actualizando
        if data.Email and data.Email != paciente.Email:
            if self.paciente_repo.get_by_email(data.Email):
                raise EmailYaRegistradoError(
                    f"El email '{data.Email}' ya está en uso por otro paciente."
                )

        # Actualizar los campos del paciente
        for field, value in data.dict(exclude_unset=True).items():
            setattr(paciente, field, value)

        # Persistir los cambios
        self.paciente_repo.db.commit()
        self.paciente_repo.db.refresh(paciente)

        return paciente

    def eliminar_paciente(self, nro_paciente: int) -> bool:
        paciente = self.paciente_repo.get_by_id(nro_paciente)
        if not paciente:
            return False  # O lanzar excepción si se prefiere

        self.paciente_repo.db.delete(paciente)
        self.paciente_repo.db.commit()
        return True
