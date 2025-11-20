from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.backend.models.models import Medicamento, DetalleReceta
from app.backend.schemas.medicamento import MedicamentoCreate, MedicamentoUpdate, MedicamentoOut

def _medicamento_usado(db: Session, id: int) -> bool:
    return db.query(DetalleReceta).filter(DetalleReceta.Medicamento_Id == id).first() is not None

def crear_medicamento(db: Session, data: MedicamentoCreate):
    dosis = data.dosis
    nuevo = Medicamento(
        Nombre=data.Nombre,
        Droga_Id=data.Droga_Id,
        dosis_cantidad=dosis.cantidad,
        dosis_unidad=dosis.unidad,
        dosis_frecuencia=dosis.frecuencia
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return MedicamentoOut.from_orm_obj(nuevo)

def listar_medicamentos(db: Session):
    meds = db.query(Medicamento).all()
    return [MedicamentoOut.from_orm_obj(med) for med in meds]

def obtener_medicamento(db: Session, id: int):
    med = db.query(Medicamento).filter(Medicamento.Id == id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")
    return MedicamentoOut.from_orm_obj(med)

def actualizar_medicamento(db: Session, id: int, data: MedicamentoUpdate):
    med = db.query(Medicamento).filter(Medicamento.Id == id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")

    if data.Nombre is not None:
        med.Nombre = data.Nombre
    if data.Droga_Id is not None:
        med.Droga_Id = data.Droga_Id
    if data.dosis:
        if data.dosis.cantidad is not None:
            med.dosis_cantidad = data.dosis.cantidad
        if data.dosis.unidad is not None:
            med.dosis_unidad = data.dosis.unidad
        if data.dosis.frecuencia is not None:
            med.dosis_frecuencia = data.dosis.frecuencia

    db.commit()
    db.refresh(med)
    return MedicamentoOut.from_orm_obj(med)

def eliminar_medicamento(db: Session, id: int):
    if _medicamento_usado(db, id):
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar: el medicamento está asociado a detalles de recetas."
        )
    med = db.query(Medicamento).filter(Medicamento.Id == id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")

    db.delete(med)
    db.commit()
    return {"msg": "Medicamento eliminado correctamente"}