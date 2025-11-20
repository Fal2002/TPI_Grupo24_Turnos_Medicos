// components/DoctorUpcomingAppointments.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, User, ChevronRight, FileText } from 'lucide-react';
import { useMedico } from '../contexts/MedicoContext';
import { getTurnosPorMedico } from '@/services/turnos';
import { getPacienteByNumero } from '@/services/pacientes';

type Appointment = {
  id: string;
  patientName: string;
  specialty: string;
  date: string; // Formato ISO YYYY-MM-DD
  time: string;
  reason: string;
};

export default function DoctorUpcomingAppointments({ activeSpecialty: activeSpecialtyName }: { activeSpecialty: string }) {
  const { medico, activeSpecialty } = useMedico();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!medico || !activeSpecialty) return;
      
      setIsLoading(true);
      try {
        const turnos = await getTurnosPorMedico(medico.Matricula);
        
        const now = new Date();
        
        // 1. Filtrar por especialidad, estado y fecha futura
        const upcomingTurnos = turnos.filter((t: any) => {
          // Filtro por especialidad
          if (t.Especialidad_Id !== activeSpecialty.Id_especialidad) return false;
          
          // Filtro por estado (solo activos)
          const validStates = ['Pendiente', 'Confirmado', 'Atendido'];
          // Nota: El backend puede devolver 'Atendido' o 'Atendiendo', ajustar según corresponda.
          // Asumimos que el backend devuelve el estado en la propiedad 'estado' o 'Estado_Id' mapeado.
          // En DoctorAppointments.tsx se usa t.estado.
          if (!validStates.includes(t.estado)) return false;

          // Filtro por fecha (Futuro o Hoy pero hora futura)
          const turnoDate = new Date(`${t.Fecha}T${t.Hora}`);
          // Permitimos turnos de hoy que aún no han pasado (o con un margen)
          // Para simplificar, mostramos todos los de hoy en adelante que no estén finalizados
          return turnoDate >= now || t.Fecha === now.toISOString().split('T')[0];
        });

        // 2. Ordenar por fecha y hora
        upcomingTurnos.sort((a: any, b: any) => {
          return new Date(`${a.Fecha}T${a.Hora}`).getTime() - new Date(`${b.Fecha}T${b.Hora}`).getTime();
        });

        // 3. Tomar los primeros 4
        const nextTurnos = upcomingTurnos.slice(0, 4);

        // 4. Enriquecer con datos del paciente
        const enrichedAppointments = await Promise.all(nextTurnos.map(async (t: any) => {
          try {
            const paciente = await getPacienteByNumero(t.Paciente_nroPaciente);
            return {
              id: `${t.Fecha}-${t.Hora}-${t.Paciente_nroPaciente}`,
              patientName: `${paciente.Nombre} ${paciente.Apellido}`,
              specialty: activeSpecialty.descripcion,
              date: t.Fecha,
              time: t.Hora,
              reason: t.Motivo || 'Sin motivo especificado'
            };
          } catch (error) {
            console.error(`Error fetching paciente ${t.Paciente_nroPaciente}`, error);
            return {
              id: `${t.Fecha}-${t.Hora}-${t.Paciente_nroPaciente}`,
              patientName: 'Paciente Desconocido',
              specialty: activeSpecialty.descripcion,
              date: t.Fecha,
              time: t.Hora,
              reason: t.Motivo || 'Sin motivo'
            };
          }
        }));

        setAppointments(enrichedAppointments);
      } catch (error) {
        console.error("Error fetching upcoming appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [medico, activeSpecialty]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00'); // Asegurar interpretación local
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) return 'Hoy';
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (isLoading) return <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 h-full flex items-center justify-center">Cargando...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Próximos Pacientes
        </h2>
        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
          {activeSpecialty?.descripcion || activeSpecialtyName}
        </span>
      </div>

      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((app) => (
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