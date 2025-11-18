'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Pencil, Trash2, Building2, MapPin, Hash } from 'lucide-react';

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [idFilter, setIdFilter] = useState('');
  const [nombreFilter, setNombreFilter] = useState('');
  const [direccionFilter, setDireccionFilter] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setSucursales([
        { id: 1, nombre: 'Sede Central', direccion: 'Av. Siempre Viva 742' },
        { id: 2, nombre: 'Anexo Norte', direccion: 'Calle Falsa 123' },
        { id: 3, nombre: 'Clínica Oeste', direccion: 'Bv. Los Andes 500' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredData = sucursales.filter((item) => {
    const matchesId = item.id.toString().includes(idFilter);
    const matchesNombre = item.nombre.toLowerCase().includes(nombreFilter.toLowerCase());
    const matchesDireccion = item.direccion.toLowerCase().includes(direccionFilter.toLowerCase());
    return matchesId && matchesNombre && matchesDireccion;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600" /> Gestión de Sucursales
          </h1>
        </div>
        <Link href="/admin/sucursales/nuevo" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md">
          <Plus size={20} className="mr-2" /> Nueva Sucursal
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Building2 className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Filtrar por Nombre"
            value={nombreFilter}
            onChange={(e) => setNombreFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Filtrar por Dirección"
            value={direccionFilter}
            onChange={(e) => setDireccionFilter(e.target.value)}
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Dirección</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Cargando...</td></tr>
            ) : filteredData.map((sucursal) => (
              <tr key={sucursal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{sucursal.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{sucursal.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{sucursal.direccion}</td>
                {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/sucursales/editar/${sucursal.id}`}
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