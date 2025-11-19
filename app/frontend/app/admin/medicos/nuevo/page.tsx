// app/medicos/nuevo/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Stethoscope, AlertCircle, X, Plus } from 'lucide-react';

// Interfaz para el Dropdown
interface Especialidad {
  id: number;
  nombre: string;
}

// Interfaz para la respuesta de la API (según tu modelo SQLAlchemy)
interface EspecialidadAPI {
  Id_especialidad: number;
  descripcion: string;
}

export default function NuevoMedicoPage() {
  const router = useRouter();
  
  // --- Estados ---
  const [listaEspecialidades, setListaEspecialidades] = useState<Especialidad[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    matricula: '',
    nombre: '',
    apellido: '',
    especialidades: [] as number[]
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Cargar especialidades REALES ---
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        // Ajusta la URL si tu endpoint de especialidades es diferente
        const res = await fetch('http://localhost:8000/api/especialidades/especialidades'); 
        if (!res.ok) throw new Error('Error cargando especialidades');
        
        const data: EspecialidadAPI[] = await res.json();
        
        // Mapeamos la respuesta de la DB (Id_especialidad, descripcion) al formato del front (id, nombre)
        const mappedData = data.map(item => ({
          id: item.Id_especialidad,
          nombre: item.descripcion
        }));
        
        setListaEspecialidades(mappedData);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las especialidades.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchEspecialidades();
  }, []);

  // --- Manejadores ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEspecialidad = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idSeleccionado = Number(e.target.value);
    if (!idSeleccionado) return;

    if (!formData.especialidades.includes(idSeleccionado)) {
      setFormData(prev => ({
        ...prev,
        especialidades: [...prev.especialidades, idSeleccionado]
      }));
    }
    e.target.value = "";
  };

  const handleRemoveEspecialidad = (idToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.filter(id => id !== idToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formData.matricula || !formData.nombre || !formData.apellido) {
      setError('Por favor completa los campos obligatorios.');
      setSubmitting(false);
      return;
    }

    if (formData.especialidades.length === 0) {
      setError('Debes seleccionar al menos una especialidad.');
      setSubmitting(false);
      return;
    }

    try {
      // Convertimos matrícula a string para coincidir con el Schema backend
      const payload = {
        Matricula: formData.matricula.toString(), 
        Nombre: formData.nombre,
        Apellido: formData.apellido,
        especialidades: formData.especialidades // Lista de IDs [1, 2]
      };

      const response = await fetch('http://localhost:8000/api/medicos/medicos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar el médico');
      }

      router.push('/admin/medicos');
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al intentar guardar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-2 max-w-4xl mx-auto">
      
      {/* Encabezado */}
      <div className="flex items-center mb-8">
        <Link 
          href="/admin/medicos" 
          className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Stethoscope className="text-blue-600" />
            Registrar Nuevo Médico
          </h1>
          <p className="text-gray-500 text-sm mt-1">Ingresa los datos y asigna las especialidades correspondientes.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center rounded-r">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Sección 1: Datos Personales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
              Información Profesional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">
                  Matrícula
                </label>
                <input
                  type="number"
                  id="matricula"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  placeholder="Ej: 12345"
                  className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre(s)
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido(s)
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Especialidades */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
              Especialidades
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agregar Especialidad
                </label>
                <div className="relative">
                  <select
                    onChange={handleAddEspecialidad}
                    disabled={loadingData}
                    defaultValue=""
                    className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white appearance-none cursor-pointer disabled:bg-gray-100"
                  >
                    <option value="" disabled>
                      {loadingData ? 'Cargando lista...' : 'Selecciona una especialidad para agregar...'}
                    </option>
                    {listaEspecialidades.map((esp) => (
                      <option 
                        key={esp.id} 
                        value={esp.id}
                        disabled={formData.especialidades.includes(esp.id)}
                      >
                        {esp.nombre} {formData.especialidades.includes(esp.id) ? '(Seleccionada)' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                    <Plus size={20} />
                  </div>
                </div>
              </div>

              {/* Lista de seleccionados */}
              <div className="min-h-[60px] p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                {formData.especialidades.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center italic">
                    No has seleccionado ninguna especialidad aún.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.especialidades.map(id => {
                      const especialidad = listaEspecialidades.find(e => e.id === id);
                      return (
                        <div 
                          key={id}
                          className="flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                        >
                          {especialidad?.nombre || 'Cargando...'}
                          <button
                            type="button"
                            onClick={() => handleRemoveEspecialidad(id)}
                            className="ml-2 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <Link
              href="/admin/medicos"
              className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting || loadingData}
              className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all
                ${(submitting || loadingData)
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 transform hover:-translate-y-0.5'
                }`}
            >
              {submitting ? 'Guardando...' : (
                <>
                  <Save className="mr-2" size={18} />
                  Guardar Médico
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}