'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, DoorOpen, AlertCircle } from 'lucide-react';
import { getSucursales } from '@/services/sucursales';
import { createConsultorio } from '@/services/consultorios';

interface Sucursal {
  id: number;
  nombre: string;
}

export default function NuevoConsultorioPage() {
  const router = useRouter();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [formData, setFormData] = useState({ sucursal_id: '', numero: '' });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const data = await getSucursales();
        setSucursales(data.map((item: any) => ({
          id: item.Id,
          nombre: item.Nombre,
        })));
      } catch (error) {
        console.error('Error fetching sucursales:', error);
        setError('Error al cargar las sucursales.');
      } finally {
        setLoadingData(false);
      }
    };
    fetchSucursales();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.sucursal_id || !formData.numero) {
      setError('Debes seleccionar una sucursal e ingresar un número.');
      setLoading(false);
      return;
    }

    try {
      await createConsultorio({
        Sucursal_Id: formData.sucursal_id,
        Numero: formData.numero,
      });
      router.push('/admin/consultorios');
    } catch (err) {
      setError('Error al guardar el consultorio: ' + (err instanceof Error ? err.message : 'Desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href="/admin/consultorios" className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <DoorOpen className="text-blue-600" /> Nuevo Consultorio
          </h1>
          <p className="text-gray-500 text-sm mt-1">Asigna un espacio físico a una sucursal existente.</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
            <select
              value={formData.sucursal_id}
              onChange={(e) => setFormData({ ...formData, sucursal_id: e.target.value })}
              disabled={loadingData}
              className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">{loadingData ? 'Cargando sucursales...' : 'Seleccione una sucursal'}</option>
              {sucursales.map((suc) => (
                <option key={suc.id} value={suc.id}>
                  ({suc.id}) {suc.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Consultorio</label>
            <input
              type="number"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              placeholder="Ej: 101"
              className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Link href="/admin/consultorios" className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">Cancelar</Link>
            <button disabled={loading || loadingData} className="flex items-center px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all disabled:bg-blue-400">
              <Save className="mr-2" size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}