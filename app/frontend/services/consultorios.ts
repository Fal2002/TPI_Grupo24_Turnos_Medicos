const API_URL = "http://localhost:8000/api/consultorios/consultorios";

interface ConsultorioFilters {
  sucursal_id?: string;
  numero?: string;
}

export async function getConsultorios(filters?: ConsultorioFilters) {
  const params = new URLSearchParams();
    if (filters) {
    if (filters.sucursal_id) params.append("sucursal_id", filters.sucursal_id);
    if (filters.numero) params.append("numero", filters.numero);
  }
  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Error fetching consultorios');
  }
  return response.json();
}

export async function deleteConsultorio(id: number | string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error('Error deleting consultorio');
  }
  return response.json();
}

export async function createConsultorio(data: any) {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
    if (!response.ok) {
    throw new Error('Error creating consultorio');
  }
  return response.json();
}

export async function updateConsultorio(id: number | string, data: any) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
    if (!response.ok) {
    throw new Error('Error updating consultorio');
  }
  return response.json();
}