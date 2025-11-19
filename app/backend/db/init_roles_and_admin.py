from app.backend.db.db import SessionLocal
from app.backend.models.models import Role, User, Medico, Paciente
from app.backend.core.security import hash_password

def init_roles_and_admin():
    """
    Inicializa los roles básicos (Administrador, Médico, Paciente)
    y crea 3 usuarios de prueba: Admin, Médico y Paciente.
    """
    db = SessionLocal()
    
    # --- 1. Definir los Roles ---
    roles_list = ["Administrador", "Médico", "Paciente"]
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

    # ============================================
    # 2. Crear usuarios base
    # ============================================

    USERS = [
        {
            "email": "admin@turnos.com",
            "password": "admin123",
            "role": "Administrador"
        },
        {
            "email": "medico@turnos.com",
            "password": "medico123",
            "role": "Médico"
        },
        {
            "email": "paciente@turnos.com",
            "password": "paciente123",
            "role": "Paciente"
        }
    ]

    print("-> Creando usuarios de prueba...")
    for u in USERS:
        existing = db.query(User).filter(User.Email == u["email"]).first()
        if existing:
            print(f"✔ Usuario {u['email']} ya existe.")
            continue

        role_id = created_roles[u["role"]].Id

        new_user = User(
            Email=u["email"],
            Password_Hash=hash_password(u["password"]),
            Role_Id=role_id
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        print(f"✔ Usuario creado: {u['email']} ({u['role']})")

        # ============================================
        # 3. SI EL USUARIO ES MÉDICO → Crear registro en tabla Médicos
        # ============================================
        if u["role"] == "Médico":
            medico = Medico(
                Matricula="MED002",
                Nombre="Juan",
                Apellido="Pérez",
                User_Id=new_user.Id
            )
            db.add(medico)
            db.commit()
            print("   → Médico creado y vinculado al usuario.")

        # ============================================
        # 4. SI EL USUARIO ES PACIENTE → Crear registro en tabla Pacientes
        # ============================================
        if u["role"] == "Paciente":
            paciente = Paciente(
                Nombre="Ana",
                Apellido="Martínez",
                Telefono="3515555555",
                Email=u["email"],
                User_Id=new_user.Id
            )
            db.add(paciente)
            db.commit()
            print("   → Paciente creado y vinculado al usuario.")

    db.close()
    print("\n✔ Inicialización completa.\n")
