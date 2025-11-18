// app/medico/agenda/page.tsx

import AgendaManager from '../../components/AgendaManager'; // Ajusta la ruta si es necesario

// Este es un Componente de Servidor, óptimo para el layout.
export default function AgendaPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestionar Mi Agenda</h1>
        <p className="text-gray-500 mt-1">
          Define tus horarios de trabajo habituales y programa cualquier excepción.
        </p>
      </header>

      <main>
        <AgendaManager />
      </main>
    </div>
  );
}