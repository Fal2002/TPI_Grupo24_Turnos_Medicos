// app/medicos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMedicos } from '@/services/medicos';
import { 
  Search, Filter, Plus, Pencil, Trash2, Stethoscope, MoreHorizontal, Hash, User
} from 'lucide-react';

// 1. Ajustamos la interfaz para que coincida con el Backend (Mayúsculas)
interface Medico {
  Matricula: string; // Python devuelve "Matricula"
  Nombre: string;    // Python devuelve "Nombre"
  Apellido: string;  // Python devuelve "Apellido"
  especialidades: number[]; // Python ahora devuelve una lista de IDs [1, 3]
}

interface Especialidad {
  id: number;     // Usaremos id (minúscula) porque así lo mapeamos al cargar
  nombre: string; 
}

// Interfaz auxiliar para mapear la respuesta de la API de especialidades
interface EspecialidadAPI {
  Id_especialidad: number;
  descripcion: string;
}

export default function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [matriculaFilter, setMatriculaFilter] = useState('');
  const [nombreFilter, setNombreFilter] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Cargar especialidades REALES para poder mostrar los nombres en la tabla
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/especialidades/especialidades');
        if (res.ok) {
          const data: EspecialidadAPI[] = await res.json();
          setEspecialidades(data.map(e => ({ id: e.Id_especialidad, nombre: e.descripcion })));
        }
      } catch (error) {
        console.error("Error cargando especialidades", error);
      }
    };
    fetchEspecialidades();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await getMedicos({
        matricula: matriculaFilter,
        nombre: nombreFilter,
        especialidad: selectedSpecialty
      });
      setMedicos(data);
    } catch (error) {
      console.error("Error buscando médicos:", error);
      setMedicos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (matricula: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a este médico?')) {
      // Llamar a deleteMedico(matricula) aquí
      setMedicos(medicos.filter((m) => m.Matricula !== matricula));
    }
  };

  // Función auxiliar para obtener el nombre de la especialidad por ID
  const getNombreEspecialidad = (id: number) => {
    const esp = especialidades.find(e => e.id === id);
    return esp ? esp.nombre : 'Desconocida';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ... (El Header y los filtros se mantienen igual, solo revisa el botón Buscar) ... */}
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

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        {/* 1. Filtro Matrícula */}
        <div className="md:col-span-3 relative">
          <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">Matrícula</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="text-gray-400" size={16} />
            </div>
            <input
              type="text"
              className="text-gray-700 w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm"
              value={matriculaFilter}
              onChange={(e) => setMatriculaFilter(e.target.value)}
            />
          </div>
        </div>

        {/* 2. Filtro Nombre */}
        <div className="md:col-span-4 relative">
          <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">Nombre o Apellido</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              className="text-gray-700 w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm"
              value={nombreFilter}
              onChange={(e) => setNombreFilter(e.target.value)}
            />
          </div>
        </div>

        {/* 3. Filtro Especialidad */}
        <div className="md:col-span-3 relative">
          <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">Especialidad</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="text-gray-400" size={16} />
            </div>
            <select
              className="text-gray-700 w-full pl-9 pr-8 py-2.5 rounded-lg border border-gray-300 outline-none text-sm appearance-none bg-white truncate"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">Todas</option>
              {especialidades.map((esp) => (
                <option key={esp.id} value={esp.nombre}>
                  {esp.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-2">
            <button 
                onClick={handleSearch}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
                <Search size={18} /> Buscar
            </button>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 w-32">Matrícula</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Médico</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Especialidades</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center">Cargando...</td></tr>
              ) : medicos.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No se encontraron médicos.</td></tr>
              ) : (
                medicos.map((medico) => (
                  // IMPORTANTE: Usar Matricula con mayúscula
                  <tr key={medico.Matricula} className="hover:bg-gray-50 transition-colors">
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medico.Matricula}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* IMPORTANTE: Validar que Nombre y Apellido existan antes de usar charAt */}
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                          {medico.Nombre ? medico.Nombre.charAt(0) : ''}
                          {medico.Apellido ? medico.Apellido.charAt(0) : ''}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {medico.Apellido}, {medico.Nombre}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Especialidades: Mapeamos los IDs a Nombres usando la lista auxiliar */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {medico.especialidades && medico.especialidades.length > 0 ? (
                          medico.especialidades.map((idEsp) => (
                            <span 
                              key={idEsp} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {getNombreEspecialidad(idEsp)}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">Sin especialidades</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {/* Usar Matricula con mayúscula en los links */}
                        <Link href={`/admin/medicos/editar/${medico.Matricula}`} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg">
                          <Pencil size={18} />
                        </Link>
                        <button onClick={() => handleDelete(medico.Matricula)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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