# app/backend/schemas/agenda_excepcional.py

from pydantic import BaseModel, Field
from typing import Optional

# -----------------
# Schema de Entrada (CREATE)
# -----------------
class AgendaExcepcionalCreate(BaseModel):
    # Fechas y Horas en formato string (YYYY-MM-DD y HH:MM)
    Fecha_inicio: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Formato YYYY-MM-DD")
    Hora_inicio: str = Field(..., pattern=r"^\d{2}:\d{2}$", description="Formato HH:MM")
    Fecha_Fin: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Formato YYYY-MM-DD")
    Hora_Fin: str = Field(..., pattern=r"^\d{2}:\d{2}$", description="Formato HH:MM")
    
    # 1: Disponible (default), 0: No Disponible
    Es_Disponible: int = Field(1, ge=0, le=1) 
    Motivo: Optional[str] = None
    
    # FKs necesarias
    Especialidad_Id: int
    
    # FK compuesta (Consultorio)
    Consultorio_Numero: Optional[int] = None
    Consultorio_Sucursal_Id: Optional[int] = None


# -----------------
# Schema de Salida (OUT)
# -----------------
class AgendaExcepcionalOut(AgendaExcepcionalCreate):
    # Incluimos las PKs compuestas para la respuesta
    Medico_Matricula: str 
    
    class Config:
        from_attributes = True