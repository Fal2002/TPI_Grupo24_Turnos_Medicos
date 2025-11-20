from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.auth import LoginRequest, TokenResponse
from app.backend.services.auth_service import AuthService, CredencialesInvalidasError
from app.backend.services.user_repository import UserRepository

router = APIRouter(tags=["Autenticacion"])


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """Instancia y provee el AuthService con sus dependencias."""
    user_repo = UserRepository(db)
    return AuthService(user_repo)



@router.post("/login", response_model=TokenResponse)
def login_for_access_token(
    payload: LoginRequest,
    service: AuthService = Depends(get_auth_service)
):
    
    try:
        # Llama a la lógica del Service
        token = service.authenticate_user(payload)
        return token
        
    except CredencialesInvalidasError as e:
        # Si el Service lanza la excepción, el Router la traduce a 401 Unauthorized
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )