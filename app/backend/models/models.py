from sqlalchemy import (
    Column,
    ForeignKeyConstraint,
    Integer,
    Text,
    String,
    ForeignKey,
    Float,
)
from app.backend.db.db import Base
from app.backend.state.estados_turno import (
    PendienteState,
    ConfirmadoState,
    CanceladoState,
    AtendidoState,
    FinalizadoState,
    AusenteState,
    AnunciadoState,
)
from sqlalchemy.orm import relationship


class Sucursal(Base):
    __tablename__ = "Sucursales"
    Id = Column(Integer, primary_key=True, autoincrement=True)
    Direccion = Column(Text)
    Nombre = Column(Text, nullable=False)


class Consultorio(Base):
    __tablename__ = "Consultorios"
    Numero = Column(Integer, primary_key=True)
    Sucursal_Id = Column(
        Integer,
        ForeignKey("Sucursales.Id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )


class Paciente(Base):
    __tablename__ = "Pacientes"
    nroPaciente = Column(Integer, primary_key=True, autoincrement=True)
    Nombre = Column(Text, nullable=False)
    Apellido = Column(Text, nullable=False)
    Telefono = Column(Text)
    Email = Column(Text, unique=True)

    User_Id = Column(
        Integer,
        ForeignKey("Users.Id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
        unique=True,
    )
    user = relationship("User", back_populates="paciente")
    turnos = relationship("Turno", back_populates="paciente")


class Especialidad(Base):
    __tablename__ = "Especialidades"
    Id_especialidad = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(Text, nullable=False, unique=True)


class Medico(Base):
    __tablename__ = "Medicos"
    Matricula = Column(String, primary_key=True)
    Nombre = Column(Text, nullable=False)
    Apellido = Column(Text, nullable=False)

    User_Id = Column(
        Integer,
        ForeignKey("Users.Id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
        unique=True,
    )
    user = relationship("User", back_populates="medico", uselist=False)

    especialidades = relationship(
        "Especialidad",
        secondary="Medicos_Especialidades",
        backref="medicos",
        lazy="joined",
    )

    @property
    def email_usuario(self):
        return self.user.Email if self.user else None


class MedicoEspecialidad(Base):
    __tablename__ = "Medicos_Especialidades"
    Medico_Matricula = Column(
        String,
        ForeignKey("Medicos.Matricula", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    Especialidad_Id = Column(
        Integer,
        ForeignKey(
            "Especialidades.Id_especialidad", ondelete="CASCADE", onupdate="CASCADE"
        ),
        primary_key=True,
    )


class Estado(Base):
    __tablename__ = "Estados"
    Id = Column(Integer, primary_key=True, autoincrement=True)
    Descripcion = Column(Text, nullable=False, unique=True)


class AgendaRegular(Base):
    __tablename__ = "Agendas_Regulares"
    Medico_Matricula = Column(
        String,
        ForeignKey("Medicos.Matricula", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    Especialidad_Id = Column(
        Integer,
        ForeignKey(
            "Especialidades.Id_especialidad", ondelete="CASCADE", onupdate="CASCADE"
        ),
        primary_key=True,
    )
    Dia_de_semana = Column(Integer, primary_key=True)
    Hora_inicio = Column(Text, primary_key=True)
    Hora_fin = Column(Text, nullable=False)
    Duracion = Column(Integer)
    Sucursal_Id = Column(
        Integer,
        ForeignKey("Sucursales.Id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )


class AgendaExcepcional(Base):
    __tablename__ = "Agendas_Excepcionales"
    Medico_Matricula = Column(
        String,
        ForeignKey("Medicos.Matricula", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    Especialidad_Id = Column(
        Integer,
        ForeignKey(
            "Especialidades.Id_especialidad", ondelete="CASCADE", onupdate="CASCADE"
        ),
        primary_key=True,
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


class Turno(Base):
    __tablename__ = "Turnos"

    Fecha = Column(Text, primary_key=True)
    Hora = Column(Text, primary_key=True)

    Paciente_nroPaciente = Column(
        Integer,
        ForeignKey("Pacientes.nroPaciente", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )

    Medico_Matricula = Column(
        String,
        ForeignKey("Medicos.Matricula", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
    )

    Especialidad_Id = Column(
        Integer,
        ForeignKey(
            "Especialidades.Id_especialidad", ondelete="RESTRICT", onupdate="CASCADE"
        ),
        nullable=False,
    )

    Estado_Id = Column(
        Integer,
        ForeignKey("Estados.Id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )

    Sucursal_Id = Column(
        Integer,
        ForeignKey("Sucursales.Id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )

    Duracion = Column(Integer)
    Motivo = Column(Text)
    Diagnostico = Column(Text)

    estado_rel = relationship("Estado")
    paciente = relationship("Paciente", back_populates="turnos")
    medico = relationship("Medico")


class Receta(Base):
    __tablename__ = "Recetas"
    Id = Column(Integer, primary_key=True, autoincrement=True)
    Turno_Fecha = Column(Text, nullable=False)
    Turno_Hora = Column(Text, nullable=False)
    Turno_Paciente_nroPaciente = Column(
        Integer,
        ForeignKey(
            "Turnos.Paciente_nroPaciente", ondelete="CASCADE", onupdate="CASCADE"
        ),
        nullable=False,
    )

    detalles = relationship(
        "DetalleReceta", back_populates="receta", cascade="all, delete"
    )


class Droga(Base):
    __tablename__ = "Drogas"
    Id = Column(Integer, primary_key=True, autoincrement=True)
    Descripcion = Column(String(100), nullable=False, unique=True)


class Medicamento(Base):
    __tablename__ = "Medicamentos"
    Id = Column(Integer, primary_key=True, autoincrement=True)
    Droga_Id = Column(
        Integer,
        ForeignKey("Drogas.Id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )
    Nombre = Column(Text, nullable=False)
    dosis_cantidad = Column(Float, nullable=True)
    dosis_unidad = Column(Text, nullable=True)
    dosis_frecuencia = Column(Text, nullable=True)

    droga = relationship("Droga")
    detalles = relationship("DetalleReceta", back_populates="medicamento")


class DetalleReceta(Base):
    __tablename__ = "Detalles_Recetas"

    Receta_Id = Column(
        Integer,
        ForeignKey("Recetas.Id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    Medicamento_Id = Column(
        Integer,
        ForeignKey("Medicamentos.Id", ondelete="RESTRICT", onupdate="CASCADE"),
        primary_key=True,
    )

    # Relaciones agregadas y correctas
    receta = relationship("Receta", back_populates="detalles")
    medicamento = relationship("Medicamento", back_populates="detalles")


class Role(Base):
    __tablename__ = "Roles"

    Id = Column(Integer, primary_key=True, autoincrement=True)
    Nombre = Column(String, nullable=False, unique=True)

    usuarios = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "Users"

    Id = Column(Integer, primary_key=True, autoincrement=True)
    Email = Column(String, unique=True, nullable=False)
    Password_Hash = Column(String, nullable=False)

    Role_Id = Column(
        Integer,
        ForeignKey("Roles.Id", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
    )

    role = relationship("Role", back_populates="usuarios")
    medico = relationship("Medico", back_populates="user", uselist=False)
    paciente = relationship("Paciente", back_populates="user", uselist=False)
