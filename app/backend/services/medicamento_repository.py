from sqlalchemy.orm import Session
from app.backend.models.models import Medicamento
from typing import List, Optional

class MedicamentoRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Medicamento]:
        return self.db.query(Medicamento).all()

    def get_by_id(self, id: int) -> Optional[Medicamento]:
        return self.db.query(Medicamento).filter(Medicamento.Id == id).first()

    def create(self, medicamento: Medicamento) -> Medicamento:
        self.db.add(medicamento)
        self.db.commit()
        self.db.refresh(medicamento)
        return medicamento

    def delete(self, medicamento: Medicamento) -> None:
        self.db.delete(medicamento)
        self.db.commit()
