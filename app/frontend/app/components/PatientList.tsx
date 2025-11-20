// components/PatientList.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, User, Calendar, Fingerprint, HeartPulse } from 'lucide-react';
import { useMedico } from '../contexts/MedicoContext';
import { getPacientesPorMedico } from '@/services/pacientes';

// --- Tipos de Datos ---
type Patient = {
  id: number;
  name: string;
  dni: string; // Usaremos nroPaciente como identificador visual por ahora
  lastVisit: string | null;
  nextAppointment: string | null;
  // Un paciente puede estar asociado a un médico por varias especialidades
  associatedSpecialties: string[];
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  // Asumimos formato YYYY-MM-DD que viene del backend
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// --- Componente Principal ---
export default function PatientList({ activeSpecialty }: { activeSpecialty: string }) {
  const { medico, activeSpecialty: activeSpecialtyObj } = useMedico();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
        if (!medico || !activeSpecialtyObj) return;
        setIsLoading(true);
        try {
            const data = await getPacientesPorMedico(medico.Matricula, activeSpecialtyObj.Id_especialidad);
            // Mapear los datos de la API al formato del componente
            const mappedPatients: Patient[] = data.map((p: any) => ({
                id: p.nroPaciente,
                name: `${p.Nombre} ${p.Apellido}`,
                dni: p.nroPaciente.toString(), // El modelo no tiene DNI, usamos nroPaciente
                lastVisit: p.UltimaVisita, // Viene del backend
                nextAppointment: p.ProximoTurno, // Viene del backend
                associatedSpecialties: [] // No disponible en este endpoint
            }));
            setPatients(mappedPatients);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchPatients();
  }, [medico, activeSpecialtyObj]);

  // Filtra los pacientes por especialidad y por término de búsqueda
  const filteredPatients = useMemo(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    return patients
      .filter(patient =>
        // 2. Filtro por búsqueda (nombre o DNI)
        patient.name.toLowerCase().includes(lowercasedSearch) ||
        patient.dni.includes(lowercasedSearch)
      );
  }, [patients, searchTerm]);

  if (isLoading) return <div>Cargando pacientes...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      {/* Barra de Búsqueda */}
      <div className="relative mb-6">
        <label htmlFor="search-patient" className="sr-only">Buscar paciente</label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          id="search-patient"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o Nro Paciente..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Lista de Pacientes */}
      <div className="space-y-4">
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <Link 
              key={patient.id}
              href={`/medico/pacientes`} // Enlace a la página de detalle del paciente
              className="block p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 hover:border-blue-500 transition-all"
            >
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <p className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <User size={20} className="text-blue-600" />
                    {patient.name}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <Fingerprint size={16} />
                    Nro: {patient.dni}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 text-left sm:text-right">
                   <p className="text-sm text-gray-600 flex items-center sm:justify-end gap-2">
                     <HeartPulse size={16} />
                     Última visita: {formatDate(patient.lastVisit)}
                   </p>
                   <p className="text-sm text-gray-600 flex items-center sm:justify-end gap-2 mt-1">
                     <Calendar size={16} />
                     Próximo turno: {formatDate(patient.nextAppointment)}
                   </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No se encontraron pacientes que coincidan con la búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}