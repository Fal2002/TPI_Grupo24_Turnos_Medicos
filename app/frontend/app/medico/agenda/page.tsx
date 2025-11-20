'use client';

import AgendaManager from '@/app/components/AgendaManager'; // Ajusta la ruta a tu componente
import { useMedico } from '@/app/contexts/MedicoContext';   // Ajusta la ruta a tu contexto

export default function AgendaPage() {
  // Leemos los datos centralizados desde el contexto
  const { medico, activeSpecialty } = useMedico();

  // Mostramos un estado de carga mientras los datos del contexto se resuelven
  if (!medico || !activeSpecialty) {
    return <div>Cargando agenda...</div>;
  }

  // Una vez que tenemos los datos, renderizamos AgendaManager con las props necesarias
  return (
    <AgendaManager
      medicoMatricula={medico.Matricula}
      activeSpecialtyId={activeSpecialty.Id_especialidad}
      activeSpecialtyName={activeSpecialty.descripcion}
    />
  );
}