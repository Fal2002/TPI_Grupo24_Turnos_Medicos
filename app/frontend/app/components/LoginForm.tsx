// components/LoginForm.tsx

'use client'; // <-- Este es un Componente de Cliente

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';

// Exportamos el componente para poder importarlo en la página
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Error al iniciar sesión');
      }

      // Si el login es exitoso, redirige al dashboard
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Aquí va todo el JSX que define cómo se ve el formulario
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h1>
        <p className="text-gray-500">Bienvenido de nuevo</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        <div className="relative">
          <label htmlFor="email" className="sr-only">Correo electrónico</label>
          <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pl-10 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Correo electrónico"
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="sr-only">Contraseña</label>
          <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contraseña"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
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