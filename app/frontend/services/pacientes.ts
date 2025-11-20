const API_URL = "http://localhost:8000/api/pacientes/pacientes";

interface PacienteFilters {
  numero?: string;
  nombre?: string;
  apellido?: string;
}

export async function getPacientes(filters?: PacienteFilters) {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.numero) params.append("numero", filters.numero);
    if (filters.nombre) params.append("nombre", filters.nombre);
    if (filters.apellido) params.append("apellido", filters.apellido);
  }
  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Error fetching pacientes");
  }
  return response.json();
}

// services/pacientes.ts

// Obtener paciente por Número (DNI/Afiliado)
export async function getPacienteByNumero(numero: string | number) {
  // Se asume que la ruta es .../api/pacientes/12345678
  const res = await fetch(`${API_URL}/${numero}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Error al obtener el paciente');
  }

  return await res.json();
}

export async function getPacienteByUserId(userId: string | number) {
  const res = await fetch(`${API_URL}/user/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Error al obtener el paciente por usuario');
  }

  return await res.json();
}

// Actualizar paciente usando su Número
export async function updatePaciente(numero: string | number, data: any) {
  const res = await fetch(`${API_URL}/${numero}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error al actualizar el paciente');
  }

  return await res.json();
}

export async function createPaciente(data: any) {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al crear paciente");
  return res.json();
}


export async function deletePaciente(numero: number) {
  const res = await fetch(`${API_URL}/${numero}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar paciente");
  return res.json();
}