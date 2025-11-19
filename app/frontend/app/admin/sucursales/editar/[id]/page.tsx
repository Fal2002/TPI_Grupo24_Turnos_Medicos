'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import { getSucursalById, updateSucursal } from '@/services/sucursales';

export default function EditarSucursalPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    id: 0,
    nombre: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSucursal = async () => {
      try {
        const data = await getSucursalById(Number(id));
        setFormData({
          id: data.Id,
          nombre: data.Nombre,
          direccion: data.Direccion
        });
      } catch (error) {
        console.error('Error fetching sucursal:', error);
        alert('Error al cargar la sucursal');
        router.push('/admin/sucursales');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSucursal();
    }
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSucursal(Number(id), {
        Nombre: formData.nombre,
        Direccion: formData.direccion
      });
      router.push('/admin/sucursales');
    } catch (error) {
      console.error('Error updating sucursal:', error);
      alert('Error al actualizar la sucursal');
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando sucursal...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href="/admin/sucursales" className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600" /> Editar Sucursal
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID No Editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Sucursal</label>
            <input
              type="text"
              value={formData.id}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({...formData, direccion: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Link href="/admin/sucursales" className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">Cancelar</Link>
            <button type="submit" className="flex items-center px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Save className="mr-2" size={18} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}