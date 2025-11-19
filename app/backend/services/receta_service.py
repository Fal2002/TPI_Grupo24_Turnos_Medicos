from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.backend.models.models import (
    Receta, DetalleReceta, Medicamento, Turno,
    Paciente, Medico, Especialidad, Sucursal
)
from app.backend.schemas.receta_completa import RecetaCompletaOut, MedicamentoRecetaOut
from app.backend.schemas.receta import RecetaCreate

def crear_receta(db: Session, data: RecetaCreate):
    nueva = Receta(
        Turno_Fecha=data.Turno_Fecha,
        Turno_Hora=data.Turno_Hora,
        Turno_Paciente_nroPaciente=data.Turno_Paciente_nroPaciente
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

def listar_recetas(db: Session):
    return db.query(Receta).all()

def obtener_receta(db: Session, id: int):
    receta = db.query(Receta).filter(Receta.Id == id).first()
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return receta

def eliminar_receta(db: Session, id: int):
    receta = obtener_receta(db, id)
    db.delete(receta)
    db.commit()
    return {"msg": "Receta eliminada correctamente"}

def obtener_receta_completa(db: Session, id: int):
    receta = db.query(Receta).filter(Receta.Id == id).first()
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    turno = (
        db.query(Turno)
        .filter(
            Turno.Fecha == receta.Turno_Fecha,
            Turno.Hora == receta.Turno_Hora,
            Turno.Paciente_nroPaciente == receta.Turno_Paciente_nroPaciente
        )
        .first()
    )
    if not turno:
        raise HTTPException(status_code=500, detail="Turno asociado no encontrado")

    paciente = db.query(Paciente).filter(Paciente.nroPaciente == turno.Paciente_nroPaciente).first()
    medico = db.query(Medico).filter(Medico.Matricula == turno.Medico_Matricula).first()
    especialidad = db.query(Especialidad).filter(Especialidad.Id_especialidad == turno.Especialidad_Id).first()
    sucursal = db.query(Sucursal).filter(Sucursal.Id == turno.Sucursal_Id).first()

    detalles = (
        db.query(DetalleReceta, Medicamento)
        .join(Medicamento, Medicamento.Id == DetalleReceta.Medicamento_Id)
        .filter(DetalleReceta.Receta_Id == id)
        .all()
    )

    lista_medicamentos = []
    for detalle, med in detalles:
        dosis = None
        if med.dosis_cantidad is not None or med.dosis_unidad is not None or med.dosis_frecuencia is not None:
            dosis = {
                "cantidad": med.dosis_cantidad,
                "unidad": med.dosis_unidad,
                "frecuencia": med.dosis_frecuencia
            }

        lista_medicamentos.append(
            MedicamentoRecetaOut(
                Id=med.Id,
                Nombre=med.Nombre,
                Droga_Id=med.Droga_Id,
                Dosis=dosis
            )
        )

    return RecetaCompletaOut(
        Receta_Id=receta.Id,
        Fecha=turno.Fecha,
        Hora=turno.Hora,
        Paciente={
            "Id": paciente.nroPaciente,
            "Nombre": paciente.Nombre,
            "Apellido": paciente.Apellido
        },
        Medico={
            "Matricula": medico.Matricula,
            "Nombre": medico.Nombre,
            "Apellido": medico.Apellido
        },
        Especialidad=especialidad.descripcion if especialidad else None,
        Sucursal=sucursal.Nombre if sucursal else None,
        Medicamentos=lista_medicamentos
    )