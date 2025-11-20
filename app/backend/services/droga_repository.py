from sqlalchemy.orm import Session
from app.backend.models.models import Droga
from typing import List, Optional

class DrogaRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Droga]:
        return self.db.query(Droga).all()

    def get_by_id(self, id: int) -> Optional[Droga]:
        return self.db.query(Droga).filter(Droga.Id == id).first()

    def create(self, droga: Droga) -> Droga:
        self.db.add(droga)
        self.db.commit()
        self.db.refresh(droga)
        return droga

    def delete(self, droga: Droga) -> None:
        self.db.delete(droga)
        self.db.commit()
