'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Pencil, Trash2, Award, Hash, AlertTriangle } from 'lucide-react';
import { getEspecialidades, deleteEspecialidad } from '@/services/especialidades';

interface Especialidad {
  id: number;
  nombre: string;
}

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(false);

  const [idFilter, setIdFilter] = useState('');
  const [nombreFilter, setNombreFilter] = useState('');

  // --- Estados del Modal de Eliminación ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [especialidadToDelete, setEspecialidadToDelete] = useState<Especialidad | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (idFilter) filters.id = idFilter;
      if (nombreFilter) filters.nombre = nombreFilter;
      const data = await getEspecialidades(filters);
      setEspecialidades(data.map((item: any) => ({ id: item.Id_especialidad, nombre: item.descripcion })));
    } catch (error) {
      console.error('Error fetching especialidades:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Eliminación ---

  const handleOpenDeleteModal = (especialidad: Especialidad) => {
    setEspecialidadToDelete(especialidad);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setEspecialidadToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!especialidadToDelete) return;

    setIsDeleting(true);
    try {
      await deleteEspecialidad(especialidadToDelete.id);
      
      // Actualizamos la tabla localmente
      setEspecialidades(especialidades.filter(e => e.id !== especialidadToDelete.id));
      
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error al eliminar", error);
      alert("Hubo un error al intentar eliminar la especialidad.");
    } finally {
      setIsDeleting(false);
    }
  };

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
        <div className="md:col-span-2">
            <button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Search size={18} />}
                Buscar
            </button>
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
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Cargando resultados...</td></tr>
              ) : especialidades.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No se encontraron especialidades.</td></tr>
              ) : especialidades.map((esp) => (
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
                          onClick={() => handleOpenDeleteModal(esp)}
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

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && especialidadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar especialidad?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Esta acción es irreversible. Se eliminará la especialidad <strong>{especialidadToDelete.nombre}</strong>.
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-100">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}