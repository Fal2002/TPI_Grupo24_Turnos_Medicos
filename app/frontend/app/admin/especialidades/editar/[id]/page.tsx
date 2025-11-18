'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Award } from 'lucide-react';

export default function EditarEspecialidadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setNombre('Cardiología'); // Mock data
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic PUT
    router.push('/admin/especialidades');
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href="/admin/especialidades" className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-blue-600" /> Editar Especialidad
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
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
            <button type="submit" className="flex items-center px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Save className="mr-2" size={18} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}