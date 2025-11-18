// app/medicos/nuevo/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Stethoscope, AlertCircle, X, Plus } from 'lucide-react';

// Definimos la interfaz para las opciones del select
interface Especialidad {
  id: number;
  nombre: string;
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
    especialidades: [] as number[] // Array de IDs de especialidades seleccionadas
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Cargar especialidades (Mock API) ---
  useEffect(() => {
    // Simular fetch
    setTimeout(() => {
      const mockData = [
        { id: 1, nombre: 'Cardiología' },
        { id: 2, nombre: 'Pediatría' },
        { id: 3, nombre: 'Dermatología' },
        { id: 4, nombre: 'Neurología' },
        { id: 5, nombre: 'Clínica Médica' },
        { id: 6, nombre: 'Traumatología' },
      ];
      setListaEspecialidades(mockData);
      setLoadingData(false);
    }, 500);
  }, []);

  // --- Manejadores ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Agregar especialidad al seleccionar del dropdown
  const handleAddEspecialidad = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idSeleccionado = Number(e.target.value);
    if (!idSeleccionado) return;

    // Evitar duplicados
    if (!formData.especialidades.includes(idSeleccionado)) {
      setFormData(prev => ({
        ...prev,
        especialidades: [...prev.especialidades, idSeleccionado]
      }));
    }
    
    // Resetear el select visualmente
    e.target.value = "";
  };

  // Eliminar especialidad de la lista seleccionada
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

    // Validación
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
      // POST al Backend
      console.log("Enviando datos:", {
        matricula: Number(formData.matricula),
        nombre: formData.nombre,
        apellido: formData.apellido,
        especialidadesIds: formData.especialidades
      });

      const response = await fetch('http://localhost:8000/medicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula: Number(formData.matricula),
          nombre: formData.nombre,
          apellido: formData.apellido,
          especialidades: formData.especialidades, // Enviamos IDs
        }),
      });

      if (!response.ok) throw new Error('Error al registrar el médico');

      router.push('/medicos');
      
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al intentar guardar. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-2 max-w-4xl mx-auto">
      
      {/* Encabezado */}
      <div className="flex items-center mb-8">
        <Link 
          href="/medicos" 
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
                        // Opcional: Deshabilitar si ya está seleccionada
                        disabled={formData.especialidades.includes(esp.id)}
                      >
                        {esp.nombre} {formData.especialidades.includes(esp.id) ? '(Seleccionada)' : ''}
                      </option>
                    ))}
                  </select>
                  {/* Icono de flecha custom */}
                  <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                    <Plus size={20} />
                  </div>
                </div>
              </div>

              {/* Lista de seleccionados (Pills) */}
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
                          className="flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm animate-in fade-in zoom-in duration-200"
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

          {/* Botones */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <Link
              href="/medicos"
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