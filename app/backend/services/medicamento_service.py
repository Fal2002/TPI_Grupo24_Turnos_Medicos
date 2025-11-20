from app.backend.services.medicamento_repository import MedicamentoRepository
from app.backend.models.models import Medicamento
from app.backend.schemas.medicamento import MedicamentoCreate
from app.backend.services.exceptions import RecursoNoEncontradoError
from sqlalchemy.orm import Session
<<<<<<< HEAD
from typing import List


class MedicamentoService:
    def __init__(self, medicamento_repo: MedicamentoRepository, db_session: Session):
        self.medicamento_repo = medicamento_repo
        self.db = db_session

    def crear_medicamento(self, data: MedicamentoCreate) -> Medicamento:
        nuevo_medicamento = Medicamento(**data.model_dump(by_alias=True))
        return self.medicamento_repo.create(nuevo_medicamento)

    def obtener_medicamentos(self) -> List[Medicamento]:
        return self.medicamento_repo.get_all()

    def obtener_medicamento_por_id(self, id: int) -> Medicamento:
        medicamento = self.medicamento_repo.get_by_id(id)
        if not medicamento:
            raise RecursoNoEncontradoError(f"Medicamento {id} no encontrado.")
        return medicamento

    def eliminar_medicamento(self, id: int) -> None:
        medicamento = self.obtener_medicamento_por_id(id)
        self.medicamento_repo.delete(medicamento)
=======
from fastapi import HTTPException
from app.backend.models.models import Medicamento
from app.backend.schemas.medicamento import MedicamentoCreate

def get_medicamentos(db: Session):
    return db.query(Medicamento).all()

def get_medicamento_by_id(db: Session, id: int):
    med = db.query(Medicamento).filter(Medicamento.Id == id).first()
    if not med:
        raise HTTPException(404, "Medicamento no encontrado")
    return med

def create_medicamento(db: Session, data: MedicamentoCreate):
    nuevo = Medicamento(**data.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo
>>>>>>> cambios-en-backend
