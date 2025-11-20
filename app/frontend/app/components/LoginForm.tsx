// components/LoginForm.tsx

'use client';

import { useState, FormEvent } from 'react';
// 1. Importamos el hook useSearchParams
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Stethoscope, ShieldCheck, Lock, Fingerprint, FileBadge, FileKey } from 'lucide-react';

type Role = 'paciente' | 'medico' | 'admin';

const TABS_CONFIG = [
  // ... (la configuración de TABS se mantiene igual)
  { id: 'paciente' as Role, label: 'Soy Paciente', icon: User, endpoint: 'http://localhost:8000/api/auth/login', redirectPath: '/portal', identifierField: 'email', identifierLabel: 'DNI', identifierType: 'text', identifierIcon: Fingerprint },
  { id: 'medico' as Role, label: 'Soy Médico', icon: Stethoscope, endpoint: 'http://localhost:8000/api/auth/login', redirectPath: '/medico', identifierField: 'email', identifierLabel: 'Matrícula Profesional', identifierType: 'text', identifierIcon: FileBadge },
  { id: 'admin' as Role, label: 'Soy Admin', icon: ShieldCheck, endpoint: 'http://localhost:8000/api/auth/login', redirectPath: '/admin', identifierField: 'email', identifierLabel: 'N° de Legajo', identifierType: 'text', identifierIcon: FileKey },
];

export default function LoginForm() {
  // 2. Usamos el hook para obtener los parámetros de la URL
  const searchParams = useSearchParams();
  const router = useRouter();

  // 3. Función para determinar el estado inicial de la pestaña
  const getInitialTab = (): Role => {
    const roleFromUrl = searchParams.get('rol') as Role;
    // Verificamos que el rol de la URL sea uno de los válidos
    const isValidRole = TABS_CONFIG.some(tab => tab.id === roleFromUrl);
    return isValidRole ? roleFromUrl : 'paciente'; // Si no es válido o no existe, usamos 'paciente' por defecto
  };
  
  const [activeTab, setActiveTab] = useState<Role>(getInitialTab);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab)!;

  const handleTabChange = (tabId: Role) => {
    setActiveTab(tabId);
    setIdentifier('');
    setPassword('');
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // ... (la lógica de handleSubmit se mantiene exactamente igual)
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const body = { [currentTab.identifierField]: identifier, password: password };
      const response = await fetch(currentTab.endpoint, 
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || `Error al iniciar sesión como ${currentTab.label}`);
      router.push(currentTab.redirectPath);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // El JSX del return se mantiene exactamente igual
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      {/* ... (Todo el JSX del formulario y las pestañas) */}
       <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h1>
      </div>

      <div className="flex border-b border-gray-200">
        {TABS_CONFIG.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold text-sm transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}
        <div className="relative">
          <label htmlFor={currentTab.identifierField} className="sr-only">{currentTab.identifierLabel}</label>
          <currentTab.identifierIcon className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input 
            id={currentTab.identifierField}
            name={currentTab.identifierField}
            type={currentTab.identifierType}
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-3 pl-10 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder={currentTab.identifierLabel}
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="sr-only">Contraseña</label>
          <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 pl-10 text-gray-800 border border-gray-300 rounded-md" placeholder="Contraseña" />
        </div>

        <div>
          <button type="submit" disabled={isLoading} className="w-full p-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </div>
      </form>
      <div className="text-sm text-center text-gray-500">
        ¿No tienes una cuenta?{' '}
        <Link href="/registro" className="font-medium text-blue-600 hover:underline">
          Regístrate
        </Link>
      </div>
    </div>
  );
}