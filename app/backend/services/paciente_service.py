from sqlalchemy.orm import Session
from app.backend.models.models import Paciente
from app.backend.schemas.paciente import PacienteCreate, PacienteUpdate

def crear_paciente(db: Session, data: PacienteCreate):
    # Verificar si ya existe mail
    existe = db.query(Paciente).filter(Paciente.Email == data.Email).first()
    if existe:
        return None

    paciente = Paciente(
        Nombre=data.Nombre,
        Apellido=data.Apellido,
        Telefono=data.Telefono,
        Email=data.Email
    )
    db.add(paciente)
    db.commit()
    db.refresh(paciente)
    return paciente


def obtener_pacientes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Paciente).offset(skip).limit(limit).all()


def obtener_paciente(db: Session, nro: int):
    return db.query(Paciente).filter(Paciente.nroPaciente == nro).first()


def actualizar_paciente(db: Session, nro: int, data: PacienteUpdate):
    paciente = obtener_paciente(db, nro)
    if not paciente:
        return None

    if data.Nombre is not None:
        paciente.Nombre = data.Nombre
    if data.Apellido is not None:
        paciente.Apellido = data.Apellido
    if data.Telefono is not None:
        paciente.Telefono = data.Telefono
    if data.Email is not None:
        paciente.Email = data.Email

    db.commit()
    db.refresh(paciente)
    return paciente


def eliminar_paciente(db: Session, nro: int):
    paciente = obtener_paciente(db, nro)
    if not paciente:
        return False

    db.delete(paciente)
    db.commit()
    return True
