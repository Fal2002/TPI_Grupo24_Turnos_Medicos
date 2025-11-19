from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.backend.api.routes import router as api_router
from app.backend.db.db import Base, engine
from app.backend.db.init_estados import init_estados
from app.backend.db.init_roles import init_roles

# ⭐ Crear tablas si no existen
Base.metadata.create_all(bind=engine)


# ⭐ Nuevo sistema de Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Se ejecuta AL INICIAR FastAPI
    print("▶ Cargando estados en la base de datos...")
    init_estados()
    init_roles()
    print("✔ Estados y roles inicializados correctamente.")

    yield   # ← punto donde la app ya está levantada

    # Se ejecuta AL APAGAR FastAPI (opcional)
    print("▶ Finalizando Turnero Médico API...")


# ⭐ Declaración correcta del objeto FastAPI usando lifespan
app = FastAPI(
    title="Turnero Médico API",
    lifespan=lifespan
)


# ⭐ Incluir routers
app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {"msg": "API funcionando correctamente"}
