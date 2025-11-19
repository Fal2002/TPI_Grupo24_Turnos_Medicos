from app.backend.schemas.medico import MedicoCreate, MedicoUpdate
from app.backend.models.models import Medico
from app.backend.services.medico_repository import MedicoRepository # Inyección
from app.backend.services.exceptions import MatriculaDuplicadaError, RecursoNoEncontradoError
from typing import List

class MedicoService:
    """Contiene la lógica de negocio para la gestión de Médicos."""
    
    def __init__(self, medico_repo: MedicoRepository):
        # Inyección de Dependencia
        self.medico_repo = medico_repo
        
    def crear_medico(self, data: MedicoCreate) -> Medico:
        
        # Lógica de Negocio: Verificar Unicidad (Llama al Repository)
        existe = self.medico_repo.get_by_matricula(data.Matricula)
        if existe:
            # Lanza la excepción si la matrícula ya existe
            raise MatriculaDuplicadaError(f"La matrícula {data.Matricula} ya está registrada.")

        # Preparación del Model (Usando el Schema)
        nuevo_medico = Medico(
            Matricula=data.Matricula,
            Nombre=data.Nombre,
            Apellido=data.Apellido
        )
        
        # Persistencia (Llama al Repository)
        return self.medico_repo.create(nuevo_medico)

    def obtener_medicos(self) -> List[Medico]:
        return self.medico_repo.get_all()

    def obtener_medico(self, matricula: str) -> Medico:
        medico = self.medico_repo.get_by_matricula(matricula)
        if not medico:
            # Lanza la excepción si no lo encuentra
            raise RecursoNoEncontradoError(f"Médico con matrícula {matricula} no encontrado.")
        return medico

    def actualizar_medico(self, matricula: str, data: MedicoUpdate) -> Medico:
        medico = self.obtener_medico(matricula) # Reutilizamos la función que verifica 404
        
        # Actualización usando el Repository
        return self.medico_repo.update(medico, data)

    def eliminar_medico(self, matricula: str) -> None:
        medico = self.obtener_medico(matricula) # Reutilizamos la función que verifica 404

        # El Repository se encarga de la eliminación
        self.medico_repo.delete(medico)