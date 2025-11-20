'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, DoorOpen, Building2, Hash, Search, AlertTriangle } from 'lucide-react';
import { getConsultorios, deleteConsultorio } from '@/services/consultorios';

interface Sucursal {
  id: number;
  nombre: string;
}

interface Consultorio {
  sucursal_id: number;
  numero: number;
}

export default function ConsultoriosPage() {
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [sucursalFilter, setSucursalFilter] = useState('');
  const [numeroFilter, setNumeroFilter] = useState('');

  // Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [consultorioToDelete, setConsultorioToDelete] = useState<Consultorio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sucursalFilter) params.append("sucursal_id", sucursalFilter);
      if (numeroFilter) params.append("numero", numeroFilter);

      const data = await getConsultorios(Object.fromEntries(params.entries()));

      setConsultorios(
        data.map((item: any) => ({
          sucursal_id: item.Sucursal_Id,
          numero: item.Numero
        }))
      );
    } catch (error) {
      console.error("Error fetching consultorios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/sucursales/sucursales");
        const data = await res.json();
        setSucursales(
          data.map((item: any) => ({
            id: item.Id,
            nombre: item.Nombre
          }))
        );
      } catch (error) {
        console.error("Error fetching sucursales:", error);
      }
    };
    fetchSucursales();
  }, []);

  const getSucursalDisplay = (id: number) => {
    const suc = sucursales.find(s => s.id === id);
    return suc ? `(${suc.id}) ${suc.nombre}` : `Sucursal ${id}`;
  };

  // --- Manejo modal ---
  const handleOpenDeleteModal = (cons: Consultorio) => {
    setConsultorioToDelete(cons);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setConsultorioToDelete(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!consultorioToDelete) return;
    setIsDeleting(true);

    try {
      await deleteConsultorio(consultorioToDelete.numero, consultorioToDelete.sucursal_id);

      setConsultorios(
        consultorios.filter(
          c =>
            !(c.numero === consultorioToDelete.numero &&
              c.sucursal_id === consultorioToDelete.sucursal_id)
        )
      );

      handleCloseDeleteModal();
    } catch (error) {
      alert("Error al eliminar consultorio");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <DoorOpen className="text-blue-600" /> Consultorios
        </h1>

        <Link
          href="/admin/consultorios/nuevo"
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
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
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
            placeholder="Número de Consultorio"
            value={numeroFilter}
            onChange={(e) => setNumeroFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
          >
            {loading
              ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              : <Search size={18} />}
            Buscar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Sucursal</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Consultorio</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">Cargando...</td>
              </tr>
            ) : (
              consultorios.map((cons) => (
                <tr key={`${cons.sucursal_id}-${cons.numero}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {getSucursalDisplay(cons.sucursal_id)}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">#{cons.numero}</span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">

                      {/* EDITAR */}
                      <Link
                        href={`/admin/consultorios/editar/${cons.numero}/${cons.sucursal_id}`}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                      >
                        <Pencil size={18} />
                      </Link>

                      {/* ELIMINAR */}
                      <button
                        onClick={() => handleOpenDeleteModal(cons)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

      {/* Modal de Eliminación */}
      {showDeleteModal && consultorioToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">

            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-xl font-bold text-gray-900">¿Eliminar consultorio?</h3>

              <p className="text-gray-600 mt-2">
                Consultorio #{consultorioToDelete.numero} — Sucursal {consultorioToDelete.sucursal_id}
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
