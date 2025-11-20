from sqlalchemy.orm import Session
from app.backend.services.user_repository import UserRepository
from app.backend.schemas.auth import LoginRequest, TokenResponse
from app.backend.core import security
from app.backend.services.exceptions import HorarioNoDisponibleError, RecursoNoEncontradoError
from app.backend.services.exceptions import TransicionInvalidaError, EmailYaRegistradoError

# Creamos una excepción específica para credenciales inválidas si no la tienes
class CredencialesInvalidasError(Exception):
    pass


class AuthService:
    """Contiene la lógica de negocio para la autenticación de usuarios."""

    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def authenticate_user(self, credentials: LoginRequest) -> TokenResponse:
        
        # 1. Buscar usuario por email (llama al Repository)
        user = self.user_repo.get_by_email(credentials.email)

        if not user:
            # Si el email no se encuentra, lanzamos una excepción de credenciales inválidas.
            raise CredencialesInvalidasError("Email o contraseña inválidos.")

        # 2. Verificar la contraseña (llama a las utilidades de security)
        if not security.verify_password(credentials.password, user.Password_Hash):
            # Si la contraseña no coincide, lanzamos una excepción.
            raise CredencialesInvalidasError("Email o contraseña inválidos.")

        # 3. Generar el Token (llama a las utilidades de security)
        
        # Los datos que van dentro del token (claims)
        token_data = {
            "user_id": user.Id,
            "email": user.Email,
            "role_id": user.Role_Id # CRÍTICO para la autorización (RBAC)
        }
        
        access_token = security.create_access_token(token_data)
        
        return TokenResponse(access_token=access_token, token_type="bearer")