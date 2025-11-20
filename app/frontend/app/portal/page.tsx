// app/dashboard/page.tsx

import UpcomingAppointments from '../components/UpcomingAppointments'; // Ajusta la ruta si es necesario

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bienvenido a tu Portal</h1>
        <p className="text-gray-500 mt-1">
          Aquí tienes un resumen de tu actividad reciente.
        </p>
      </header>

      {/* Usamos un grid para organizar los componentes del dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* El componente de Próximos Turnos */}
        {/* Ocupa 4 columnas en móvil (todo el ancho) y 4 columnas en pantallas grandes (todo el ancho) */}
        <div className="lg:col-span-4">
          <UpcomingAppointments />
        </div>
        
        

      </div>
    </div>
  );
}