// services/medicos.ts

// CAMBIO IMPORTANTE: Quitamos el "/api/medicos" de la base si vamos a agregar "/medicos" abajo.
// O dejamos solo la base.
// Opción recomendada: Apuntar a la raíz del servidor
const API_URL = "http://localhost:8000/api/medicos"; 

interface MedicoFilters {
  matricula?: string;
  nombre?: string;
  especialidad?: string;
}

export async function getMedicos(filters?: MedicoFilters) {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.matricula) params.append("matricula", filters.matricula);
    if (filters.nombre) params.append("nombre", filters.nombre);
    if (filters.especialidad) params.append("especialidad", filters.especialidad);
  }

  // Ahora la URL final será: http://localhost:8000/medicos?param=...
  const res = await fetch(`${API_URL}/medicos?${params.toString()}`);
  
  if (!res.ok) throw new Error("Error al obtener médicos");
  return res.json();
}

export async function getMedico(matricula: number | string) {
  const res = await fetch(`${API_URL}/medicos/${matricula}`);
  if (!res.ok) throw new Error("Médico no encontrado");
  return res.json();
}

export async function createMedico(data: any) {
  const res = await fetch(`${API_URL}/medicos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Error al crear médico");
  return res.json();
}

export async function updateMedico(matricula: number, data: any) {
  const res = await fetch(`${API_URL}/medicos/${matricula}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Error al actualizar médico");
  return res.json();
}

export async function deleteMedico(matricula: number) {
  const res = await fetch(`${API_URL}/medicos/${matricula}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar médico");
  return res.json();
}

export async function getEspecialidadesMedico(matricula: number | string) {
  const res = await fetch(`${API_URL}/medicos/${matricula}/especialidades`);
  if (!res.ok) throw new Error("Error al obtener especialidades del médico");
  return res.json();
}