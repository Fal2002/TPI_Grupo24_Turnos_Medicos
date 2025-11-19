// app/medico/pacientes/page.tsx

'use client'; // Necesita ser un Componente de Cliente para leer el contexto

import PatientList from '../../components/PatientList'; // Ajusta la ruta si es necesario
import { useSpecialty } from '../../contexts/SpecialtyContext'; // Usamos el contexto para el filtro

export default function MedicoPacientesPage() {
  // Leemos la especialidad activa para pasarla como filtro
  const { activeSpecialty } = useSpecialty();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis Pacientes de <span className="text-blue-600">{activeSpecialty}</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Busca y consulta la información de tus pacientes.
        </p>
      </header>

      <main>
        {/* Pasamos la especialidad activa como prop para que el componente filtre la lista */}
        <PatientList activeSpecialty={activeSpecialty} />
      </main>
    </div>
  );
}