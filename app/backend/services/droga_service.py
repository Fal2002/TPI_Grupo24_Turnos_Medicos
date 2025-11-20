from app.backend.services.droga_repository import DrogaRepository
from app.backend.models.models import Droga
from app.backend.schemas.droga import DrogaCreate
<<<<<<< HEAD
from app.backend.services.exceptions import RecursoNoEncontradoError
from sqlalchemy.orm import Session
from typing import List


class DrogaService:
    def __init__(self, droga_repo: DrogaRepository, db_session: Session):
        self.droga_repo = droga_repo
        self.db = db_session

    def crear_droga(self, data: DrogaCreate) -> Droga:
        nueva_droga = Droga(**data.model_dump(by_alias=True))
        return self.droga_repo.create(nueva_droga)

    def obtener_drogas(self) -> List[Droga]:
        return self.droga_repo.get_all()

    def obtener_droga_por_id(self, id: int) -> Droga:
        droga = self.droga_repo.get_by_id(id)
        if not droga:
            raise RecursoNoEncontradoError(f"Droga {id} no encontrada.")
        return droga

    def eliminar_droga(self, id: int) -> None:
        droga = self.obtener_droga_por_id(id)
        self.droga_repo.delete(droga)
=======

def get_drogas(db: Session):
    return db.query(Droga).all()


def get_droga_by_id(db: Session, id: int):
    d = db.query(Droga).filter(Droga.Id == id).first()
    if not d:
        raise HTTPException(404, "Droga no encontrada")
    return d


def create_droga(db: Session, data: DrogaCreate):
    nueva = Droga(**data.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva
>>>>>>> cambios-en-backend
