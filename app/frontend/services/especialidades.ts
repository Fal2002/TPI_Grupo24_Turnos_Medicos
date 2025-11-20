const API_URL = "http://localhost:8000/api/especialidades";

interface EspecialidadFilters {
  nombre?: string;
  id?: string;
}

export async function getEspecialidades(filters?: EspecialidadFilters) {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.nombre) params.append("nombre", filters.nombre);
    if (filters.id) params.append("id", filters.id);
  }
  const response = await fetch(`${API_URL}?${params.toString()}`);
  return response.json();
}

export async function getEspecialidad(id: number | string) {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
}

export async function createEspecialidad(data: any) {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateEspecialidad(id: number, data: any) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteEspecialidad(id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return response.json();
}