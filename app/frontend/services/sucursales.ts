const API_URL = 'http://localhost:8000/api/sucursales/sucursales';

interface SucursalFilters {
    id?: string;
    nombre?: string;
    direccion?: string;
}

export async function getSucursales(filters?: SucursalFilters) {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.id) params.append('id', filters.id);
    if (filters.nombre) params.append('nombre', filters.nombre);
    if (filters.direccion) params.append('direccion', filters.direccion);
  }

  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Error fetching sucursales');
  }
  return response.json();
}

export async function getSucursalById(id: string | number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
    if (!res.ok) {
    throw new Error('Error al obtener la sucursal');
  }
  return res.json();
}

export async function updateSucursal(id: string | number, data: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
    if (!res.ok) {
    throw new Error('Error al actualizar la sucursal');
  }
  return res.json();
}

export async function createSucursal(data: any) {
  const res = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
    if (!res.ok) {
    throw new Error('Error al crear la sucursal');
  }
  return res.json();
}

export async function deleteSucursal(id: string | number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
    if (!res.ok) {
    throw new Error('Error al eliminar la sucursal');
  }
  return res.json();
}