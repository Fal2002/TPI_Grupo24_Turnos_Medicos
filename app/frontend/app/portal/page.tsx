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
        {/* Ocupa 4 columnas en móvil (todo el ancho) y 1 columna en pantallas grandes (un cuarto) */}
        <div className="lg:col-span-1">
          <UpcomingAppointments />
        </div>
        
        {/* Otros componentes del Dashboard */}
        {/* Este contenedor ocupa 4 columnas en móvil y 3 en pantallas grandes (tres cuartos) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Otro Contenido del Dashboard
          </h2>
          <p>
            Aquí puedes agregar gráficos, estadísticas, notificaciones u otros widgets.
          </p>
        </div>

      </div>
    </div>
  );
}