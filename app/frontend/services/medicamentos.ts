const API_URL = "http://localhost:8000/api";

export interface MedicamentoCreate {
  Nombre: string;
  dosis?: string;
  Droga_Id?: number;
}

export interface MedicamentoOut {
  Id: number;
  Nombre: string;
  dosis?: string;
  Droga_Id?: number;
}

export async function crearMedicamento(medicamento: MedicamentoCreate) {
  const res = await fetch(`${API_URL}/medicamentos/medicamentos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(medicamento),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al crear medicamento");
  }
  return res.json();
}

export async function obtenerMedicamentos() {
  const res = await fetch(`${API_URL}/medicamentos/medicamentos/`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al obtener medicamentos");
  }
  return res.json();
}

export async function eliminarMedicamento(id: number) {
  const res = await fetch(`${API_URL}/medicamentos/medicamentos/${id}`, {
    method: "DELETE",
    credentials: 'include',
  });

  if (!res.ok) {
    if (res.status === 204) return;
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al eliminar medicamento");
  }
}
