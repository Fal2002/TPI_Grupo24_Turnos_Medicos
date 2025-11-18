'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, DoorOpen, Building2, Hash } from 'lucide-react';

interface Sucursal {
  id: number;
  nombre: string;
}

interface Consultorio {
  id: number;
  sucursal_id: number;
  numero: number;
}

export default function ConsultoriosPage() {
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [sucursalFilter, setSucursalFilter] = useState(''); // ID como string
  const [numeroFilter, setNumeroFilter] = useState('');

  useEffect(() => {
    // Simulamos cargar ambas listas
    setTimeout(() => {
      setSucursales([
        { id: 1, nombre: 'Sede Central' },
        { id: 2, nombre: 'Anexo Norte' },
      ]);
      
      setConsultorios([
        { id: 1, sucursal_id: 1, numero: 101 },
        { id: 2, sucursal_id: 1, numero: 102 },
        { id: 3, sucursal_id: 2, numero: 10 },
        { id: 4, sucursal_id: 2, numero: 11 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Helper para obtener nombre sucursal formateado
  const getSucursalDisplay = (id: number) => {
    const suc = sucursales.find(s => s.id === id);
    return suc ? `(${suc.id}) ${suc.nombre}` : `ID: ${id}`;
  };

  const filteredData = consultorios.filter((item) => {
    // Filtro por sucursal (si hay una seleccionada)
    const matchesSucursal = sucursalFilter ? item.sucursal_id.toString() === sucursalFilter : true;
    // Filtro por número
    const matchesNumero = item.numero.toString().includes(numeroFilter);
    
    return matchesSucursal && matchesNumero;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <DoorOpen className="text-blue-600" /> Consultorios
          </h1>
        </div>
        <Link href="/admin/consultorios/nuevo" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md">
          <Plus size={20} className="mr-2" /> Nuevo Consultorio
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Building2 className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <select
            value={sucursalFilter}
            onChange={(e) => setSucursalFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white appearance-none"
          >
            <option value="">Todas las Sucursales</option>
            {sucursales.map((suc) => (
              <option key={suc.id} value={suc.id}>
                ({suc.id}) {suc.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Hash className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="number"
            placeholder="Filtrar por Número de Consultorio"
            value={numeroFilter}
            onChange={(e) => setNumeroFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Sucursal</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">N° Consultorio</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="p-8 text-center text-gray-500">Cargando...</td></tr>
            ) : filteredData.map((cons) => (
              <tr key={cons.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {getSucursalDisplay(cons.sucursal_id)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                    #{cons.numero}
                  </span>
                </td>
                {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/consultorios/editar/${cons.id}`}
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