// app/medico/agenda/page.tsx

'use client';

import DoctorUpcomingAppointments from '../components/DoctorUpcomingAppointments'; // Importamos el nuevo componente
import { useMedico } from '../contexts/MedicoContext';

export default function AgendaPage() {
  const { activeSpecialty } = useMedico();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
        <p className="text-gray-500 mt-1">
          Gestionando agenda para: <span className="font-semibold text-blue-600">{activeSpecialty?.descripcion || '...'}</span>
        </p>
      </header>

      {/* Grid Layout: 3 columnas para el contenido principal, 1 para la barra lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        
        {/* Columna Derecha (Más angosta): Los próximos turnos */}
        <div className="lg:col-span-6">
          {activeSpecialty && (
            <DoctorUpcomingAppointments activeSpecialty={activeSpecialty.descripcion} />
          )}
        </div>

      </div>
    </div>
  );
}