const API_URL = "http://localhost:8000/api";

export interface DrogaCreate {
  Descripcion: string;
}

export interface DrogaOut {
  Id: number;
  Descripcion: string;
}

export async function crearDroga(droga: DrogaCreate) {
  const res = await fetch(`${API_URL}/drogas/drogas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(droga),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al crear droga");
  }
  return res.json();
}

export async function obtenerDrogas() {
  const res = await fetch(`${API_URL}/drogas/drogas/`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al obtener drogas");
  }
  return res.json();
}

export async function eliminarDroga(id: number) {
  const res = await fetch(`${API_URL}/drogas/drogas/${id}`, {
    method: "DELETE",
    credentials: 'include',
  });

  if (!res.ok) {
    if (res.status === 204) return;
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al eliminar droga");
  }
}
