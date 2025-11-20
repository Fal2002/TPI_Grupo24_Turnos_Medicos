from __future__ import annotations
from typing import List
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPAuthorizationCredentials

from app.backend.core.security_schema import bearer_scheme
from app.backend.core import security
from app.backend.db.db import get_db
from app.backend.models.models import User
from app.backend.services.user_repository import UserRepository

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
) -> User:

    token = credentials.credentials  

    payload = security.decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )

    user_id = payload.get("user_id")

    repo = UserRepository(db)
    user = repo.get_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )

    return user


def role_required(allowed_roles: List[str]):

    def checker(current_user: User = Depends(get_current_user)):

        if not current_user.role:
            raise HTTPException(
                status_code=500,
                detail="El usuario no tiene un rol asignado"
            )

        role_name = current_user.role.Nombre

        if role_name not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado. Se requiere un rol en {allowed_roles}"
            )

        return current_user

    return Depends(checker)