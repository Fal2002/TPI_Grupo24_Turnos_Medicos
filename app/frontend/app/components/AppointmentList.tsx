// components/AppointmentList.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Stethoscope, Building, Trash2, Check } from 'lucide-react';
import { usePaciente } from '../contexts/PacienteConetxt';
import { getTurnosPorPaciente, cambiarEstadoTurno } from '@/services/turnos';
import { getMedicos } from '@/services/medicos';
import { getEspecialidades } from '@/services/especialidades';

type AppointmentStatus = 'Confirmado' | 'Pendiente' | 'Anunciado' | 'Atendido' | 'Finalizado' | 'Cancelado' | 'Ausente';

type Appointment = {
  Fecha: string;
  Hora: string;
  estado: AppointmentStatus;
  Especialidad_Id: string;
  Especialidad_Descripcion: string;
  Medico_Matricula: string;
  Medico_Nombre: string;
  Medico_Apellido: string;
};

const statusStyles: Record<AppointmentStatus, { container: string; badge: string }> = {
  Confirmado: { container: 'border-blue-500', badge: 'bg-blue-100 text-blue-800' },
  Pendiente: { container: 'border-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
  Anunciado: { container: 'border-cyan-500', badge: 'bg-cyan-100 text-cyan-800' },
  Atendido: { container: 'border-teal-500', badge: 'bg-teal-100 text-teal-800' },
  Finalizado: { container: 'border-green-500', badge: 'bg-green-100 text-green-800' },
  Cancelado: { container: 'border-gray-400', badge: 'bg-gray-200 text-gray-800' },
  Ausente: { container: 'border-red-500', badge: 'bg-red-100 text-red-800' },
};

// 🔥 Función para saber si la fecha del turno es HOY
const isToday = (fecha: string) => {
  const hoy = new Date();
  const f = new Date(fecha + "T00:00:00");
  return (
    f.getFullYear() === hoy.getFullYear() &&
    f.getMonth() === hoy.getMonth() &&
    f.getDate() === hoy.getDate()
  );
};

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { paciente } = usePaciente();
  const [medicos, setMedicos] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);

  // Cargar médicos y especialidades
  useEffect(() => {
    const fetchMedicosYEspecialidades = async () => {
      try {
        const [medicosData, especialidadesData] = await Promise.all([getMedicos(), getEspecialidades()]);
        setMedicos(medicosData);
        setEspecialidades(especialidadesData);
      } catch (error) {
        console.error("Error fetching medicos or especialidades:", error);
      }
    };

    fetchMedicosYEspecialidades();
  }, []);

  // Cargar turnos
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        if (paciente) {
          const turnos = await getTurnosPorPaciente(paciente.nroPaciente);

          // Enriquecer datos
          let enriched = turnos.map((turno: any) => ({
            ...turno,
            Medico_Nombre: medicos.find(med => med.Matricula === turno.Medico_Matricula)?.Nombre || 'Desconocido',
            Medico_Apellido: medicos.find(med => med.Matricula === turno.Medico_Matricula)?.Apellido || 'Desconocido',
            Especialidad_Descripcion: especialidades.find(esp => esp.Id_especialidad === turno.Especialidad_Id)?.descripcion || 'Desconocida',
          }));

          // Ordenar por fecha
          enriched = enriched.sort(
            (a: Appointment, b: Appointment) =>
              new Date(`${a.Fecha}T${a.Hora}`).getTime() -
              new Date(`${b.Fecha}T${b.Hora}`).getTime()
          );

          setAppointments(enriched);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [paciente, medicos, especialidades]);

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = new Date();
    const upcoming: Appointment[] = [];
    const past: Appointment[] = [];

    appointments.forEach(app =>
      new Date(`${app.Fecha}T${app.Hora}`) >= now ? upcoming.push(app) : past.push(app)
    );

    upcoming.sort((a, b) => new Date(`${a.Fecha}T${a.Hora}`).getTime() - new Date(`${b.Fecha}T${b.Hora}`).getTime());
    past.sort((a, b) => new Date(`${b.Fecha}T${b.Hora}`).getTime() - new Date(`${a.Fecha}T${a.Hora}`).getTime());

    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [appointments]);

  const formatDateTime = (isoString: string) => {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(isoString));
  };

  const handleOpenModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (selectedAppointment) {
      try {
        await cambiarEstadoTurno(
          { fecha: selectedAppointment.Fecha, hora: selectedAppointment.Hora, paciente_nro: paciente!.nroPaciente },
          'cancelar'
        );
      } catch (error) {
        console.error("Error canceling appointment:", error);
      } finally {
        handleCloseModal();
        window.location.reload();
      }
    }
  };

  // 🔥 Nueva función para CONFIRMAR turno
  const handleConfirmAppointment = async (appointment: Appointment) => {
    try {
      await cambiarEstadoTurno(
        { fecha: appointment.Fecha, hora: appointment.Hora, paciente_nro: paciente!.nroPaciente },
        'confirmar'
      );
      window.location.reload();
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando turnos...</div>;

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const styles = statusStyles[appointment.estado] || { container: 'border-gray-200', badge: 'bg-gray-100 text-gray-800' };
    const canBeCancelled = ['Confirmado', 'Pendiente'].includes(appointment.estado);

    return (
      <div className={`p-5 rounded-lg shadow-md border-l-4 flex flex-col md:flex-row md:items-center md:justify-between transition-all ${styles.container} ${appointment.estado === 'Cancelado' || appointment.estado === 'Finalizado' ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-800">{appointment.Especialidad_Descripcion}</h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles.badge}`}>{appointment.estado}</span>
          </div>

          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Stethoscope size={16} /> {`${appointment.Medico_Nombre} ${appointment.Medico_Apellido}`}
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <Calendar size={16} /> {formatDateTime(`${appointment.Fecha}T${appointment.Hora}`)}
            </p>
          </div>
        </div>

        {/* 🔥 BOTÓN CANCELAR */}
        {new Date(`${appointment.Fecha}T${appointment.Hora}`) >= new Date() && canBeCancelled && (
          <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
            <button
              onClick={() => handleOpenModal(appointment)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-md hover:bg-red-200"
            >
              <Trash2 size={16} /> Cancelar Turno
            </button>
          </div>
        )}

        {/* 🔥 BOTÓN CONFIRMAR — SOLO SI ES HOY Y ESTÁ PENDIENTE */}
        {isToday(appointment.Fecha) && appointment.estado === 'Pendiente' && (
          <div className="mt-4 md:mt-0 md:ml-3 flex-shrink-0">
            <button
              onClick={() => handleConfirmAppointment(appointment)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 bg-green-100 rounded-md hover:bg-green-200"
            >
              <Check size={16} /> Confirmar
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10">

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          Turnos Agendados
        </h2>
        <div className="space-y-6">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(app => <AppointmentCard key={`${app.Fecha}T${app.Hora}`} appointment={app} />)
          ) : (
            <p className="text-gray-500">No tienes próximos turnos agendados.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          Historial de Turnos
        </h2>
        <div className="space-y-6">
          {pastAppointments.length > 0 ? (
            pastAppointments.map(app => <AppointmentCard key={`${app.Fecha}T${app.Hora}`} appointment={app} />)
          ) : (
            <p className="text-gray-500">Aún no tienes un historial de turnos.</p>
          )}
        </div>
      </section>

      {/* MODAL DE CANCELACIÓN */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-2">Confirmar Cancelación</h2>
            <p className="text-gray-600 mb-4">
              ¿Seguro que deseas cancelar tu turno?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 rounded-md text-gray-800 bg-gray-200 hover:bg-gray-300 font-semibold"
              >
                No, volver
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-6 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 font-semibold"
              >
                Sí, cancelar turno
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
