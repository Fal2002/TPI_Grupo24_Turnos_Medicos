// components/RegisterForm.tsx

'use client'; // <-- Componente de Cliente para manejar interactividad

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock } from 'lucide-react';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // 1. Validación simple en el cliente
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    
    setIsLoading(true);

    try {
      // 2. Llama a tu endpoint de registro
      const response = await fetch('http://localhost:8000/users', { // Asumiendo un endpoint RESTful para crear usuarios
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Error al crear la cuenta. Inténtalo de nuevo.');
      }

      // 3. Redirige al usuario a la página de login para que inicie sesión
      router.push('/login');

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Crear una Cuenta</h1>
        <p className="text-gray-500">Únete a nosotros</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        <div className="relative">
          <label htmlFor="name" className="sr-only">Nombre completo</label>
          <User className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 pl-10 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre completo"
          />
        </div>

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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contraseña"
          />
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="sr-only">Confirmar contraseña</label>
          <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 pl-10 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirmar contraseña"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </div>
      </form>

      <div className="text-sm text-center text-gray-500">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </div>
    </div>
  );
}