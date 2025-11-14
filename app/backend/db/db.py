from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Ruta absoluta hacia el archivo .db
BASE_DIR = os.path.dirname(os.path.abspath(__file__))   # ruta de /app/backend/db
DB_PATH = os.path.join(BASE_DIR, "turnos_medicos.db")   # /app/backend/db/turnos_medicos.db

# URL de conexión para SQLite
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Crear engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # necesario para SQLite + FastAPI
)

# Crear SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos ORM
Base = declarative_base()


# Dependencia para usar en los routers
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
