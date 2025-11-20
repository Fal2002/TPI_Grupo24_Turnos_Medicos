/**
 * @file Archivo de servicio para gestionar las agendas regular y excepcional.
 * Se comunica con la API de FastAPI para realizar operaciones CRUD.
 */

// Define la URL base de la API.
const API_BASE_URL = 'http://localhost:8000/api/agendas/agendas';

// --- INTERFACES PARA AGENDA REGULAR ---

/**
 * Representa un único día de trabajo en la agenda regular.
 * Coincide con la estructura que maneja el frontend.
 */
interface HorarioRegular {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // Formato "HH:mm"
  endTime: string;   // Formato "HH:mm"
}

/**
 * Estructura de datos para crear una agenda regular completa para una especialidad.
 * Este payload será enviado al endpoint POST.
 * NOTA: Los nombres de las propiedades (ej. 'specialty_id') deben coincidir
 * con los que espera el esquema Pydantic 'AgendaRegularCreate' de FastAPI.
 */
export interface AgendaRegularPostEntry {
  Dia_de_semana: number;
  Hora_inicio: string;
  Hora_fin: string;
  Especialidad_Id: number;
  Duracion: number;
  Sucursal_Id: number;
}

/**
 * Estructura de datos que la API devuelve para un registro de agenda regular.
 * Coincide con el esquema 'AgendaRegularOut' de FastAPI.
 */
export interface AgendaRegularOut {
  Medico_Matricula: string;
  Especialidad_Id: number;
  Dia_de_semana: number;
  Hora_inicio: string;
  Hora_fin: string;
  Duracion: number;
  Sucursal_Id: number;
}

/**
 * Identificador único para eliminar un registro específico de agenda regular.
 */
export interface AgendaRegularId {
  Especialidad_Id: number;
  Dia_de_semana: number;
  Hora_inicio: string;
}


// --- INTERFACES PARA AGENDA EXCEPCIONAL ---

/**
 * Estructura de datos para crear una excepción en la agenda.
 * Coincide con el esquema 'AgendaExcepcionalCreate' de FastAPI.
 */
export interface AgendaExcepcionalPayload {
  tipo_excepcion: 'availability' | 'non-availability';
  fecha_inicio: string; // Formato ISO: "YYYY-MM-DDTHH:mm:ss"
  fecha_fin: string;    // Formato ISO: "YYYY-MM-DDTHH:mm:ss"
  motivo?: string;
}

/**
 * Estructura de datos que la API devuelve al crear una excepción.
 * Coincide con el esquema 'AgendaExcepcionalOut' de FastAPI.
 */
export interface AgendaExcepcionalOut {
  id: number;
  medico_matricula: string;
  tipo_excepcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo?: string;
}

// --- SERVICIOS ---

/**
 * Obtiene todos los horarios de la agenda regular de un médico específico.
 * @param matricula - La matrícula del médico.
 * @returns Una promesa que se resuelve con la lista de horarios regulares.
 */
export const getAgendasRegulares = async (matricula: string): Promise<AgendaRegularOut[]> => {
  const response = await fetch(`${API_BASE_URL}/medicos/${matricula}/agenda/regular`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Error al obtener la agenda regular' }));
    throw new Error(errorData.detail);
  }

  return response.json();
};

/**
 * Registra una nueva agenda regular para un médico.
 * @param matricula - La matrícula del médico.
 * @param payload - Los datos de la agenda regular a crear.
 * @returns Una promesa que se resuelve con los datos de la agenda creada.
 */
export const registrarAgendaRegular = async (
  matricula: string, 
  payload: AgendaRegularPostEntry
): Promise<any> => {
  
  const response = await fetch(`${API_BASE_URL}/medicos/${matricula}/agenda/regular`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Error al registrar la agenda regular' }));
    throw new Error(errorData.detail);
  }

  return response.json();
};

/**
 * Registra una nueva excepción en la agenda de un médico.
 * @param matricula - La matrícula del médico.
 * @param payload - Los datos de la excepción a crear.
 * @returns Una promesa que se resuelve con los datos de la excepción creada.
 */
export const registrarAgendaExcepcional = async (matricula: string, payload: AgendaExcepcionalPayload): Promise<AgendaExcepcionalOut> => {
  const response = await fetch(`${API_BASE_URL}/medicos/${matricula}/agenda/excepcional`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Error al registrar la excepción' }));
    throw new Error(errorData.detail);
  }

  return response.json();
};

/**
 * Elimina un registro específico de la agenda regular de un médico.
 * Usa query params para enviar la clave compuesta, como lo infiere la firma de la función en FastAPI.
 * @param matricula - La matrícula del médico.
 * @param id - El identificador compuesto del horario a eliminar.
 */
export const eliminarAgendaRegular = async (matricula: string, id: AgendaRegularId): Promise<void> => {
  // Construimos los parámetros de consulta (query params) para la URL
  const queryParams = new URLSearchParams({
    especialidad_id: String(id.Especialidad_Id),
    dia_de_semana: String(id.Dia_de_semana),
    hora_inicio: id.Hora_inicio,
  });

  // El path param {agenda_id} en la API parece ser un placeholder no utilizado,
  // por lo que lo reemplazamos con un valor genérico como 'item' o '0'.
  // Lo importante son los query params que sí lee la función del backend.
  const response = await fetch(
    `${API_BASE_URL}/medicos/${matricula}/agenda/regular/item?${queryParams}`,
    {
      method: 'DELETE',
    }
  );

  // Un status 204 (No Content) es una respuesta exitosa para DELETE
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Error al eliminar el horario' }));
    throw new Error(errorData.detail);
  }
};