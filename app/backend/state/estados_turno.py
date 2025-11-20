from sqlalchemy.orm import Session
from fastapi import HTTPException

class EstadoTurno:
    def __init__(self, turno, db: Session):
        self.turno = turno
        self.db = db

    def set_estado(self, descripcion: str):
        # Import acá adentro → evita circular import
        from app.backend.models.models import Estado

        estado = (
            self.db.query(Estado)
            .filter(Estado.Descripcion == descripcion)
            .first()
        )

        if not estado:
            raise HTTPException(500, f"Estado '{descripcion}' no existe en la BD.")

        self.turno.Estado_Id = estado.Id

    # Métodos por defecto (sobrescribir en cada State)
    def confirmar(self): raise HTTPException(400, "Acción no permitida")
    def cancelar(self): raise HTTPException(400, "Acción no permitida")
    def reprogramar(self): raise HTTPException(400, "Acción no permitida")
    def atender(self): raise HTTPException(400, "Acción no permitida")
    def finalizar(self): raise HTTPException(400, "Acción no permitida")
    def anunciar(self): raise HTTPException(400, "Acción no permitida")
    def marcarAusente(self): raise HTTPException(400, "Acción no permitida")