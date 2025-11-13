from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.backend.db.db import get_db
from app.backend.schemas.cliente_schema import ClienteSchema, ClienteCreate
from app.backend.services import cliente_service

clientes_bp = APIRouter()


@clientes_bp.post("/", response_model=ClienteSchema)
def create_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    return cliente_service.create_cliente(db=db, cliente=cliente)


@clientes_bp.get("/", response_model=List[ClienteSchema])
def read_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clientes = cliente_service.get_clientes(db, skip=skip, limit=limit)
    return clientes


@clientes_bp.get("/{cliente_id}", response_model=ClienteSchema)
def read_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = cliente_service.get_cliente(db, cliente_id=cliente_id)
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente not found")
    return db_cliente
