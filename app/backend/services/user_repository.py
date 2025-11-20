
from sqlalchemy.orm import Session
from app.backend.models.models import User, Role # Necesita Role para get_role_by_name
from app.backend.services.exceptions import RecursoNoEncontradoError
from typing import List, Optional

class UserRepository:
    """Clase responsable de la interacción con la tabla Users."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]: # Corregido: User | None
        """Obtiene un usuario por su email (CRÍTICO para el login)."""
        return self.db.query(User).filter(User.Email == email).first()
    
    def get_by_id(self, user_id: int) -> Optional[User]: # Corregido: User | None
        """Obtiene un usuario por su ID."""
        return self.db.query(User).filter(User.Id == user_id).first()
    
    def get_role_by_name(self, role_name: str) -> Optional[Role]:
        """Obtiene un objeto Role por su nombre."""
        return self.db.query(Role).filter(Role.Nombre == role_name).first()

    def create(self, user_data: User) -> User:
        """Persiste un nuevo objeto User en la DB (usado por MedicoService)."""
        self.db.add(user_data)
        # Usamos flush() en lugar de commit() para obtener el ID, dejando el commit final al Service
        self.db.flush()
        self.db.refresh(user_data)
        return user_data

    # Aquí se podrían agregar métodos para eliminar/actualizar usuarios.
