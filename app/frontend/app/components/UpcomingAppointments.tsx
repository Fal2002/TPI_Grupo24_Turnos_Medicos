// components/UpcomingAppointments.tsx

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// En una aplicación real, obtendrías estos datos de tu API.
const appointments = [
  {
    id: 1,
    specialty: 'Cardiología',
    doctor: 'Dr. Juan Morales',
    date: '25 Oct, 2023',
    time: '10:30 AM',
    href: '/turnos/1', // Ruta al detalle del turno
  },
  {
    id: 2,
    specialty: 'Dermatología',
    doctor: 'Dra. Ana Torres',
    date: '28 Oct, 2023',
    time: '04:00 PM',
    href: '/turnos/2',
  },
  {
    id: 3,
    specialty: 'Queca',
    doctor: 'Dra. Ana Torres',
    date: '28 Oct, 2023',
    time: '04:00 PM',
    href: '/turnos/2',
  },
];

// Este puede ser un Componente de Servidor, ya que solo muestra datos.
export default function UpcomingAppointments() {
  return (
    // Contenedor principal del widget con estilos de tarjeta
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Próximos Turnos
      </h2>

      {/* Lista de turnos */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Link
            key={appointment.id}
            href={appointment.href}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border"
          >
            <div>
              <h3 className="font-semibold text-blue-600">{appointment.specialty}</h3>
              <p className="text-sm text-gray-700">{appointment.doctor}</p>
              <p className="text-sm text-gray-500">{`${appointment.date} - ${appointment.time}`}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>
        ))}
      </div>

      {/* Enlace para ver todos los turnos */}
      <div className="mt-6 text-right">
        <Link
          href="/turnos"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Ver todos los turnos
        </Link>
      </div>
    </div>
  );
}