// app/medicos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Plus, 
  Pencil, 
  Trash2, 
  Stethoscope, 
  MoreHorizontal,
  Hash, // Icono para matrícula
  User  // Icono para nombre
} from 'lucide-react';

// Tipos de datos
interface Especialidad {
  id: number;
  nombre: string;
}

interface Medico {
  id: number;
  matricula: number;
  nombre: string;
  apellido: string;
  especialidades: string[]; 
}

export default function MedicosPage() {
  // --- Estados de Datos ---
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Estados para Filtros (Separados) ---
  const [matriculaFilter, setMatriculaFilter] = useState('');
  const [nombreFilter, setNombreFilter] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // --- Simulación de carga de datos ---
  useEffect(() => {
    setTimeout(() => {
      const mockEspecialidades: Especialidad[] = [
        { id: 1, nombre: 'Cardiología' },
        { id: 2, nombre: 'Pediatría' },
        { id: 3, nombre: 'Dermatología' },
        { id: 4, nombre: 'Neurología' },
        { id: 5, nombre: 'Clínica Médica' },
      ];

      const mockMedicos: Medico[] = [
        { id: 1, matricula: 12345, nombre: 'Juan', apellido: 'Pérez', especialidades: ['Cardiología', 'Clínica Médica'] },
        { id: 2, matricula: 67890, nombre: 'María', apellido: 'Gómez', especialidades: ['Pediatría'] },
        { id: 3, matricula: 11223, nombre: 'Carlos', apellido: 'López', especialidades: ['Dermatología'] },
        { id: 4, matricula: 44556, nombre: 'Ana', apellido: 'Rodríguez', especialidades: ['Neurología', 'Pediatría'] },
        { id: 5, matricula: 99887, nombre: 'Roberto', apellido: 'Sánchez', especialidades: ['Cardiología'] },
      ];

      setEspecialidades(mockEspecialidades);
      setMedicos(mockMedicos);
      setLoading(false);
    }, 500);
  }, []);

  // --- Lógica de Filtrado Actualizada ---
  const filteredMedicos = medicos.filter((medico) => {
    // 1. Filtro por Matrícula (convertimos a string para comparar)
    const matchesMatricula = medico.matricula.toString().includes(matriculaFilter);

    // 2. Filtro por Nombre o Apellido
    const searchNameLower = nombreFilter.toLowerCase();
    const matchesNombre = 
      medico.nombre.toLowerCase().includes(searchNameLower) ||
      medico.apellido.toLowerCase().includes(searchNameLower);

    // 3. Filtro de Especialidad
    const matchesSpecialty = selectedSpecialty 
      ? medico.especialidades.includes(selectedSpecialty)
      : true;

    // Deben cumplirse TODAS las condiciones
    return matchesMatricula && matchesNombre && matchesSpecialty;
  });

  // --- Manejadores ---
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a este médico?')) {
      setMedicos(medicos.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Stethoscope className="text-blue-600" />
            Gestión de Médicos
          </h1>
          <p className="text-gray-500 text-sm mt-1">Administra el listado de profesionales y sus especialidades.</p>
        </div>
        
        <Link 
          href="/admin/medicos/nuevo"
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Médico
        </Link>
      </div>

      {/* Barra de Filtros (Grid ajustado para 3 filtros) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* 1. Filtro Matrícula */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Hash className="text-gray-400" size={16} />
          </div>
          <input
            type="text"
            placeholder="Matrícula"
            className="text-gray-700 w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            value={matriculaFilter}
            onChange={(e) => setMatriculaFilter(e.target.value)}
          />
        </div>

        {/* 2. Filtro Nombre/Apellido */}
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            className="text-gray-700 w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            value={nombreFilter}
            onChange={(e) => setNombreFilter(e.target.value)}
          />
        </div>

        {/* 3. Filtro Especialidad */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="text-gray-400" size={16} />
          </div>
          <select
            className="text-gray-700 w-full pl-9 pr-8 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white truncate"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="">Especialidad (Todas)</option>
            {especialidades.map((esp) => (
              <option key={esp.id} value={esp.nombre}>
                {esp.nombre}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <MoreHorizontal className="text-gray-400 rotate-90" size={14} />
          </div>
        </div>
        
        {/* Contador */}
        <div className="md:col-span-2 flex items-center justify-end text-sm text-gray-500">
          <strong>{filteredMedicos.length}</strong> &nbsp;resultado(s)
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Matrícula
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Médico
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Especialidades
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      Cargando datos...
                    </div>
                  </td>
                </tr>
              ) : filteredMedicos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron médicos que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filteredMedicos.map((medico) => (
                  <tr key={medico.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Matrícula */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medico.matricula}
                    </td>
                    
                    {/* Nombre Completo */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                          {medico.nombre.charAt(0)}{medico.apellido.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {medico.apellido}, {medico.nombre}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Especialidades (Badges) */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {medico.especialidades.map((esp, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                          >
                            {esp}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/medicos/editar/${medico.matricula}`}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(medico.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}