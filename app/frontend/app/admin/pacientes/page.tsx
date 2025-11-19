'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Plus, Pencil, Trash2, Users, Hash, User, 
  AlertTriangle // 1. Importamos el ícono de alerta
} from 'lucide-react';
// 2. Asegúrate de importar deletePaciente (ver nota al final si no tienes esta función creada)
import { getPacientes, deletePaciente } from '@/services/pacientes';

interface Paciente {
  numero: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export default function PacientesPage() {
  // --- Estados de Datos ---
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Filtros ---
  const [numeroFilter, setNumeroFilter] = useState('');
  const [nombreFilter, setNombreFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  // --- Estados del Modal de Eliminación (IGUAL QUE EN MÉDICOS) ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pacienteToDelete, setPacienteToDelete] = useState<Paciente | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPacientes({
        numero: numeroFilter,
        nombre: nombreFilter,
        apellido: nombreFilter,
      });
      // Mapeo de datos (Asegúrate que tu backend retorna estos campos)
      setPacientes(data.map((paciente: any) => ({
        numero: paciente.nroPaciente,
        nombre: paciente.Nombre,
        apellido: paciente.Apellido,
        email: paciente.Email,
        telefono: paciente.Telefono,
      })));
    } catch (error) {
      setError("Error fetching pacientes");
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Eliminación ---

  // 1. Abrir el modal
  const handleOpenDeleteModal = (paciente: Paciente) => {
    setPacienteToDelete(paciente);
    setShowDeleteModal(true);
  };

  // 2. Cerrar el modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setPacienteToDelete(null);
  };

  // 3. Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!pacienteToDelete) return;

    setIsDeleting(true);
    try {
      // Asumimos que tu API espera el número/id del paciente
      await deletePaciente(pacienteToDelete.numero);
      
      // Actualizamos la tabla localmente eliminando el registro
      setPacientes(pacientes.filter(p => p.numero !== pacienteToDelete.numero));
      
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error al eliminar paciente", error);
      alert("Hubo un error al intentar eliminar el paciente.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" /> Gestión de Pacientes
          </h1>
        </div>
        <Link href="/admin/pacientes/nuevo" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all">
          <Plus size={20} className="mr-2" /> Nuevo Paciente
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Hash className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="number"
            placeholder="Filtrar por Número"
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
        <div className="md:col-span-2">
            <button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Número</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Paciente</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Teléfono</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Cargando resultados...</td></tr>
              ) : pacientes.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No se encontraron pacientes.</td></tr>
              ) : pacientes.map((paciente) => (
              <tr key={paciente.numero} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{paciente.numero}</td>
                <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                  {paciente.apellido}, {paciente.nombre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{paciente.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{paciente.telefono}</td>
                
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
                      onClick={() => handleOpenDeleteModal(paciente)}
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

      {/* --- MODAL DE ELIMINACIÓN (Copiado y adaptado de Médicos) --- */}
      {showDeleteModal && pacienteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header del Modal */}
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar paciente?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Esta acción es irreversible. Se eliminarán permanentemente los datos del paciente.
              </p>
              
              {/* Tarjeta de Datos del Paciente */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-left mb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">NúmeroI</span>
                  <span className="text-sm font-mono font-bold text-gray-800">{pacienteToDelete.numero}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs font-semibold text-gray-500 uppercase">Nombre</span>
                   <span className="text-sm font-medium text-gray-800">{pacienteToDelete.apellido}, {pacienteToDelete.nombre}</span>
                </div>
              </div>
            </div>

            {/* Footer (Botones) */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-100">
              <button
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Sí, Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}