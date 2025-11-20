# app/backend/db/limpiar_db.py

from app.backend.db.db import SessionLocal
from app.backend.models.models import User, Role
from sqlalchemy.orm import Session
from sqlalchemy import text # Necesario para comandos de control de DB

def borrar_usuarios_y_roles():
    db: Session = SessionLocal()
    
    try:
        # --- 1. Borrar Usuarios ---
        # Borrar primero los usuarios para evitar problemas de FK con la tabla Roles
        print("Borrando todos los usuarios...")
        db.query(User).delete()
        
        # --- 2. Borrar Roles ---
        print("Borrando todos los roles...")
        db.query(Role).delete()
        
        # --- 3. Confirmar y Restablecer IDs (Opcional, pero limpio) ---
        db.commit()
        
        # Comando para reiniciar la secuencia de IDs para SQLite
        # Nota: Puede variar según la versión de SQLite y la configuración de SQLAlchemy
        # db.execute(text("DELETE FROM sqlite_sequence WHERE name='Users'"))
        # db.execute(text("DELETE FROM sqlite_sequence WHERE name='Roles'"))
        # db.commit()
        
        print("✔ Limpieza de tablas Users y Roles completada.")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error durante la limpieza: {e}")
        
    finally:
        db.close()

if __name__ == "__main__":
    borrar_usuarios_y_roles()