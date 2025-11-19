// components/PatientList.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, User, Calendar, Fingerprint, HeartPulse } from 'lucide-react';

// --- Tipos de Datos ---
type Patient = {
  id: number;
  name: string;
  dni: string;
  lastVisit: string | null;
  nextAppointment: string | null;
  // Un paciente puede estar asociado a un médico por varias especialidades
  associatedSpecialties: string[];
};

// --- Datos Falsos (Mock Data) - Reemplazar con llamada a la API ---
const mockPatients: Patient[] = [
  { id: 101, name: 'Carlos Sánchez', dni: '25.123.456', lastVisit: '2025-08-15', nextAppointment: '2025-12-20', associatedSpecialties: ['Cardiología'] },
  { id: 102, name: 'Maria Rodriguez', dni: '30.987.654', lastVisit: '2025-06-10', nextAppointment: '2025-12-20', associatedSpecialties: ['Cardiología'] },
  { id: 103, name: 'Lucia Fernández', dni: '35.456.789', lastVisit: '2025-11-01', nextAppointment: '2025-12-21', associatedSpecialties: ['Clínica General'] },
  { id: 104, name: 'Pedro Gómez', dni: '22.789.123', lastVisit: '2025-10-01', nextAppointment: null, associatedSpecialties: ['Cardiología'] },
  { id: 105, name: 'Ana Perez', dni: '40.123.456', lastVisit: null, nextAppointment: '2025-12-22', associatedSpecialties: ['Clínica General'] },
  { id: 106, name: 'Lucia Martinez', dni: '33.555.888', lastVisit: '2025-05-20', nextAppointment: null, associatedSpecialties: ['Clínica General'] },
];

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

// --- Componente Principal ---
export default function PatientList({ activeSpecialty }: { activeSpecialty: string }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simula la carga de datos
    setTimeout(() => {
      setPatients(mockPatients);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filtra los pacientes por especialidad y por término de búsqueda
  const filteredPatients = useMemo(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    return patients
      .filter(patient => 
        // 1. Filtro por especialidad
        patient.associatedSpecialties.includes(activeSpecialty)
      )
      .filter(patient =>
        // 2. Filtro por búsqueda (nombre o DNI)
        patient.name.toLowerCase().includes(lowercasedSearch) ||
        patient.dni.replace(/\./g, '').includes(lowercasedSearch)
      );
  }, [patients, activeSpecialty, searchTerm]);

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
          placeholder="Buscar por nombre o DNI..."
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
                    DNI: {patient.dni}
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