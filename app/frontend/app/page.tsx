// app/page.tsx

import Link from 'next/link';
import { Stethoscope, User } from 'lucide-react';

// Este es un Componente de Servidor por defecto, lo cual es ideal para una página de inicio.
export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl text-center">
        
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Bienvenido a <span className="text-blue-600">TuClínica</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 md:text-xl">
            Tu plataforma de gestión de turnos médicos. Selecciona tu rol para comenzar.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Tarjeta para el Médico */}
          <Link
            href="/login" // Los médicos deben iniciar sesión para acceder a su panel
            className="group block rounded-lg border bg-white p-8 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:border-blue-500"
          >
            <div className="flex flex-col items-center justify-center">
              <Stethoscope 
                className="h-16 w-16 text-blue-600 transition-transform duration-300 group-hover:scale-110" 
                strokeWidth={1.5} 
              />
              <h2 className="mt-6 text-2xl font-bold text-gray-800">
                Soy Médico
              </h2>
              <p className="mt-2 text-gray-600">
                Accede a tu panel para gestionar tu agenda, turnos y disponibilidad.
              </p>
            </div>
          </Link>

          {/* Tarjeta para el Paciente */}
          <Link
            href="/buscar" // Los pacientes pueden ir directamente a buscar un turno
            className="group block rounded-lg border bg-white p-8 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:border-blue-500"
          >
            <div className="flex flex-col items-center justify-center">
              <User 
                className="h-16 w-16 text-blue-600 transition-transform duration-300 group-hover:scale-110" 
                strokeWidth={1.5}
              />
              <h2 className="mt-6 text-2xl font-bold text-gray-800">
                Soy Paciente
              </h2>
              <p className="mt-2 text-gray-600">
                Encuentra profesionales, consulta la disponibilidad y agenda tu próximo turno.
              </p>
            </div>
          </Link>

        </div>
        
      </div>
    </main>
  );
}