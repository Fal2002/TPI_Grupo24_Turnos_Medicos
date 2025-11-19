from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.backend.models.models import Medicamento, DetalleReceta
from app.backend.schemas.medicamento import (
    MedicamentoCreate,
    MedicamentoUpdate
)

def _medicamento_usado(db: Session, id: int) -> bool:
    return (
        db.query(DetalleReceta)
        .filter(DetalleReceta.Medicamento_Id == id)
        .first()
        is not None
    )

def crear_medicamento(db: Session, data: MedicamentoCreate):
    nuevo = Medicamento(
        Nombre=data.Nombre,
        Droga_Id=data.Droga_Id,
        dosis_cantidad=data.dosis.cantidad,
        dosis_unidad=data.dosis.unidad,
        dosis_frecuencia=data.dosis.frecuencia
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def listar_medicamentos(db: Session):
    return db.query(Medicamento).all()

def obtener_medicamento(db: Session, id: int):
    med = db.query(Medicamento).filter(Medicamento.Id == id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")
    return med

def actualizar_medicamento(db: Session, id: int, data: MedicamentoUpdate):
    med = obtener_medicamento(db, id)

    if data.Nombre is not None:
        med.Nombre = data.Nombre

    if data.Droga_Id is not None:
        med.Droga_Id = data.Droga_Id

    if data.dosis is not None:
        # actualizar solo las partes que vienen
        if data.dosis.cantidad is not None:
            med.dosis_cantidad = data.dosis.cantidad
        if data.dosis.unidad is not None:
            med.dosis_unidad = data.dosis.unidad
        if data.dosis.frecuencia is not None:
            med.dosis_frecuencia = data.dosis.frecuencia

    db.commit()
    db.refresh(med)
    return med

def eliminar_medicamento(db: Session, id: int):
    if _medicamento_usado(db, id):
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar: el medicamento está asociado a detalles de recetas."
        )

    med = obtener_medicamento(db, id)
    db.delete(med)
    db.commit()
    return {"msg": "Medicamento eliminado correctamente"}