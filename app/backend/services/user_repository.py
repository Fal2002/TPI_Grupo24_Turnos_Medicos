from sqlalchemy.orm import Session
from app.backend.models.models import User
from app.backend.services.exceptions import RecursoNoEncontradoError
from typing import List

class UserRepository:
    """Clase responsable de la interacción con la tabla Users."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> User | None:
        """Obtiene un usuario por su email (CRÍTICO para el login)."""
        return self.db.query(User).filter(User.Email == email).first()

    # Si necesitas un CRUD para usuarios (crear admin, etc.), lo agregarías aquí.
    # Por ahora, solo necesitamos el chequeo de email.