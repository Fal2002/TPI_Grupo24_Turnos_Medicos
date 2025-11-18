'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Award, AlertCircle } from 'lucide-react';

export default function NuevaEspecialidadPage() {
  const router = useRouter();
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!descripcion.trim()) {
      setError('La descripción es obligatoria.');
      setLoading(false);
      return;
    }

    try {
      await fetch('http://localhost:8000/especialidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Envio 'nombre' para mantener consistencia con los otros mocks, 
        // pero el label UI dice "Descripción" como pediste.
        body: JSON.stringify({ nombre: descripcion }), 
      });
      router.push('/admin/especialidades');
    } catch (err) {
      setError('Error al crear la especialidad.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href="/admin/especialidades" className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-blue-600" /> Nueva Especialidad
          </h1>
          <p className="text-gray-500 text-sm mt-1">Añade una nueva área médica al sistema.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
            <AlertCircle className="mr-2" size={20} /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Gastroenterología"
              className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Nombre oficial de la especialidad médica.</p>
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Link href="/admin/especialidades" className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">Cancelar</Link>
            <button disabled={loading} className="flex items-center px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all disabled:bg-blue-400">
              <Save className="mr-2" size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}