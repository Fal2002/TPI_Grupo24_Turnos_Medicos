'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Users, AlertCircle, Hash, Phone } from 'lucide-react';
import { getPacienteByNumero, updatePaciente } from '@/services/pacientes';

export default function EditarPacientePage() {
  const router = useRouter();
  const params = useParams();
  
  // Capturamos el parámetro de la URL. 
  // Aunque la carpeta se llame [id], esto representa el 'numero' del paciente.
  const numeroURL = params.numero as string; 

  const [formData, setFormData] = useState({
    numero: 0, // Este es el identificador real (PK)
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Cargar datos del paciente ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usamos el servicio que busca por número
        const data = await getPacienteByNumero(numeroURL);
        
        // Mapeamos la respuesta del backend al estado
        // Ajusta "nroPaciente", "Nombre", etc. según como los devuelva exactamente tu API
        setFormData({
          numero: data.nroPaciente || data.numero, 
          nombre: data.Nombre || data.nombre,
          apellido: data.Apellido || data.apellido,
          email: data.Email || data.email,
          telefono: data.Telefono || data.telefono || ''
        });
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del paciente.");
      } finally {
        setLoading(false);
      }
    };

    if (numeroURL) {
      fetchData();
    }
  }, [numeroURL]);

  // --- Guardar cambios ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Preparamos el objeto para enviar al backend
      const payload = {
        nroPaciente: formData.numero,
        Nombre: formData.nombre,
        Apellido: formData.apellido,
        Email: formData.email,
        Telefono: formData.telefono
      };

      // Enviamos el update usando el numeroURL como identificador en la ruta
      await updatePaciente(numeroURL, payload);
      
      router.push('/admin/pacientes');
    } catch (err) {
      console.error(err);
      setError("Hubo un error al guardar los cambios.");
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Cargando datos...</span>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/admin/pacientes" className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" /> Editar Paciente
          </h1>
          <p className="text-gray-500 text-sm">Editando Paciente #{numeroURL}</p>
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center">
            <AlertCircle className="text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo Número (Identificador - No Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
            <div className="relative">
              <input
                type="number"
                value={formData.numero}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none font-mono"
              />
              <Hash className="absolute right-4 top-3.5 text-gray-400" size={20} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Este número identifica al paciente y no se puede modificar.</p>
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                required
                value={formData.apellido}
                onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition-all"
              />
            </div>
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition-all"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <div className="relative">
                    <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition-all pl-10"
                    />
                    <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Link 
                href="/admin/pacientes" 
                className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
            >
                Cancelar
            </Link>
            <button 
                type="submit" 
                disabled={submitting} 
                className="flex items-center px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
            >
              {submitting ? (
                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                 <Save className="mr-2" size={18} /> 
              )}
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}