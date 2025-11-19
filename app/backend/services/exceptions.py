class RecursoNoEncontradoError(Exception):
    """Excepción para cuando un recurso (Médico, Paciente, Turno) no existe."""
    pass

class MatriculaDuplicadaError(Exception):
    """Excepción lanzada cuando se intenta crear un Médico con una matrícula ya existente."""
    pass

class EmailYaRegistradoError(Exception):
    """Excepción lanzada cuando un email ya está en uso (ej. al registrar Paciente)."""
    pass

class HorarioNoDisponibleError(Exception):
    """Excepción lanzada cuando se intenta crear un Turno en un horario ocupado."""
    pass

class TransicionInvalidaError(Exception):
    """Excepción lanzada al intentar un cambio de estado de Turno no permitido (Patrón State)."""
    pass

class ValueError(Exception):
    """Excepción para errores de lógica de negocio (ej. fecha en el pasado, duración negativa)."""
    pass

class IntegrityError(Exception):
    """Excepción para errores de integridad de datos (ej. violación de unicidad)."""
    pass