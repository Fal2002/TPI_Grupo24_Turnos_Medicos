// app/medicos/editar/[matricula]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Stethoscope, AlertCircle, X, Plus, Pencil } from 'lucide-react';

// Interfaces
interface Especialidad {
  id: number;
  nombre: string;
}

// Interfaz de respuesta API (Backend usa Mayúsculas)
interface MedicoResponse {
  Matricula: string;
  Nombre: string;
  Apellido: string;
  especialidades: { Id_especialidad: number; descripcion: string }[];
}

interface EspecialidadAPI {
  Id_especialidad: number;
  descripcion: string;
}

interface FormDataState {
  matricula: string;
  nombre: string;
  apellido: string;
  especialidades: number[];
}

export default function EditarMedicoPage() {
  const router = useRouter();
  const params = useParams();
  const matriculaParam = params.matricula as string;

  // --- Estados ---
  const [listaEspecialidades, setListaEspecialidades] = useState<Especialidad[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [formData, setFormData] = useState<FormDataState>({
    matricula: '',
    nombre: '',
    apellido: '',
    especialidades: []
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Cargar Datos del Médico y Lista de Especialidades ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ejecutamos ambas peticiones en paralelo
        const [resEspecialidades, resMedico] = await Promise.all([
            fetch('http://localhost:8000/api/especialidades/especialidades'),
            fetch(`http://localhost:8000/api/medicos/medicos/${matriculaParam}`)
        ]);

        if (!resEspecialidades.ok) throw new Error('Error cargando especialidades');
        if (!resMedico.ok) throw new Error('Error cargando médico');

        const dataEsp: EspecialidadAPI[] = await resEspecialidades.json();
        const dataMed: MedicoResponse = await resMedico.json();

        // 1. Mapear especialidades para el dropdown
        setListaEspecialidades(dataEsp.map(e => ({
            id: e.Id_especialidad,
            nombre: e.descripcion
        })));

        // 2. Mapear datos del médico al estado del formulario
        setFormData({
            matricula: dataMed.Matricula,
            nombre: dataMed.Nombre,
            apellido: dataMed.Apellido,
            especialidades: dataMed.especialidades.map(e => e.Id_especialidad) || []
        });

      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la información. Verifique que el servidor esté activo.');
      } finally {
        setLoadingData(false);
      }
    };

    if (matriculaParam) {
      fetchData();
    }
  }, [matriculaParam]);

  // --- Manejadores ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Agregar especialidad
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

  // Eliminar especialidad
  const handleRemoveEspecialidad = (idToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.filter(id => id !== idToRemove)
    }));
  };

  // Guardar cambios (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formData.nombre || !formData.apellido) {
      setError('El nombre y apellido son obligatorios.');
      setSubmitting(false);
      return;
    }

    if (formData.especialidades.length === 0) {
      setError('El médico debe tener al menos una especialidad.');
      setSubmitting(false);
      return;
    }

    try {
      // Preparamos el payload (Respetando el Schema MedicoUpdate)
      // Nota: El backend espera 'Nombre' y 'Apellido' con mayúscula según tu Pydantic anterior,
      // o minúscula si actualizaste el MedicoUpdate a campos lowercase.
      // Asumiendo que tu schema MedicoUpdate usa: Nombre, Apellido (Mayúsculas)
      const payload = {
        Nombre: formData.nombre,
        Apellido: formData.apellido,
        especialidades: formData.especialidades
      };

      const response = await fetch(`http://localhost:8000/api/medicos/medicos/${formData.matricula}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Error al actualizar');

      // Redirigir a la lista de médicos
      router.push('/admin/medicos');
      
    } catch (err) {
      console.error(err);
      setError('Error al guardar los cambios.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-10 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Cargando datos del médico...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
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
            <Pencil className="text-blue-600" size={24} />
            Editar Médico
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Matrícula: <strong>{formData.matricula}</strong>
          </p>
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
              
              {/* Campo Matrícula (READ ONLY) */}
              <div className="md:col-span-2">
                <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">
                  Matrícula <span className="text-xs font-normal text-gray-400">(No editable)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="matricula"
                    name="matricula"
                    value={formData.matricula}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                  />
                  <Stethoscope className="absolute right-4 top-3.5 text-gray-400" size={20} />
                </div>
              </div>

              {/* Nombre */}
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition-all"
                />
              </div>

              {/* Apellido */}
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition-all"
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
                  Añadir Especialidad
                </label>
                <div className="relative">
                  <select
                    onChange={handleAddEspecialidad}
                    defaultValue=""
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Seleccionar de la lista...</option>
                    {listaEspecialidades.map((esp) => (
                      <option 
                        key={esp.id} 
                        value={esp.id}
                        disabled={formData.especialidades.includes(esp.id)}
                      >
                        {esp.nombre} {formData.especialidades.includes(esp.id) ? '(Ya asignada)' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                    <Plus size={20} />
                  </div>
                </div>
              </div>

              {/* Pills de Especialidades */}
              <div className="min-h-[60px] p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                {formData.especialidades.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center italic">
                    Sin especialidades asignadas.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.especialidades.map(id => {
                      const especialidad = listaEspecialidades.find(e => e.id === id);
                      // Si estamos cargando y aún no mapeó, o si el ID es viejo/inválido
                      const nombreEsp = especialidad ? especialidad.nombre : `ID: ${id}`;
                      
                      return (
                        <div 
                          key={id}
                          className="flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm animate-in fade-in zoom-in duration-200"
                        >
                          {nombreEsp}
                          <button
                            type="button"
                            onClick={() => handleRemoveEspecialidad(id)}
                            className="ml-2 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                            title="Quitar especialidad"
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
              href="/admin/medicos"
              className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all
                ${submitting
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 transform hover:-translate-y-0.5'
                }`}
            >
              {submitting ? 'Guardando...' : (
                <>
                  <Save className="mr-2" size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}