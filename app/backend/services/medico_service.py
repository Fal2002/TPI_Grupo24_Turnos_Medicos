from sqlalchemy.orm import Session
from app.backend.models.models import Medico
from app.backend.schemas.medico import MedicoCreate, MedicoUpdate

def crear_medico(db: Session, data: MedicoCreate):
    existe = db.query(Medico).filter(Medico.Matricula == data.Matricula).first()
    if existe:
        return None

    medico = Medico(
        Matricula=data.Matricula,
        Nombre=data.Nombre,
        Apellido=data.Apellido
    )
    db.add(medico)
    db.commit()
    db.refresh(medico)
    return medico


def obtener_medicos(db: Session):
    return db.query(Medico).all()


def obtener_medico(db: Session, matricula: str):
    return db.query(Medico).filter(Medico.Matricula == matricula).first()


def actualizar_medico(db: Session, matricula: str, data: MedicoUpdate):
    medico = obtener_medico(db, matricula)
    if not medico:
        return None

    if data.Nombre is not None:
        medico.Nombre = data.Nombre
    if data.Apellido is not None:
        medico.Apellido = data.Apellido

    db.commit()
    db.refresh(medico)
    return medico


def eliminar_medico(db: Session, matricula: str):
    medico = obtener_medico(db, matricula)
    if not medico:
        return False

    db.delete(medico)
    db.commit()
    return True
