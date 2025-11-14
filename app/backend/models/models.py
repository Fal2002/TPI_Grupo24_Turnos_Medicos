from sqlalchemy import Column, ForeignKeyConstraint, Integer, Text, String, ForeignKey
from app.backend.db.db import Base

# ========================
# Sucursales
# ========================
class Sucursal(Base):
    __tablename__ = "Sucursales"

    Id = Column(Integer, primary_key=True, autoincrement=True)
    Direccion = Column(Text)
    Nombre = Column(Text, nullable=False)


# ========================
# Consultorios
# ========================
class Consultorio(Base):
    __tablename__ = "Consultorios"

    Numero = Column(Integer, primary_key=True)
    Sucursal_Id = Column(Integer, ForeignKey("Sucursales.Id", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)


# ========================
# Pacientes
# ========================
class Paciente(Base):
    __tablename__ = "Pacientes"

    nroPaciente = Column(Integer, primary_key=True, autoincrement=True)
    Nombre = Column(Text, nullable=False)
    Apellido = Column(Text, nullable=False)
    Telefono = Column(Text)
    Email = Column(Text, unique=True)


# ========================
# Especialidades
# ========================
class Especialidad(Base):
    __tablename__ = "Especialidades"

    Id_especialidad = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(Text, nullable=False, unique=True)


# ========================
# Medicos
# ========================
class Medico(Base):
    __tablename__ = "Medicos"

    Matricula = Column(String, primary_key=True)
    Nombre = Column(Text, nullable=False)
    Apellido = Column(Text, nullable=False)


# ========================
# Medicos_Especialidades
# ========================
class MedicoEspecialidad(Base):
    __tablename__ = "Medicos_Especialidades"

    Medico_Matricula = Column(
        String,
        ForeignKey("Medicos.Matricula", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True
    )

    Especialidad_Id = Column(
        Integer,
        ForeignKey("Especialidades.Id_especialidad", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True
    )


# ========================
# Estados
# ========================
class Estado(Base):
    __tablename__ = "Estados"

    Id = Column(Integer, primary_key=True, autoincrement=True)
    Descripcion = Column(Text, nullable=False, unique=True)


# ========================
# Agendas Regulares
# ========================
class AgendaRegular(Base):
    __tablename__ = "Agendas_Regulares"

    Medico_Matricula = Column(
        String,
        ForeignKey("Medicos.Matricula", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True
    )

    Especialidad_Id = Column(
        Integer,
        ForeignKey("Especialidades.Id_especialidad", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True
    )

    Dia_de_semana = Column(Integer, primary_key=True)
    Hora_inicio = Column(Text, primary_key=True)

    Hora_fin = Column(Text, nullable=False)
    Duracion = Column(Integer)

    Sucursal_Id = Column(
        Integer,
        ForeignKey("Sucursales.Id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True
    )


# ========================
# Agendas Excepcionales
# ========================
class AgendaExcepcional(Base):
    __tablename__ = "Agendas_Excepcionales"

    Medico_Matricula = Column(
        String,
        ForeignKey("Medicos.Matricula", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True
    )

    Especialidad_Id = Column(
        Integer,
        ForeignKey("Especialidades.Id_especialidad", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True
    )

    Fecha_inicio = Column(Text, primary_key=True)
    Hora_inicio = Column(Text, primary_key=True)

    Fecha_Fin = Column(Text)
    Hora_Fin = Column(Text)
    Es_Disponible = Column(Integer, default=1)
    Motivo = Column(Text)

    Consultorio_Numero = Column(Integer)
    Consultorio_Sucursal_Id = Column(Integer)

    __table_args__ = (
        ForeignKeyConstraint(
            ["Consultorio_Numero", "Consultorio_Sucursal_Id"],
            ["Consultorios.Numero", "Consultorios.Sucursal_Id"],
            ondelete="SET NULL",
            onupdate="CASCADE",
        ),
    )

# ========================
# Turnos
# ========================
class Turno(Base):
    __tablename__ = "Turnos"

    Fecha = Column(Text, primary_key=True)
    Hora = Column(Text, primary_key=True)

    Paciente_nroPaciente = Column(
        Integer,
        ForeignKey("Pacientes.nroPaciente", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True
    )

    Medico_Matricula = Column(
        String,
        ForeignKey("Medicos.Matricula", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False
    )

    Especialidad_Id = Column(
        Integer,
        ForeignKey("Especialidades.Id_especialidad", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False
    )

    Estado_Id = Column(
        Integer,
        ForeignKey("Estados.Id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True
    )

    Sucursal_Id = Column(
        Integer,
        ForeignKey("Sucursales.Id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True
    )

    Duracion = Column(Integer)
    Motivo = Column(Text)
    Diagnostico = Column(Text)


# ========================
# Recetas
# ========================
class Receta(Base):
    __tablename__ = "Recetas"

    Id = Column(Integer, primary_key=True, autoincrement=True)

    Turno_Fecha = Column(Text, nullable=False)
    Turno_Hora = Column(Text, nullable=False)
    Turno_Paciente_nroPaciente = Column(
        Integer,
        ForeignKey("Turnos.Paciente_nroPaciente", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False
    )


# ========================
# Drogas
# ========================
class Droga(Base):
    __tablename__ = "Drogas"

    Id = Column(Integer, primary_key=True, autoincrement=True)
    Descripcion = Column(Text, nullable=False, unique=True)


# ========================
# Medicamentos
# ========================
class Medicamento(Base):
    __tablename__ = "Medicamentos"

    Id = Column(Integer, primary_key=True, autoincrement=True)

    Droga_Id = Column(
        Integer,
        ForeignKey("Drogas.Id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True
    )

    Nombre = Column(Text, nullable=False)
    dosis = Column(Text)


# ========================
# Detalles de Recetas
# ========================
class DetalleReceta(Base):
    __tablename__ = "Detalles_Recetas"

    Receta_Id = Column(
        Integer,
        ForeignKey("Recetas.Id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True
    )

    Medicamento_Id = Column(
        Integer,
        ForeignKey("Medicamentos.Id", ondelete="RESTRICT", onupdate="CASCADE"),
        primary_key=True
    )
