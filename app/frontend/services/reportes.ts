// services/reportes.ts

const API_URL = "http://localhost:8000/api/reportes/reportes";

export interface ReportParams {
    type: 'medico' | 'especialidad' | 'atendidos' | 'asistencias';
    start_date: string; // YYYY-MM-DD format
    end_date: string;   // YYYY-MM-DD format
}

export interface ReportResponse {
    title: string;
    periodo: string;
    total_registros: number;
    data: any[];
    summary?: {
        asistencia_porcentaje?: string;
        inasistencia_porcentaje?: string;
        mensaje?: string;
    };
}

/**
 * Genera un reporte según el tipo y rango de fechas especificado
 */
export async function generateReport(params: ReportParams): Promise<ReportResponse> {
    const queryParams = new URLSearchParams({
        type: params.type,
        start_date: params.start_date,
        end_date: params.end_date,
    });

    const res = await fetch(`${API_URL}?${queryParams.toString()}`);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al generar el reporte");
    }

    return res.json();
}

/**
 * Formatea una fecha de Date a string YYYY-MM-DD
 */
export function formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Obtiene la fecha de hace N días
 */
export function getDaysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}
