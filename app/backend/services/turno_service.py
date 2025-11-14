from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from app.backend.models.models import Turno, Estado
from app.backend.schemas.turno import TurnoCreate


# ======================================================
# Crear turno
# ======================================================
def crear_turno(db: Session, data: TurnoCreate):

    estado_pendiente = (
        db.query(Estado)
        .filter(Estado.Descripcion == "Pendiente")
        .first()
    )

    if not estado_pendiente:
        raise HTTPException(500, "El estado inicial 'Pendiente' no existe. Ejecutá init_estados().")

    nuevo_turno = Turno(
        Fecha=str(data.fecha),                 # Siempre texto en SQLite
        Hora=data.hora,                        # Ya es string en el schema
        Paciente_nroPaciente=data.paciente_nroPaciente,
        Medico_Matricula=data.medico_matricula,
        Especialidad_Id=data.especialidad_id,
        Sucursal_Id=data.sucursal_id,
        Duracion=data.duracion,
        Motivo=data.motivo,
        Estado_Id=estado_pendiente.Id
    )

    db.add(nuevo_turno)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            400,
            "El paciente ya tiene un turno en esa fecha y hora."
        )
   
    db.refresh(nuevo_turno)

    return nuevo_turno


# ======================================================
# Listar turnos
# ======================================================
def listar_turnos(db: Session):
    return db.query(Turno).all()


# ======================================================
# Cambiar estado usando State Pattern
# ======================================================
def ejecutar_accion(db: Session, fecha: str, hora: str, paciente_id: int, accion: str):

    turno = (
        db.query(Turno)
        .filter(
            Turno.Fecha == fecha,
            Turno.Hora == hora,
            Turno.Paciente_nroPaciente == paciente_id
        )
        .first()
    )

    if not turno:
        raise HTTPException(404, "Turno no encontrado")

    state = turno.get_state(db)

    acciones = {
        "confirmar": state.confirmar,
        "cancelar": state.cancelar,
        "reprogramar": state.reprogramar,
        "atender": state.atender,
        "finalizar": state.finalizar,
        "anunciar": state.anunciar,
        "marcarAusente": state.marcarAusente
    }

    if accion not in acciones:
        raise HTTPException(400, f"Acción inválida: {accion}")

    acciones[accion]()

    db.commit()
    db.refresh(turno)

    return turno
