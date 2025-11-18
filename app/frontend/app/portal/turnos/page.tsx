// app/turnos/page.tsx

import AppointmentList from '../../components/AppointmentList'; // Ajusta la ruta si es necesario

// Este es un Componente de Servidor, ideal para el layout de la página
export default function MisTurnosPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mis Turnos</h1>
        <p className="text-gray-500 mt-1">
          Aquí puedes ver el historial de tus turnos programados y cancelarlos si es necesario.
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <AppointmentList />
      </main>
    </div>
  );
}