# app/backend/core/dependencies.py

from __future__ import annotations
from typing import List, Optional
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from fastapi.security import HTTPAuthorizationCredentials

from app.backend.core.security_schema import bearer_scheme
from app.backend.core import security
from app.backend.db.db import get_db
from app.backend.models.models import User
from app.backend.services.user_repository import UserRepository


# ============================================
# 1. Obtener usuario actual desde el token JWT
# ============================================
async def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:

    # 1. Intentar obtener token de la cookie
    token = request.cookies.get("access_token")

    # 2. Si no hay cookie, intentar Header (para Postman/Swagger)
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado"
        )

    payload = security.decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado"
        )

    user_id = payload.get("user_id")

    repo = UserRepository(db)
    user = repo.get_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado"
        )

    return user


# ============================================
# 2. AUTORIZACIÓN POR ROL (RBAC)
# ============================================
def role_required(allowed_roles: List[str]):

    def checker(current_user: User = Depends(get_current_user)):

        if not current_user.role:
            raise HTTPException(
                status_code=500, detail="El usuario no tiene un rol asignado"
            )

        role_name = current_user.role.Nombre

        if role_name not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado. Se requiere un rol en {allowed_roles}",
            )

        return current_user

    return checker
