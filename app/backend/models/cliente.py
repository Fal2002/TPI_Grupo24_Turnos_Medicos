from sqlalchemy import Column, Integer, String
from app.backend.db.db import Base


class Cliente(Base):
    __tablename__ = "Pacientes"

    nroPaciente = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Nombre = Column(String, nullable=False)
    Apellido = Column(String, nullable=False)
    Telefono = Column(String)
    Email = Column(String, unique=True, index=True)
