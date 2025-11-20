const API_URL = 'http://localhost:8000/api/usuarios/usuarios';

export async function fetchUsuarioPorId(userId: string) {
    const response = await fetch(`${API_URL}${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Error al obtener el usuario');
    }
    return response.json();
}