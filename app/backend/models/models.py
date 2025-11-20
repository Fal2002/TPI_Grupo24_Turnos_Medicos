from sqlalchemy import Column, ForeignKeyConstraint, Integer, Text, String, ForeignKey, Float, Date
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
    Sucursal_Id = Column(Integer, ForeignKey("Sucursales.Id", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)

    sucursal = relationship("Sucursal")


class Paciente(Base):
    __tablename__ = "Pacientes"
    nroPaciente = Column(Integer, primary_key=True, autoincrement=True)
    Nombre = Column(Text, nullable=False)
    Apellido = Column(Text, nullable=False)
    Teléfono = Column(Text)
    Email = Column(Text, unique=True)


class Especialidad(Base):
    __tablename__ = "Especialidades"
    Id_especialidad = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(Text, nullable=False, unique=True)


class Medico(Base):
    __tablename__ = "Medicos"
    Matricula = Column(String, primary_key=True)
    Nombre = Column(Text, nullable=False)
    Apellido = Column(Text, nullable=False)

    especialidades_rel = relationship(
        "Especialidad",
        secondary="Medicos_Especialidades",
        backref="medicos",
        lazy="joined",
    )

    @property
    def especialidades(self):
        return [esp.Id_especialidad for esp in self.especialidades_rel]


class MedicoEspecialidad(Base):
    __tablename__ = "Medicos_Especialidades"
    Medico_Matricula = Column(String, ForeignKey("Medicos.Matricula", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)
    Especialidad_Id = Column(Integer, ForeignKey("Especialidades.Id_especialidad", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)


class Estado(Base):
    __tablename__ = "Estados"
    Id = Column(Integer, primary_key=True, autoincrement=True)
    Descripcion = Column(Text, nullable=False, unique=True)


class AgendaRegular(Base):
    __tablename__ = "Agendas_Regulares"
    Medico_Matricula = Column(String, ForeignKey("Medicos.Matricula", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)
    Especialidad_Id = Column(Integer, ForeignKey("Especialidades.Id_especialidad", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)
    Dia_de_semana = Column(Integer, primary_key=True)
    Hora_inicio = Column(Text, primary_key=True)
    Hora_fin = Column(Text, nullable=False)
    Duracion = Column(Integer)
    Sucursal_Id = Column(Integer, ForeignKey("Sucursales.Id", ondelete="SET NULL", onupdate="CASCADE"), nullable=True)


class AgendaExcepcional(Base):
    __tablename__ = "Agendas_Excepcionales"
    Medico_Matricula = Column(String, ForeignKey("Medicos.Matricula", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)
    Especialidad_Id = Column(Integer, ForeignKey("Especialidades.Id_especialidad", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)
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

    Fecha = Column(Date, primary_key=True)
    Hora = Column(Text, primary_key=True)
    Paciente_nroPaciente = Column(Integer, ForeignKey("Pacientes.nroPaciente", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)

    Medico_Matricula = Column(String, ForeignKey("Medicos.Matricula", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    Especialidad_Id = Column(Integer, ForeignKey("Especialidades.Id_especialidad", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    Estado_Id = Column(Integer, ForeignKey("Estados.Id", ondelete="SET NULL", onupdate="CASCADE"), nullable=True)

    Consultorio_Numero = Column(Integer, nullable=True)
    Consultorio_Sucursal_Id = Column(Integer, nullable=True)

    __table_args__ = (
        ForeignKeyConstraint(
            ["Consultorio_Numero", "Consultorio_Sucursal_Id"],
            ["Consultorios.Numero", "Consultorios.Sucursal_Id"],
            ondelete="SET NULL",
            onupdate="CASCADE"
        ),
    )

    Duracion = Column(Integer)
    Motivo = Column(Text)
    Diagnostico = Column(Text)

    estado_rel = relationship("Estado")
    medico = relationship("Medico")
    especialidad = relationship("Especialidad")
    paciente = relationship("Paciente")
    consultorio = relationship("Consultorio", lazy="joined")

    @property
    def sucursal(self):
        if self.consultorio:
            return self.consultorio.sucursal
        return None

    recetas = relationship("Receta", back_populates="turno", cascade="all, delete-orphan")

    @property
    def estado(self):
        if self.estado_rel:
            return self.estado_rel.Descripcion
        return None

    def get_state(self, db):
        estado = db.query(Estado).filter(Estado.Id == self.Estado_Id).first()
        if not estado:
            raise Exception("Estado inválido")

        mapping = {
            "Pendiente": PendienteState,
            "Confirmado": ConfirmadoState,
            "Cancelado": CanceladoState,
            "Atendido": AtendidoState,
            "Finalizado": FinalizadoState,
            "Ausente": AusenteState,
            "Anunciado": AnunciadoState,
        }

        cls = mapping.get(estado.Descripcion)
        if not cls:
            raise Exception(f"Estado desconocido: {estado.Descripcion}")

        return cls(self, db)


class Receta(Base):
    __tablename__ = "Recetas"

    Id = Column(Integer, primary_key=True, autoincrement=True)

    Turno_Fecha = Column(Text, nullable=False)
    Turno_Hora = Column(Text, nullable=False)
    Turno_Paciente_nroPaciente = Column(Integer, nullable=False)

    __table_args__ = (
        ForeignKeyConstraint(
            ["Turno_Fecha", "Turno_Hora", "Turno_Paciente_nroPaciente"],
            ["Turnos.Fecha", "Turnos.Hora", "Turnos.Paciente_nroPaciente"],
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
    )

    turno = relationship("Turno", back_populates="recetas")
    detalles = relationship("DetalleReceta", back_populates="receta", cascade="all, delete-orphan")


class Droga(Base):
    __tablename__ = "Drogas"
    Id = Column(Integer, primary_key=True, autoincrement=True)
    Descripcion = Column(String(100), nullable=False, unique=True)

    medicamentos = relationship("Medicamento", back_populates="droga")


class Medicamento(Base):
    __tablename__ = "Medicamentos"
    Id = Column(Integer, primary_key=True, autoincrement=True)
    Nombre = Column(Text, nullable=False)
    Cantidad = Column(Float, nullable=False)
    Unidad = Column(Text, nullable=False)
    Frecuencia = Column(Text, nullable=False)
    Droga_Id = Column(Integer, ForeignKey("Drogas.Id", ondelete="RESTRICT"), nullable=False)

    droga = relationship("Droga", back_populates="medicamentos")
    detalles = relationship("DetalleReceta", back_populates="medicamento")


class DetalleReceta(Base):
    __tablename__ = "Detalles_Recetas"

    Receta_Id = Column(Integer, ForeignKey("Recetas.Id", ondelete="CASCADE"), primary_key=True)
    Medicamento_Id = Column(Integer, ForeignKey("Medicamentos.Id", ondelete="RESTRICT"), primary_key=True)

    receta = relationship("Receta", back_populates="detalles")
    medicamento = relationship("Medicamento", back_populates="detalles")