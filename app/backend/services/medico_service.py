<<<<<<< HEAD
from __future__ import annotations
from app.backend.schemas.medico import MedicoCreate, MedicoUpdate
from app.backend.models.models import Medico, User, Role
from app.backend.services.medico_repository import MedicoRepository
from app.backend.services.user_repository import UserRepository
from app.backend.core.security import (
    hash_password,
)  # Para hashear la contraseña temporal
from app.backend.services.exceptions import (
    MatriculaDuplicadaError,
    RecursoNoEncontradoError,
    EmailDuplicadoError,
)
from typing import List, Optional


class MedicoService:
    """Contiene la lógica de negocio para la gestión de Médicos y su vinculación con User."""

    # 💡 MODIFICACIÓN: Inyección de UserRepository
    def __init__(self, medico_repo: MedicoRepository, user_repo: UserRepository):
        self.medico_repo = medico_repo
        self.user_repo = user_repo

    def crear_medico(self, data: MedicoCreate) -> Medico:

        # 1. Verificar Matrícula Duplicada
        if self.medico_repo.get_by_matricula(data.Matricula):
            raise MatriculaDuplicadaError(
                f"La matrícula {data.Matricula} ya está registrada."
            )

        # 2. Verificar Email Duplicado (para el nuevo User)
        if self.user_repo.get_by_email(data.email_login):
            raise EmailDuplicadoError(
                f"El email {data.email_login} ya está registrado como usuario."
            )

        # --- CREACIÓN DEL USER ---
        role_medico = self.user_repo.get_role_by_name("Médico")
        if not role_medico:
            raise RecursoNoEncontradoError(
                "El rol 'Médico' no está configurado en la base de datos."
            )

        role_id = role_medico.Id
        hashed_password = hash_password(data.password_temporal)

        nuevo_user = User(
            Email=data.email_login, Password_Hash=hashed_password, Role_Id=role_id
        )

        # Persistencia del User (obtiene el ID)
        nuevo_user = self.user_repo.create(nuevo_user)
        user_id = nuevo_user.Id

        # --- CREACIÓN DEL MÉDICO CON VINCULACIÓN (Paso 2) ---
        nuevo_medico = Medico(
            Matricula=data.Matricula,
            Nombre=data.Nombre,
            Apellido=data.Apellido,
            User_Id=user_id,  # 💡 VINCULACIÓN CLAVE
        )

        # Persistencia del Medico (el repo hace el commit final)
        return self.medico_repo.create(nuevo_medico, data.especialidades)

    def obtener_medicos(
        self,
        matricula: Optional[str],
        nombre: Optional[str],
        especialidad: Optional[int],
    ) -> List[Medico]:
        return self.medico_repo.get_filtered(matricula, nombre, especialidad)

    def obtener_medico(self, matricula: str) -> Medico:
        medico = self.medico_repo.get_by_matricula(matricula)
        if not medico:

            raise RecursoNoEncontradoError(
                f"Médico con matrícula {matricula} no encontrado."
            )
        return medico
    def obtener_medico_por_user_id(self, user_id: int) -> Medico:
        medico = self.medico_repo.get_by_user_id(user_id)
        if not medico:
            raise RecursoNoEncontradoError(
                f"Médico con User_Id {user_id} no encontrado."
            )
        return medico

    def actualizar_medico(self, matricula: str, data: MedicoUpdate) -> Medico:
        medico = self.obtener_medico(matricula)
        return self.medico_repo.update(medico, data)

    def eliminar_medico(self, matricula: str) -> None:
        medico = self.obtener_medico(matricula)

        # Opcional: Eliminar también el registro de User
        # self.user_repo.delete_by_id(medico.User_Id)

        return self.medico_repo.delete(medico)
=======
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Medico, MedicoEspecialidad
from app.backend.schemas.medico import MedicoCreate

def get_medicos(db: Session):
    return db.query(Medico).all()


def get_medico_by_id(db: Session, matricula: str):
    med = db.query(Medico).filter(Medico.Matricula == matricula).first()
    if not med:
        raise HTTPException(404, "Médico no encontrado")
    return med


def create_medico(db: Session, data: MedicoCreate):
    especialidades = data.especialidades
    medico_data = data.dict(exclude={"especialidades"})

    nuevo = Medico(**medico_data)
    db.add(nuevo)
    db.commit()

    # Relación muchos a muchos
    for esp in especialidades:
        rel = MedicoEspecialidad(Medico_Matricula=nuevo.Matricula, Especialidad_Id=esp)
        db.add(rel)

    db.commit()
    db.refresh(nuevo)
    return nuevo


def delete_medico(db: Session, matricula: str):
    med = get_medico_by_id(db, matricula)
    db.delete(med)
    db.commit()
    return {"detail": "Médico eliminado"}
>>>>>>> cambios-en-backend
