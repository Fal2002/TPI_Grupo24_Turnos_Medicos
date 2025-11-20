
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

export async function getTurnosPorMedico(matricula: string) {
  const res = await fetch(`${API_URL}/turnos/turnos/medico/${matricula}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al obtener turnos del médico");
  }
  return res.json();
}

export async function getTurnosPorPaciente(nroPaciente: number) {
  const res = await fetch(`${API_URL}/turnos/turnos/paciente/${nroPaciente}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al obtener turnos del paciente");
  }
  return res.json();
}

export async function cambiarEstadoTurno(pkData: { fecha: string; hora: string; paciente_nro: number }, accion: string) {
  const { fecha, hora, paciente_nro } = pkData;
  const res = await fetch(`${API_URL}/turnos/turnos/${fecha}/${hora}/${paciente_nro}/${accion}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al cambiar estado del turno");
  }
  return res.json();
}

//actualizar turno
export async function actualizarTurno(pkData: { fecha: string; hora: string; paciente_nro: number }, nuevosDatos: { Fecha?: string, Hora?: string, Motivo?: string, Diagnostico?: string }) {
  const { fecha, hora, paciente_nro } = pkData;
  const res = await fetch(`${API_URL}/turnos/turnos/${fecha}/${hora}/${paciente_nro}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(nuevosDatos),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al actualizar el turno");
  }
  return res.json();
}