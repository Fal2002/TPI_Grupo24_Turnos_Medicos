from typing import Annotated, List
from fastapi import Header, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.backend.db.db import get_db
from app.backend.core import security
from app.backend.models.models import User, Role
from app.backend.services.user_repository import UserRepository

# ----------------------------------------------------
# 1. DEPENDENCIA DE AUTENTICACIÓN (Obtener Usuario Actual)
# ----------------------------------------------------


async def get_current_user(
    db: Session = Depends(get_db),
    # Obtener el token del header "Authorization" (Bearer <token>)
    authorization: Annotated[str | None, Header()] = None,
) -> User:
    """Decodifica el token JWT y devuelve el objeto User autenticado."""

    # 1. Chequeo de Token en Header
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticación faltante o inválido.",
        )

    token = authorization.split(" ")[1]  # Extrae solo el token de "Bearer <token>"

    # 2. Decodificar el Token
    payload = security.decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado.",
        )

    user_id = payload.get("user_id")

    # 3. Buscar Usuario en DB
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)  # Se asume que UserRepository tiene get_by_id

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario asociado al token no encontrado.",
        )

    return user


# ----------------------------------------------------
# 2. DEPENDENCIA DE AUTORIZACIÓN (Chequeo de Roles - RBAC)
# ----------------------------------------------------


def role_required(allowed_roles: List[str]):
    """
    Función Factory que verifica si el usuario actual tiene uno de los roles permitidos.
    """

    def role_checker(current_user: User = Depends(get_current_user)):

        # Busca el nombre del rol del usuario actual
        # Se asume que el objeto User tiene cargada la relación 'role'
        current_role_name = current_user.role.Nombre

        if current_role_name not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado. Rol '{current_role_name}' no autorizado para esta acción.",
            )
        return current_user

    return role_checker
