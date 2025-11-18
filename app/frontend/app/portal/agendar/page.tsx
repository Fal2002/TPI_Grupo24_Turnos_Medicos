// app/turnos/nuevo/page.tsx

import AppointmentScheduler from '../../components/AppointmentScheduler'; // Ajusta la ruta si es necesario

// Componente de Servidor para el layout
export default function AgendarTurnoPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">Agendar Nuevo Turno</h1>
        <p className="text-gray-500 mt-1">
          Sigue los pasos para encontrar y confirmar tu próxima cita.
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <AppointmentScheduler />
      </main>
    </div>
  );
}