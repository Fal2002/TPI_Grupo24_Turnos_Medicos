// app/medico/turnos/page.tsx

'use client'; // Necesita ser un Componente de Cliente para leer el contexto

import DoctorAppointments from '../../components/DoctorAppointments'; // Ajusta la ruta si es necesario
import { useSpecialty } from '../../contexts/SpecialtyContext'; // Usamos el contexto sin dependencias

export default function MedicoTurnosPage() {
  // Leemos la especialidad activa del contexto
  const { activeSpecialty } = useSpecialty();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis Turnos de <span className="text-blue-600">{activeSpecialty}</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Gestiona tus citas programadas, actualiza su estado y añade información clínica.
        </p>
      </header>

      <main>
        {/* Pasamos la especialidad activa al componente que mostrará los turnos */}
        <DoctorAppointments activeSpecialty={activeSpecialty} />
      </main>
    </div>
  );
}