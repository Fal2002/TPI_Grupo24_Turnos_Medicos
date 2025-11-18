'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Users, AlertCircle, Hash } from 'lucide-react';

export default function EditarPacientePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    id: 0,
    numero: 0, // DNI/Afiliado (No editable)
    nombre: '',
    apellido: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setFormData({
        id: Number(id),
        numero: 33444555, // Dato simulado
        nombre: 'Pedro',
        apellido: 'Ramirez',
        email: 'pedro@mail.com'
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // PUT logic here...
    setTimeout(() => {
      router.push('/admin/pacientes');
    }, 500);
  };

  if (loading) return <div className="p-8 text-center">Cargando paciente...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href="/admin/pacientes" className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" /> Editar Paciente
          </h1>
          <p className="text-gray-500 text-sm">Editando registro #{id}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo Número (No Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número (DNI / Afiliado)</label>
            <div className="relative">
              <input
                type="number"
                value={formData.numero}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
              />
              <Hash className="absolute right-4 top-3.5 text-gray-400" size={20} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Este campo identifica al paciente y no se puede cambiar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Link href="/admin/pacientes" className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">Cancelar</Link>
            <button type="submit" disabled={submitting} className="flex items-center px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Save className="mr-2" size={18} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}