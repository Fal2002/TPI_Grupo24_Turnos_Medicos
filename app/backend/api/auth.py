# Importa Response y Cookie
from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.schemas.auth import LoginRequest, TokenResponse
from app.backend.services.auth_service import AuthService, CredencialesInvalidasError
from app.backend.services.user_repository import UserRepository

router = APIRouter(tags=["Autenticacion"])

# 💡 Función de Inyección de Dependencia para AuthService
def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """Instancia y provee el AuthService con sus dependencias."""
    user_repo = UserRepository(db)
    return AuthService(user_repo)


# ----------------------------------------------------
# Endpoint: POST /login (Inicio de Sesión con Cookies)
# ----------------------------------------------------
# Eliminamos response_model porque el token ya no va en el cuerpo
@router.post("/login")
def login_for_access_token(
    response: Response, # <--- 1. Inyectamos el objeto Response
    payload: LoginRequest,
    service: AuthService = Depends(get_auth_service)
):
    """
    Autentica al usuario y establece el token JWT en una cookie HttpOnly.
    """
    try:
        # Llama a la lógica del Service para obtener el token
        token_data = service.authenticate_user(payload)
        
        # 2. Establecemos el token en una cookie segura
        response.set_cookie(
            key="access_token",
            value=token_data.access_token,
            httponly=True,  # Impide que JavaScript acceda a la cookie
            secure=True,    # Solo enviar con HTTPS
            samesite="lax"  # O "strict" para mayor seguridad contra CSRF
        )
        
        # Retornamos un mensaje de éxito, el token ya está en la cookie
        return {"status": "success", "message": "Login successful"}
        
    except CredencialesInvalidasError as e:
        # Si el Service lanza la excepción, el Router la traduce a 401 Unauthorized
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    
@router.post("/logout")
async def logout_user():
    """
    Endpoint para cerrar sesión del usuario.
    Elimina la cookie del token de acceso.
    """
    response = JSONResponse(content={"message": "Logout exitoso"})
    response.delete_cookie("access_token")
    return response