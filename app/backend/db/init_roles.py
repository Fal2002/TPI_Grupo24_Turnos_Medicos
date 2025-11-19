# app/backend/db/init_roles_and_admin.py

from app.backend.db.db import SessionLocal
from app.backend.models.models import Role, User
from app.backend.core.security import hash_password


def init_roles():
    """
    Inicializa los roles básicos del sistema (Administrador, Médico, Paciente)
    y crea un usuario Administrador por defecto.
    """
    db = SessionLocal()

    # --- 1. Definir los Roles ---
    roles_list = ["Administrador", "Médico", "Paciente"]

    # Diccionario para guardar el objeto Role creado y obtener su ID
    created_roles = {}

    print("-> Inicializando Roles...")
    for role_name in roles_list:
        role = db.query(Role).filter(Role.Nombre == role_name).first()
        if not role:
            role = Role(Nombre=role_name)
            db.add(role)
            db.commit()
            db.refresh(role)
        created_roles[role_name] = role

    # --- 2. Crear Usuario Administrador ---

    ADMIN_EMAIL = "admin@turnos.com"
    ADMIN_PASSWORD = "admin_password"  # ¡CAMBIAR EN PRODUCCIÓN!

    admin_user = db.query(User).filter(User.Email == ADMIN_EMAIL).first()

    if not admin_user and "Administrador" in created_roles:
        print(f"-> Creando usuario administrador: {ADMIN_EMAIL}")

        # Obtener el ID del rol Administrador
        admin_role_id = created_roles["Administrador"].Id

        # Hashear la contraseña usando la función de seguridad
        print("Password to hash:", ADMIN_PASSWORD)
        hashed_pwd = hash_password(ADMIN_PASSWORD)

        new_admin = User(
            Email=ADMIN_EMAIL, Password_Hash=hashed_pwd, Role_Id=admin_role_id
        )
        db.add(new_admin)
        db.commit()
        print("✔ Usuario Admin creado correctamente.")
    else:
        print("✔ Usuario Admin ya existe o el Rol Administrador no fue creado.")

    db.close()
