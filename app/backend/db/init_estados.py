from app.backend.db.db import SessionLocal
from app.backend.models.models import Estado

def init_estados():
    db = SessionLocal()

    estados = [
        "Pendiente",
        "Confirmado",
        "Cancelado",
        "Atendido",
        "Finalizado",
        "Ausente",
        "Anunciado"
    ]

    for desc in estados:
        existe = db.query(Estado).filter_by(Descripcion=desc).first()
        if not existe:
            nuevo = Estado(Descripcion=desc)
            db.add(nuevo)

    db.commit()
    db.close()

    print("✔ Estados iniciales cargados correctamente.")
from app.backend.db.db import SessionLocal
from app.backend.models.models import Estado

def init_estados():
    db = SessionLocal()

    estados = [
        "Pendiente",
        "Confirmado",
        "Cancelado",
        "Atendido",
        "Finalizado",
        "Ausente",
        "Anunciado"
    ]

    for desc in estados:
        existe = db.query(Estado).filter_by(Descripcion=desc).first()
        if not existe:
            nuevo = Estado(Descripcion=desc)
            db.add(nuevo)

    db.commit()
    db.close()

    print("✔ Estados iniciales cargados correctamente.")