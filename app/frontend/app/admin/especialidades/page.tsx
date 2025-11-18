'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Pencil, Trash2, Award, Hash } from 'lucide-react';

interface Especialidad {
  id: number;
  nombre: string;
}

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(true);

  const [idFilter, setIdFilter] = useState('');
  const [nombreFilter, setNombreFilter] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setEspecialidades([
        { id: 1, nombre: 'Cardiología' },
        { id: 2, nombre: 'Pediatría' },
        { id: 3, nombre: 'Dermatología' },
        { id: 4, nombre: 'Traumatología' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredData = especialidades.filter((item) => {
    return item.id.toString().includes(idFilter) && 
           item.nombre.toLowerCase().includes(nombreFilter.toLowerCase());
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-blue-600" /> Especialidades
          </h1>
        </div>
        <Link href="/admin/especialidades/nuevo" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md">
          <Plus size={20} className="mr-2" /> Nueva Especialidad
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Hash className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Filtrar por ID"
            value={idFilter}
            onChange={(e) => setIdFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Filtrar por Descripción"
            value={nombreFilter}
            onChange={(e) => setNombreFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Descripción</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="p-8 text-center text-gray-500">Cargando...</td></tr>
            ) : filteredData.map((esp) => (
              <tr key={esp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{esp.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{esp.nombre}</td>
                {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/especialidades/editar/${esp.id}`}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </Link>
                        
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}