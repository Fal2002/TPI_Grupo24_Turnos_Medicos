from pydantic import BaseModel


class AgendaDisponibleOut(BaseModel):
    fecha: str
    hora: str
    medico_matricula: str
    especialidad_id: int
    duracion: int
    sucursal_id: int | None = None
