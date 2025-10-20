DROP TABLE IF EXISTS Especialidad;
CREATE TABLE Especialidad (
    id_especialidad INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

DROP TABLE IF EXISTS Sucursal;
CREATE TABLE Sucursal(
    id_sucursal INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20)
);

DROP TABLE IF EXISTS Estado;
CREATE TABLE Estado(
    id_estado INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

DROP TABLE IF EXISTS Paciente;
CREATE TABLE Paciente(
    id_paciente INTEGER PRIMARY KEY AUTOINCREMENT,
    dni VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE
);

DROP TABLE IF EXISTS Medico;
CREATE TABLE Medico(
    id_medico INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    id_especialidad INT NOT NULL,
    FOREIGN KEY (id_especialidad) REFERENCES Especialidad(id_especialidad)
);

DROP TABLE IF EXISTS Turno;
CREATE TABLE Turno(
    id_turno INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    id_paciente INT NOT NULL,
    id_estado INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_medico INT NOT NULL,
    FOREIGN KEY (id_medico) REFERENCES Medico(id_medico),
    FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente),
    FOREIGN KEY (id_estado) REFERENCES Estado(id_estado),
    FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id_sucursal),
    UNIQUE (id_sucursal, fecha, hora)
);

DROP TABLE IF EXISTS Agenda;
CREATE TABLE Agenda(
    id_agenda INTEGER PRIMARY KEY AUTOINCREMENT,
    id_medico INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_turno INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    intervalo_minutos INT NOT NULL,
    FOREIGN KEY (id_turno) REFERENCES Turno(id_turno),
    FOREIGN KEY (id_medico) REFERENCES Medico(id_medico),
    FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id_sucursal),
    UNIQUE (id_medico, id_sucursal, fecha_inicio, fecha_fin)
);

DROP TABLE IF EXISTS HistorialClinico;
CREATE TABLE HistorialClinico(
    id_historial INTEGER PRIMARY KEY AUTOINCREMENT,
    id_paciente INT NOT NULL,
    id_turno INT NOT NULL,
    fecha DATE NOT NULL,
    diagnostico TEXT NOT NULL,
    tratamiento TEXT,
    FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente),
    FOREIGN KEY (id_turno) REFERENCES Turno(id_turno)
);

DROP TABLE IF EXISTS Medicamento;
CREATE TABLE Medicamento(
    id_medicamento INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

DROP TABLE IF EXISTS Receta;
CREATE TABLE Receta(
    id_receta INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_emision DATE DEFAULT CURRENT_DATE,
    observaciones TEXT
);

DROP TABLE IF EXISTS DetalleReceta;
CREATE TABLE DetalleReceta(
    id_detalle_receta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_receta INT NOT NULL,
    id_medicamento INT NOT NULL,
    dosis VARCHAR(100) NOT NULL,
    frecuencia VARCHAR(100) NOT NULL,
    duracion VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_receta) REFERENCES Receta(id_receta),
    FOREIGN KEY (id_medicamento) REFERENCES Medicamento(id_medicamento),
    UNIQUE (id_receta, id_medicamento)
);