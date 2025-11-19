from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

# Importamos los modelos
from app.backend.models.models import Medico, Especialidad, MedicoEspecialidad
from app.backend.schemas.medico import MedicoCreate, MedicoUpdate


def crear_medico(db: Session, data: MedicoCreate):
    # 1. Verificar si ya existe
    existe = db.query(Medico).filter(Medico.Matricula == data.Matricula).first()
    if existe:
        return None

    # 2. Crear instancia de Médico
    medico = Medico(
        Matricula=data.Matricula, Nombre=data.Nombre, Apellido=data.Apellido
    )
    db.add(medico)

    # 3. Guardar relaciones (Especialidades)
    # Es importante hacer esto antes del commit para que sea transaccional
    if data.especialidades:
        for esp_id in data.especialidades:
            # Verificamos que la especialidad exista para evitar errores de FK
            # (Opcional, pero recomendado si no confías en el input)
            especialidad_db = (
                db.query(Especialidad)
                .filter(Especialidad.Id_especialidad == esp_id)
                .first()
            )

            if especialidad_db:
                nueva_relacion = MedicoEspecialidad(
                    Medico_Matricula=data.Matricula, Especialidad_Id=esp_id
                )
                db.add(nueva_relacion)

    db.commit()
    db.refresh(medico)
    return medico


def obtener_medicos(
    db: Session,
    matricula: Optional[str] = None,
    nombre: Optional[str] = None,
    especialidad: Optional[str] = None,
):
    # Iniciamos la consulta
    query = db.query(Medico)

    # 1. Filtro por Especialidad (Requiere JOINs explícitos para filtrar)
    if especialidad:
        # Unimos tablas para filtrar por el nombre de la especialidad
        query = query.join(
            MedicoEspecialidad, Medico.Matricula == MedicoEspecialidad.Medico_Matricula
        )
        query = query.join(
            Especialidad,
            MedicoEspecialidad.Especialidad_Id == Especialidad.Id_especialidad,
        )
        # Filtro case-insensitive parcial
        query = query.filter(Especialidad.descripcion.ilike(f"%{especialidad}%"))

    # 2. Filtro por Matrícula
    if matricula:
        query = query.filter(Medico.Matricula.ilike(f"%{matricula}%"))

    # 3. Filtro por Nombre o Apellido
    if nombre:
        search_term = f"%{nombre}%"
        query = query.filter(
            or_(Medico.Nombre.ilike(search_term), Medico.Apellido.ilike(search_term))
        )

    # Gracias a la relación definida en el modelo, SQLAlchemy llenará 'especialidades_rel'
    # y Pydantic leerá la propiedad 'especialidades'.
    return query.all()


def obtener_medico(db: Session, matricula: str):
    return db.query(Medico).filter(Medico.Matricula == matricula).first()


def actualizar_medico(db: Session, matricula: str, data: MedicoUpdate):
    medico = obtener_medico(db, matricula)
    if not medico:
        return None

    # 1. Actualizar campos básicos
    if data.Nombre is not None:
        medico.Nombre = data.Nombre
    if data.Apellido is not None:
        medico.Apellido = data.Apellido

    # 2. Actualizar Especialidades (Si se envían en el payload)
    if data.especialidades is not None:
        # A) Eliminamos las relaciones existentes de este médico
        db.query(MedicoEspecialidad).filter(
            MedicoEspecialidad.Medico_Matricula == matricula
        ).delete()

        # B) Agregamos las nuevas relaciones
        for esp_id in data.especialidades:
            # Verificar que la especialidad exista (opcional pero recomendado)
            # ...
            nueva_rel = MedicoEspecialidad(
                Medico_Matricula=matricula, Especialidad_Id=esp_id
            )
            db.add(nueva_rel)

    db.commit()
    db.refresh(medico)
    return medico


def eliminar_medico(db: Session, matricula: str):
    medico = obtener_medico(db, matricula)
    if not medico:
        return False

    db.delete(medico)
    db.commit()
    return True
