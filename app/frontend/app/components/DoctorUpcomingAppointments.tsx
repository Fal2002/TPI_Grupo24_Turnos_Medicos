// components/DoctorUpcomingAppointments.tsx

'use client';

import Link from 'next/link';
import { Clock, User, ChevronRight, Calendar, FileText } from 'lucide-react';

type Appointment = {
  id: number;
  patientName: string;
  specialty: string; // Necesario para filtrar
  date: string; // Formato ISO YYYY-MM-DD
  time: string;
  reason: string;
};

// DATOS FALSOS (Mock Data)
const mockAppointments: Appointment[] = [
  { id: 1, patientName: 'Carlos Sánchez', specialty: 'Cardiología', date: '2025-11-18', time: '10:30', reason: 'Control anual' },
  { id: 2, patientName: 'Maria Rodriguez', specialty: 'Cardiología', date: '2025-11-18', time: '11:00', reason: 'Dolor en el pecho' },
  { id: 3, patientName: 'Lucia Fernández', specialty: 'Clínica General', date: '2025-11-18', time: '09:00', reason: 'Chequeo de rutina' },
  { id: 4, patientName: 'Pedro Gómez', specialty: 'Cardiología', date: '2025-11-19', time: '14:30', reason: 'Resultados estudios' },
  { id: 5, patientName: 'Ana Perez', specialty: 'Clínica General', date: '2025-11-19', time: '10:00', reason: 'Consulta por gripe' },
];

export default function DoctorUpcomingAppointments({ activeSpecialty }: { activeSpecialty: string }) {
  // 1. Filtramos por la especialidad seleccionada en el Sidebar
  // 2. Ordenamos por fecha y hora
  // 3. Tomamos solo los primeros 3 o 4 para no saturar el widget
  const filteredAppointments = mockAppointments
    .filter(app => app.specialty === activeSpecialty)
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
    .slice(0, 4); // Mostrar solo los próximos 4

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    // Si es hoy, mostrar "Hoy"
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Hoy';
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Próximos Pacientes
        </h2>
        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
          {activeSpecialty}
        </span>
      </div>

      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="block p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800 flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    {app.patientName}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2 mt-1 ml-6">
                    <FileText size={12} />
                    {app.reason}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800 flex items-center justify-end gap-1">
                    <Clock size={14} />
                    {app.time}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(app.date)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No tienes turnos próximos para esta especialidad.</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-right">
        <Link
          href="/medico/turnos"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline"
        >
          Ir a la agenda completa <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}