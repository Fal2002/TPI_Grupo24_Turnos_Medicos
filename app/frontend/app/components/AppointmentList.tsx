// components/AppointmentList.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Stethoscope, Building, Trash2 } from 'lucide-react';

type AppointmentStatus = 'Confirmado' | 'Pendiente' | 'Anunciado' | 'Atendiendo' | 'Finalizado' | 'Cancelado' | 'Ausente';

type Appointment = {
  id: number;
  specialty: string;
  doctor: string;
  branch: string;
  dateTime: string;
  status: AppointmentStatus;
};

const mockAppointments: Appointment[] = [
  { id: 1, specialty: 'Cardiología', doctor: 'Dr. Juan Morales', branch: 'Sucursal Centro', dateTime: '2025-12-10T10:30:00', status: 'Confirmado' },
  { id: 2, specialty: 'Dermatología', doctor: 'Dra. Ana Torres', branch: 'Sucursal Norte', dateTime: '2025-12-15T16:00:00', status: 'Pendiente' },
  { id: 3, specialty: 'Revisión General', doctor: 'Dr. Carlos Ruiz', branch: 'Sucursal Centro', dateTime: '2025-10-05T09:00:00', status: 'Finalizado' },
  { id: 4, specialty: 'Oftalmología', doctor: 'Dra. Laura Gómez', branch: 'Sucursal Sur', dateTime: '2025-09-12T11:15:00', status: 'Cancelado' },
  { id: 5, specialty: 'Pediatría', doctor: 'Dra. Sofia Martin', branch: 'Sucursal Norte', dateTime: '2025-08-20T14:00:00', status: 'Ausente' },
];

const statusStyles: Record<AppointmentStatus, { container: string; badge: string }> = {
  Confirmado: { container: 'border-blue-500', badge: 'bg-blue-100 text-blue-800' },
  Pendiente: { container: 'border-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
  Anunciado: { container: 'border-cyan-500', badge: 'bg-cyan-100 text-cyan-800' },
  Atendiendo: { container: 'border-teal-500', badge: 'bg-teal-100 text-teal-800' },
  Finalizado: { container: 'border-green-500', badge: 'bg-green-100 text-green-800' },
  Cancelado: { container: 'border-gray-400', badge: 'bg-gray-200 text-gray-800' },
  Ausente: { container: 'border-red-500', badge: 'bg-red-100 text-red-800' },
};

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setAppointments(mockAppointments);
      setIsLoading(false);
    }, 500);
  }, []);

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = new Date();
    const upcoming: Appointment[] = [];
    const past: Appointment[] = [];
    appointments.forEach(app => new Date(app.dateTime) >= now ? upcoming.push(app) : past.push(app));
    upcoming.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    past.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [appointments]);

  const formatDateTime = (isoString: string) => {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isoString));
  };

  // --- INICIO DE LA CORRECCIÓN ---
  // Rellenamos la lógica que faltaba en estas funciones

  const handleOpenModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;

    // Lógica de simulación para actualizar la UI
    setAppointments(
      appointments.map((app) =>
        app.id === selectedAppointment.id ? { ...app, status: 'Cancelado' } : app
      )
    );

    // Cierra el modal
    handleCloseModal();
  };
  // --- FIN DE LA CORRECCIÓN ---

  if (isLoading) return <div className="text-center text-gray-500">Cargando turnos...</div>;

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const styles = statusStyles[appointment.status];
    const canBeCancelled = ['Confirmado', 'Pendiente'].includes(appointment.status);
    
    return (
        <div className={`p-5 rounded-lg shadow-md border-l-4 flex flex-col md:flex-row md:items-center md:justify-between transition-all ${styles.container} ${appointment.status === 'Cancelado' || appointment.status === 'Finalizado' ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-800">{appointment.specialty}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles.badge}`}>{appointment.status}</span>
            </div>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-2"><Stethoscope size={16} /> {appointment.doctor}</p>
              <p className="flex items-center gap-2"><Building size={16} /> {appointment.branch}</p>
              <p className="flex items-center gap-2 font-semibold"><Calendar size={16} /> {formatDateTime(appointment.dateTime)}</p>
            </div>
          </div>
           {new Date(appointment.dateTime) >= new Date() && canBeCancelled && (
             <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
               <button onClick={() => handleOpenModal(appointment)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-md hover:bg-red-200">
                 <Trash2 size={16} /> Cancelar Turno
               </button>
             </div>
           )}
        </div>
    );
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Turnos Agendados</h2>
        <div className="space-y-6">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)
          ) : (
            <p className="text-gray-500">No tienes próximos turnos agendados.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Historial de Turnos</h2>
        <div className="space-y-6">
          {pastAppointments.length > 0 ? (
            pastAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)
          ) : (
            <p className="text-gray-500">Aún no tienes un historial de turnos.</p>
          )}
        </div>
      </section>

      {/* El JSX del modal de confirmación, ahora funcionará correctamente */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-2">Confirmar Cancelación</h2>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que quieres cancelar tu turno de{' '}
              <span className="font-semibold">{selectedAppointment.specialty}</span> con{' '}
              <span className="font-semibold">{selectedAppointment.doctor}</span>?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={handleCloseModal} className="px-6 py-2 rounded-md text-gray-800 bg-gray-200 hover:bg-gray-300 font-semibold">
                No, volver
              </button>
              <button onClick={handleConfirmCancel} className="px-6 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 font-semibold">
                Sí, cancelar turno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}