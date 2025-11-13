from sqlalchemy.orm import Session
from app.backend.models.cliente import Cliente
from app.backend.schemas.cliente_schema import ClienteCreate


def get_cliente(db: Session, cliente_id: int):
    return db.query(Cliente).filter(Cliente.nroPaciente == cliente_id).first()


def get_clientes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Cliente).offset(skip).limit(limit).all()


def create_cliente(db: Session, cliente: ClienteCreate):
    db_cliente = Cliente(**cliente.dict())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente
