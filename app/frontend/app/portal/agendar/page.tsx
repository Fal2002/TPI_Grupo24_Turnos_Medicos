// app/turnos/nuevo/page.tsx

import AppointmentScheduler from '../../components/AppointmentScheduler';
import { headers } from 'next/headers';
import { getPacienteByUserId } from '@/services/pacientes';

// Componente de Servidor para el layout
export default async function AgendarTurnoPage() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  let patientId: number | null = null;

  if (userId) {
    try {
      const paciente = await getPacienteByUserId(userId);
      patientId = paciente.nroPaciente;
    } catch (error) {
      console.error("Error fetching patient:", error);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">Agendar Nuevo Turno</h1>
        <p className="text-gray-500 mt-1">
          Sigue los pasos para encontrar y confirmar tu próxima cita.
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <AppointmentScheduler patientId={patientId} />
      </main>
    </div>
  );
}