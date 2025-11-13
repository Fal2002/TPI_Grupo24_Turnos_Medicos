from fastapi import APIRouter
from .clientes import clientes_bp

api = APIRouter()

api.include_router(clientes_bp, prefix="/clientes", tags=["clientes"])
