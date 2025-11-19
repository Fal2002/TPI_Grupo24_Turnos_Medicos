'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Building2, AlertCircle } from 'lucide-react';
import { createSucursal } from '@/services/sucursales';

export default function NuevaSucursalPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ Nombre: '', Direccion: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.Nombre || !formData.Direccion) {
      setError('Todos los campos son obligatorios.');
      setLoading(false);
      return;
    }

    try {
      await createSucursal(formData);
      router.push('/admin/sucursales');
    } catch (err) {
      setError('Error al guardar la sucursal: ' + (err instanceof Error ? err.message : 'Desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href="/admin/sucursales" className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600" /> Nueva Sucursal
          </h1>
          <p className="text-gray-500 text-sm mt-1">Registra una nueva sede clínica.</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Sucursal</label>
            <input
              type="text"
              value={formData.Nombre}
              onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
              placeholder="Ej: Sede Central"
              className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              value={formData.Direccion}
              onChange={(e) => setFormData({ ...formData, Direccion: e.target.value })}
              placeholder="Ej: Av. Siempre Viva 742"
              className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Link href="/admin/sucursales" className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">Cancelar</Link>
            <button disabled={loading} className="flex items-center px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all disabled:bg-blue-400">
              <Save className="mr-2" size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}