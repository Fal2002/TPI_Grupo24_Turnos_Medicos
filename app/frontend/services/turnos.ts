
const API_URL = "http://localhost:8000/api";

export interface TurnoCreate {
  Fecha: string; // YYYY-MM-DD
  Hora: string; // HH:MM
  Paciente_nroPaciente: number;
  Medico_Matricula: string;
  Especialidad_Id: number;
  Sucursal_Id?: number;
  Duracion?: number;
  Motivo?: string;
}

export interface AgendaDisponible {
  fecha: string;
  hora: string;
  medico_matricula: string;
  especialidad_id: number;
  duracion: number;
  sucursal_id?: number;
}

export async function getAgendaDisponible(matricula: string, fecha: string) {
  const res = await fetch(`${API_URL}/agendas/agendas/medicos/${matricula}/agenda/disponible?fecha=${fecha}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al obtener agenda disponible");
  }
  return res.json();
}

export async function createTurno(turno: TurnoCreate) {
  const res = await fetch(`${API_URL}/turnos/turnos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(turno),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al crear turno");
  }
  return res.json();
}