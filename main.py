from fastapi import FastAPI
from app.backend.api.routes import router as api_router
from app.backend.db.db import Base, engine

# ⭐ Crear tablas si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Turnero Médico API")

app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {"msg": "API funcionando correctamente"}
