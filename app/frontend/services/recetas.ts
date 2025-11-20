const API_URL = "http://localhost:8000/api";

export interface RecetaCreate {
  Turno_Fecha: string;
  Turno_Hora: string;
  Turno_Paciente_nroPaciente: number;
}

export interface MedicamentoOut {
  Id: number;
  Nombre: string;
  dosis?: string;
  Droga_Id?: number;
}

export interface RecetaOut {
  Id: number;
  Turno_Fecha: string;
  Turno_Hora: string;
  Turno_Paciente_nroPaciente: number;
}

export interface RecetaConMedicamentosOut extends RecetaOut {
  medicamentos: MedicamentoOut[];
}

export async function crearReceta(receta: RecetaCreate) {
  const res = await fetch(`${API_URL}/recetas/recetas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(receta),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al crear receta");
  }
  return res.json();
}

export async function obtenerTodasLasRecetas() {
  const res = await fetch(`${API_URL}/recetas/recetas/`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al obtener recetas");
  }
  return res.json();
}

export async function obtenerRecetaPorId(id: number) {
  const res = await fetch(`${API_URL}/recetas/recetas/${id}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al obtener receta");
  }
  return res.json();
}

export async function obtenerRecetasPorTurno(fecha: string, hora: string, pacienteNro: number) {
  const res = await fetch(`${API_URL}/recetas/recetas/turno/${fecha}/${hora}/${pacienteNro}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al obtener recetas del turno");
  }
  return res.json();
}

export async function eliminarReceta(id: number) {
  const res = await fetch(`${API_URL}/recetas/recetas/${id}`, {
    method: "DELETE",
    credentials: 'include',
  });

  if (!res.ok) {
    if (res.status === 204) return;
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al eliminar receta");
  }
}

export async function agregarMedicamentoAReceta(recetaId: number, medicamentoId: number) {
  const res = await fetch(`${API_URL}/recetas/recetas/${recetaId}/medicamentos/${medicamentoId}`, {
    method: "POST",
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al agregar medicamento a receta");
  }
  return res.json();
}

export async function obtenerMedicamentosDeReceta(recetaId: number) {
  const res = await fetch(`${API_URL}/recetas/recetas/${recetaId}/medicamentos`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al obtener medicamentos de la receta");
  }
  return res.json();
}
