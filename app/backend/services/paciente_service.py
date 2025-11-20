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
