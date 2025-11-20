// components/UpcomingAppointments.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { usePaciente } from '../contexts/PacienteConetxt';
import { getTurnosPorPaciente, TurnoOut } from '@/services/turnos';

export default function UpcomingAppointments() {
  const { paciente } = usePaciente();
  const [appointments, setAppointments] = useState<TurnoOut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (paciente?.nroPaciente) {
        try {
          const data = await getTurnosPorPaciente(paciente.nroPaciente);
          
          // Filtrar turnos futuros (o del día)
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const upcoming = data.filter((t: TurnoOut) => {
             // Asumiendo formato YYYY-MM-DD y HH:MM
             const turnoDate = new Date(`${t.Fecha}T${t.Hora}`);
             return turnoDate >= today;
          });
          
          // Ordenar por fecha y hora
          upcoming.sort((a: TurnoOut, b: TurnoOut) => {
             return new Date(`${a.Fecha}T${a.Hora}`).getTime() - new Date(`${b.Fecha}T${b.Hora}`).getTime();
          });

          // Mostrar solo los próximos 3
          setAppointments(upcoming.slice(0, 3));
        } catch (error) {
          console.error("Error fetching appointments:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [paciente]);

  if (loading) {
    return <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">Cargando turnos...</div>;
  }

  if (!paciente) {
    return null; // O un mensaje de que debe iniciar sesión
  }

  return (
    // Contenedor principal del widget con estilos de tarjeta
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Próximos Turnos
      </h2>

      {/* Lista de turnos */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Link
              key={`${appointment.Fecha}-${appointment.Hora}`}
              href="/portal/turnos" // Por ahora redirige a la lista completa
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border"
            >
              <div>
                <h3 className="font-semibold text-blue-600">
                  {appointment.especialidad_descripcion || 'Especialidad'}
                </h3>
                <p className="text-sm text-gray-700">
                  Dr. {appointment.medico_nombre} {appointment.medico_apellido}
                </p>
                <p className="text-sm text-gray-500">
                  {`${appointment.Fecha} - ${appointment.Hora}`}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No tienes turnos próximos agendados.</p>
        )}
      </div>

      {/* Enlace para ver todos los turnos */}
      <div className="mt-6 text-right">
        <Link
          href="/portal/turnos"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Ver todos los turnos
        </Link>
      </div>
    </div>
  );
}