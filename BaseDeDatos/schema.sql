-- =============================================================================
-- SECCIÓN DE BORRADO DE TABLAS
-- Se eliminan las tablas en orden inverso a su creación para respetar las
-- restricciones de clave externa (foreign keys).
-- =============================================================================

DROP TABLE IF EXISTS Detalles_Recetas;
DROP TABLE IF EXISTS Medicamentos;
DROP TABLE IF EXISTS Drogas;
DROP TABLE IF EXISTS Recetas;
DROP TABLE IF EXISTS Turnos;
DROP TABLE IF EXISTS Agendas_Excepcionales;
DROP TABLE IF EXISTS Agendas_Regulares;
DROP TABLE IF EXISTS Estados;
DROP TABLE IF EXISTS Medicos_Especialidades;
DROP TABLE IF EXISTS Medicos;
DROP TABLE IF EXISTS Especialidades;
DROP TABLE IF EXISTS Pacientes;
DROP TABLE IF EXISTS Consultorios;
DROP TABLE IF EXISTS Sucursales;

-- =============================================================================
-- SECCIÓN DE CREACIÓN DE TABLAS
-- =============================================================================

-- Tabla: Sucursales
CREATE TABLE Sucursales (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Direccion TEXT,
    Nombre TEXT NOT NULL
);

-- Tabla: Consultorios
CREATE TABLE Consultorios (
    Numero INTEGER,
    Sucursal_Id INTEGER,
    PRIMARY KEY (Numero, Sucursal_Id),
    FOREIGN KEY (Sucursal_Id) REFERENCES Sucursales(Id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla: Pacientes
CREATE TABLE Pacientes (
    nroPaciente INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL,
    Apellido TEXT NOT NULL,
    Telefono TEXT,
    Email TEXT UNIQUE
);

-- Tabla: Especialidades
CREATE TABLE Especialidades (
    Id_especialidad INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL UNIQUE
);

-- Tabla: Medicos
CREATE TABLE Medicos (
    Matricula TEXT PRIMARY KEY,
    Nombre TEXT NOT NULL,
    Apellido TEXT NOT NULL
);

-- Tabla: Medicos_Especialidades
CREATE TABLE Medicos_Especialidades (
    Medico_Matricula TEXT,
    Especialidad_Id INTEGER,
    PRIMARY KEY (Medico_Matricula, Especialidad_Id),
    FOREIGN KEY (Medico_Matricula) REFERENCES Medicos(Matricula) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Especialidad_Id) REFERENCES Especialidades(Id_especialidad) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla: Estados
CREATE TABLE Estados (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Descripcion TEXT NOT NULL UNIQUE
);

-- Tabla: Agendas_Regulares
CREATE TABLE Agendas_Regulares (
    Medico_Matricula TEXT,
    Especialidad_Id INTEGER,
    Dia_de_semana INTEGER,
    Hora_inicio TEXT NOT NULL,
    Hora_fin TEXT NOT NULL,
    Duracion INTEGER,
    Sucursal_Id INTEGER,
    PRIMARY KEY (Medico_Matricula, Especialidad_Id, Dia_de_semana, Hora_inicio),
    FOREIGN KEY (Medico_Matricula) REFERENCES Medicos(Matricula) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Especialidad_Id) REFERENCES Especialidades(Id_especialidad) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Sucursal_Id) REFERENCES Sucursales(Id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla: Agendas_Excepcionales
CREATE TABLE Agendas_Excepcionales (
    Medico_Matricula TEXT,
    Especialidad_Id INTEGER,
    Fecha_inicio TEXT,
    Hora_inicio TEXT,
    Fecha_Fin TEXT,
    Hora_Fin TEXT,
    Es_Disponible INTEGER DEFAULT 1, -- Usamos INTEGER para el booleano (1=True, 0=False)
    Motivo TEXT,
    Consultorio_Numero INTEGER,
    Consultorio_Sucursal_Id INTEGER,
    PRIMARY KEY (Medico_Matricula, Especialidad_Id, Fecha_inicio, Hora_inicio),
    FOREIGN KEY (Medico_Matricula) REFERENCES Medicos(Matricula) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Especialidad_Id) REFERENCES Especialidades(Id_especialidad) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Consultorio_Numero, Consultorio_Sucursal_Id) REFERENCES Consultorios(Numero, Sucursal_Id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla: Turnos
CREATE TABLE Turnos (
    Fecha TEXT,
    Hora TEXT,
    Paciente_nroPaciente INTEGER,
    Medico_Matricula TEXT NOT NULL,
    Especialidad_Id INTEGER NOT NULL,
    Estado_Id INTEGER,
    Sucursal_Id INTEGER,
    Duracion INTEGER,
    Motivo TEXT,
    Diagnostico TEXT,
    PRIMARY KEY (Fecha, Hora, Paciente_nroPaciente),
    FOREIGN KEY (Paciente_nroPaciente) REFERENCES Pacientes(nroPaciente) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Medico_Matricula) REFERENCES Medicos(Matricula) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (Especialidad_Id) REFERENCES Especialidades(Id_especialidad) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (Estado_Id) REFERENCES Estados(Id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (Sucursal_Id) REFERENCES Sucursales(Id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla: Recetas
CREATE TABLE Recetas (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Turno_Fecha TEXT NOT NULL,
    Turno_Hora TEXT NOT NULL,
    Turno_Paciente_nroPaciente INTEGER NOT NULL,
    UNIQUE (Turno_Fecha, Turno_Hora, Turno_Paciente_nroPaciente),
    FOREIGN KEY (Turno_Fecha, Turno_Hora, Turno_Paciente_nroPaciente) REFERENCES Turnos(Fecha, Hora, Paciente_nroPaciente) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla: Drogas
CREATE TABLE Drogas (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Descripcion TEXT NOT NULL UNIQUE
);

-- Tabla: Medicamentos
CREATE TABLE Medicamentos (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Droga_Id INTEGER,
    Nombre TEXT NOT NULL,
    dosis TEXT,
    FOREIGN KEY (Droga_Id) REFERENCES Drogas(Id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla: Detalles_Recetas
CREATE TABLE Detalles_Recetas (
    Receta_Id INTEGER,
    Medicamento_Id INTEGER,
    PRIMARY KEY (Receta_Id, Medicamento_Id),
    FOREIGN KEY (Receta_Id) REFERENCES Recetas(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Medicamento_Id) REFERENCES Medicamentos(Id) ON DELETE RESTRICT ON UPDATE CASCADE
);