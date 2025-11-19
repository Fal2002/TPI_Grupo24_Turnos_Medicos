'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Award, AlertCircle } from 'lucide-react';
import { getEspecialidad, updateEspecialidad } from '@/services/especialidades';

export default function EditarEspecialidadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEspecialidad(id);
        // Backend returns { Id_especialidad: ..., descripcion: ... }
        setNombre(data.descripcion);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la especialidad.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!nombre.trim()) {
      setError('La descripción es obligatoria.');
      setSubmitting(false);
      return;
    }

    try {
      await updateEspecialidad(Number(id), { descripcion: nombre });
      router.push('/admin/especialidades');
    } catch (err) {
      console.error(err);
      setError('Error al actualizar la especialidad.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="p-10 flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-500">Cargando datos...</span>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href="/admin/especialidades" className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-blue-600" /> Editar Especialidad
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center rounded-r">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID No Editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Especialidad</label>
            <input
              type="text"
              value={id}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Link href="/admin/especialidades" className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">Cancelar</Link>
            <button 
              type="submit" 
              disabled={submitting}
              className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all
                ${submitting
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 transform hover:-translate-y-0.5'
                }`}
            >
              <Save className="mr-2" size={18} /> 
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}