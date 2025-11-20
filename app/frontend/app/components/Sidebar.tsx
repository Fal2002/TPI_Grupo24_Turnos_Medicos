// components/Sidebar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePaciente } from '../contexts/PacienteConetxt';
// 1. Importar el nuevo icono
import { Home, PanelTop, Settings, Menu, X, LogOut, CalendarPlus, Calendar1, User, Hospital } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const navItems: NavItem[] = [
  { href: '/portal', label: 'Portal', icon: Home },
  { href: '/portal/turnos', label: 'Turnos', icon: Calendar1 },
];

const LogoutButton = () => {
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center w-full p-3 rounded-lg transition-colors text-gray-400 hover:bg-gray-700 hover:text-white"
    >
      <LogOut className="mr-3" size={20} />
      <span>Cerrar sesión</span>
    </button>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { paciente } = usePaciente();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Botón y overlay para móvil */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 right-4 z-30 p-2 bg-gray-800 text-white rounded-md"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black opacity-50 z-20"
          onClick={toggleMobileMenu}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 w-64 bg-gray-900 text-white p-5
                    transform transition-transform duration-300 ease-in-out z-20
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:fixed h-screen flex flex-col`}
      >
        <div>
          <div className="mb-6 text-center"> {/* Reducido el margen inferior del logo */}
            <Link href="/" className=" font-bold text-white hover:text-gray-300">
              <span className="text-xl flex items-center justify-center gap-2">
                <Hospital size={32} />
                Turnero Médico
              </span>
            </Link>
          </div>
          <hr className="my-4 border-gray-700" />
          
          
        <div className="mb-4 p-4 bg-gray-800 rounded-lg text-white">
          <div className="flex items-center mb-2">
            <User size={20} className="mr-2 text-blue-400" />
            <span className="font-semibold">{paciente?.Nombre} {paciente?.Apellido}</span>
          </div>
        </div>

          {/* --- INICIO DE LA SECCIÓN AÑADIDA --- */}
          <div className="mb-6"> {/* Margen inferior para separar del menú */}
            <Link
              href="/portal/agendar" // Asegúrate de que esta ruta exista
              className="flex items-center justify-center w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <CalendarPlus className="mr-2" size={18} />
              <span className="font-semibold">Agendar nuevo turno</span>
            </Link>
          </div>
          {/* --- FIN DE LA SECCIÓN AÑADIDA --- */}

          <nav>
            <ul>
              {navItems.map((item) => (
                <li key={item.href} className="mb-3">
                  <Link
                    href={item.href}
                    onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}
                    className={`flex items-center p-3 rounded-lg transition-colors
                                ${pathname === item.href
                                  ? 'bg-gray-700 text-white' // Cambiado a un gris para no competir con el botón azul
                                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                  >
                    <item.icon className="mr-3" size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-auto">
          <div className="pt-4 border-t border-gray-700">
            <LogoutButton />
          </div>
          <p className="mt-4 text-center text-xs text-gray-500">
            © 2025 Mi App
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;