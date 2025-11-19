// app/medico/agenda/page.tsx

'use client'; // Sigue siendo un Componente de Cliente para usar hooks

import AgendaManager from '../../components/AgendaManager';
// 1. Importamos nuestro hook personalizado
import { useSpecialty } from '../../contexts/SpecialtyContext'; // Ajusta la ruta

export default function AgendaPage() {
  // 2. Leemos el valor del contexto
  const { activeSpecialty } = useSpecialty();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestionar Mi Agenda</h1>
        <p className="text-gray-500 mt-1">
          Define tus horarios de trabajo habituales y programa cualquier excepción.
        </p>
      </header>
      <main>
        {/* 3. Pasamos el valor como prop, igual que antes */}
        <AgendaManager activeSpecialty={activeSpecialty} />
      </main>
    </div>
  );
}