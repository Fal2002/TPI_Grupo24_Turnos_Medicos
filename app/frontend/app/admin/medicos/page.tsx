// app/medicos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMedicos, deleteMedico } from '@/services/medicos'; // Asegúrate de importar deleteMedico
import { 
  Search, Filter, Plus, Pencil, Trash2, Stethoscope, 
  Hash, User, AlertTriangle, X 
} from 'lucide-react';

// --- Interfaces ---
interface Medico {
  Matricula: string;
  Nombre: string;
  Apellido: string;
  especialidades: number[];
}

interface Especialidad {
  id: number;
  nombre: string;
}

interface EspecialidadAPI {
  Id_especialidad: number;
  descripcion: string;
}

export default function MedicosPage() {
  // --- Estados de Datos ---
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(false);
  
  // --- Estados de Filtros ---
  const [matriculaFilter, setMatriculaFilter] = useState('');
  const [nombreFilter, setNombreFilter] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // --- Estados del Modal de Eliminación ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medicoToDelete, setMedicoToDelete] = useState<Medico | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Carga Inicial ---
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

  // --- Búsqueda ---
  const handleSearch = async () => {
    setLoading(true);
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

  // --- Lógica de Eliminación ---

  // 1. Abrir el modal
  const handleOpenDeleteModal = (medico: Medico) => {
    setMedicoToDelete(medico);
    setShowDeleteModal(true);
  };

  // 2. Cerrar el modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setMedicoToDelete(null);
  };

  // 3. Confirmar eliminación (Llamada a API)
  const handleConfirmDelete = async () => {
    if (!medicoToDelete) return;

    setIsDeleting(true);
    try {
      // Convertimos a número si tu servicio espera number, o string si espera string.
      // Según tu servicio anterior, deleteMedico recibe 'matricula'.
      await deleteMedico(Number(medicoToDelete.Matricula));
      
      // Actualizamos la tabla localmente
      setMedicos(medicos.filter(m => m.Matricula !== medicoToDelete.Matricula));
      
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error al eliminar", error);
      alert("Hubo un error al intentar eliminar el médico.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper para nombres de especialidad
  const getNombreEspecialidad = (id: number) => {
    const esp = especialidades.find(e => e.id === id);
    return esp ? esp.nombre : '...';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      
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

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
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
                disabled={loading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Search size={18} />}
                Buscar
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
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Cargando resultados...</td></tr>
              ) : medicos.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No se encontraron médicos.</td></tr>
              ) : (
                medicos.map((medico) => (
                  <tr key={medico.Matricula} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medico.Matricula}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                          {medico.Nombre?.charAt(0)}{medico.Apellido?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {medico.Apellido}, {medico.Nombre}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {medico.especialidades && medico.especialidades.length > 0 ? (
                          medico.especialidades.map((idEsp) => (
                            <span key={idEsp} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                              {getNombreEspecialidad(idEsp)}
                            </span>
                          ))
                        ) : <span className="text-xs text-gray-400">Sin especialidades</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/medicos/editar/${medico.Matricula}`} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Editar">
                          <Pencil size={18} />
                        </Link>
                        {/* Botón Eliminar que abre el modal */}
                        <button 
                          onClick={() => handleOpenDeleteModal(medico)} 
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

      {/* --- MODAL DE ELIMINACIÓN --- */}
      {showDeleteModal && medicoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header del Modal */}
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar médico?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Esta acción es irreversible. Se eliminarán los datos del médico y sus asignaciones de especialidad.
              </p>
              
              {/* Tarjeta de Datos del Médico */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-left mb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Matrícula</span>
                  <span className="text-sm font-mono font-bold text-gray-800">{medicoToDelete.Matricula}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs font-semibold text-gray-500 uppercase">Profesional</span>
                   <span className="text-sm font-medium text-gray-800">{medicoToDelete.Apellido}, {medicoToDelete.Nombre}</span>
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