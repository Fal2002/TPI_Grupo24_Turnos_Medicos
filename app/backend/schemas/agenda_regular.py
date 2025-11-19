from pydantic import BaseModel, Field
from typing import Optional

# -----------------
# Schema de Entrada (CREATE)
# -----------------
class AgendaRegularCreate(BaseModel):
    # La validación asegura que el día de la semana esté entre 1 (Lunes) y 7 (Domingo)
    Dia_de_semana: int = Field(..., ge=1, le=7, description="Día de la semana (1=Lunes, 7=Domingo)")
    
    # Se usan strings para Hora_inicio/fin ya que así están definidos en el Model (Text)
    Hora_inicio: str = Field(..., pattern=r"^\d{2}:\d{2}$", description="Formato HH:MM") 
    Hora_fin: str = Field(..., pattern=r"^\d{2}:\d{2}$", description="Formato HH:MM")
    
    # FKs necesarias
    Especialidad_Id: int
    Duracion: int = Field(..., gt=0, description="Duración del turno en minutos")
    Sucursal_Id: Optional[int] = None

# -----------------
# Schema de Salida (OUT)
# -----------------
class AgendaRegularOut(AgendaRegularCreate):
    # Incluimos las PKs compuestas para la respuesta
    Medico_Matricula: str 
    
    class Config:
        from_attributes = True