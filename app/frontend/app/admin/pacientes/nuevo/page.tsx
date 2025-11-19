// app/pacientes/nuevo/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, AlertCircle } from 'lucide-react';

export default function NuevoPacientePage() {
  const router = useRouter();
  
  // Estados del formulario con los campos solicitados
  const [formData, setFormData] = useState({
    numero: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación simple de todos los campos
    if (!formData.numero || !formData.nombre || !formData.apellido || !formData.email || !formData.telefono) {
      setError('Por favor completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    try {
      // Endpoint ajustado para pacientes
      const response = await fetch('http://localhost:8000/api/pacientes/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nroPaciente: Number(formData.numero), // Asumimos que el número es numérico
          Nombre: formData.nombre,
          Apellido: formData.apellido,
          Email: formData.email,
          Telefono: formData.telefono,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el paciente');
      }

      // Éxito: Redirigir a la lista de pacientes
      router.push('/admin/pacientes');
      
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al intentar guardar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="flex items-center mb-8">
        <Link 
          href="/admin/pacientes" 
          className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-blue-600" />
            Registrar Nuevo Paciente
          </h1>
          <p className="text-gray-500 text-sm mt-1">Ingresa los datos personales y de contacto del paciente.</p>
        </div>
      </div>

      {/* Formulario Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Campo: Número de Paciente */}
            <div className="md:col-span-2">
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Paciente / ID
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  placeholder="Ej: 1001"
                  className=" text-gray-700 w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Identificador único del paciente en el sistema.</p>
            </div>

            {/* Campo: Nombre */}
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
                placeholder="Ej: María"
                className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            {/* Campo: Apellido */}
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
                placeholder="Ej: González"
                className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            {/* Campo: Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            {/* Campo: Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: +54 9 11 1234-5678"
                className="text-gray-700 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 mt-6">
            <Link
              href="/admin/pacientes"
              className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all
                ${loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 transform hover:-translate-y-0.5'
                }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                <>
                  <Save className="mr-2" size={18} />
                  Guardar Paciente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}