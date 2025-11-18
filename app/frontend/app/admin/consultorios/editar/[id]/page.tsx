'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, DoorOpen } from 'lucide-react';

interface Sucursal {
  id: number;
  nombre: string;
}

export default function EditarConsultorioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    id: 0,
    sucursal_id: '',
    numero: ''
  });
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Simulamos fetch paralelo: Datos del consultorio y Lista de sucursales
      setTimeout(() => {
        setSucursales([
          { id: 1, nombre: 'Sede Central' },
          { id: 2, nombre: 'Anexo Norte' },
        ]);
        
        setFormData({
          id: Number(id),
          sucursal_id: '1', // ID de la sucursal actual
          numero: '101'     // Número actual
        });
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic PUT
    router.push('/admin/consultorios');
  };

  if (loading) return <div className="p-8 text-center">Cargando consultorio...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href="/admin/consultorios" className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <DoorOpen className="text-blue-600" /> Editar Consultorio
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ID Consultorio (No Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Consultorio</label>
            <input
              type="text"
              value={formData.id}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>

          {/* Selector de Sucursal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal Asignada</label>
            <select
              value={formData.sucursal_id}
              onChange={(e) => setFormData({...formData, sucursal_id: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
            >
              {sucursales.map((suc) => (
                <option key={suc.id} value={suc.id}>
                  ({suc.id}) {suc.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Número de Consultorio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Sala / Puerta</label>
            <input
              type="number"
              value={formData.numero}
              onChange={(e) => setFormData({...formData, numero: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Link href="/admin/consultorios" className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">Cancelar</Link>
            <button type="submit" className="flex items-center px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Save className="mr-2" size={18} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}