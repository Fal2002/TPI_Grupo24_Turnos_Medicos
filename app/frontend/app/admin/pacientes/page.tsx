'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Pencil, Trash2, Users, Hash, User } from 'lucide-react';

interface Paciente {
  id: number;
  numero: number; // DNI o Nro Afiliado
  nombre: string;
  apellido: string;
  email: string;
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros solicitados
  const [numeroFilter, setNumeroFilter] = useState('');
  const [nombreFilter, setNombreFilter] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setPacientes([
        { id: 1, numero: 33444555, nombre: 'Pedro', apellido: 'Ramirez', email: 'pedro@mail.com' },
        { id: 2, numero: 22111333, nombre: 'Laura', apellido: 'Martinez', email: 'laura@mail.com' },
        { id: 3, numero: 11222333, nombre: 'Sofía', apellido: 'Lopez', email: 'sofia@mail.com' },
        { id: 4, numero: 44555666, nombre: 'Diego', apellido: 'Torres', email: 'diego@mail.com' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredData = pacientes.filter((item) => {
    // Filtro por número (exacto o parcial según prefieras, aquí parcial)
    const matchesNumero = item.numero.toString().includes(numeroFilter);
    // Filtro por nombre O apellido
    const matchesNombre = 
      item.nombre.toLowerCase().includes(nombreFilter.toLowerCase()) ||
      item.apellido.toLowerCase().includes(nombreFilter.toLowerCase());

    return matchesNumero && matchesNombre;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" /> Gestión de Pacientes
          </h1>
        </div>
        <Link href="/admin/pacientes/nuevo" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md">
          <Plus size={20} className="mr-2" /> Nuevo Paciente
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Hash className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="number"
            placeholder="Filtrar por Número (DNI)"
            value={numeroFilter}
            onChange={(e) => setNumeroFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
          />
        </div>
        <div className="relative">
          <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Filtrar por Nombre o Apellido"
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">DNI / Número</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Paciente</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contacto</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Cargando...</td></tr>
            ) : filteredData.map((paciente) => (
              <tr key={paciente.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">#{paciente.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{paciente.numero}</td>
                <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                  {paciente.apellido}, {paciente.nombre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{paciente.email}</td>
                {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/pacientes/editar/${paciente.numero}`}
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