// components/SidebarMed.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Importamos iconos relevantes para el médico
import { Menu, X, LogOut, CalendarDays, Users, Stethoscope, Notebook } from 'lucide-react';
import { useSpecialty } from '../contexts/SpecialtyContext'; // Ajusta la ruta


interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

// 1. Nuevos enlaces de navegación para el médico
const navItems: NavItem[] = [
  { href: '/medico/agenda', label: 'Mi Agenda', icon: CalendarDays },
  { href: '/medico/pacientes', label: 'Mis Pacientes', icon: Users },
  { href: '/medico/turnos', label: 'Mis Turnos', icon: Notebook },
];

// 2. Datos de ejemplo para las especialidades del médico
const medicoEspecialidades = ['Cardiología', 'Clínica General'];

// El componente LogoutButton puede ser el mismo o importado de otro archivo
const LogoutButton = () => {
  const handleLogout = async () => { /* ... (lógica sin cambios) */ };
  return (
    <button onClick={handleLogout} className="flex items-center w-full p-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white">
      <LogOut className="mr-3" size={20} />
      <span>Cerrar sesión</span>
    </button>
  );
};

export default function SidebarMed() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 3. Estado para manejar la especialidad seleccionada
  const { activeSpecialty, setActiveSpecialty } = useSpecialty();

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // 3. Al cambiar el select, llamamos a la función del contexto
    setActiveSpecialty(e.target.value);
  };

  

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Botón y overlay para móvil (sin cambios) */}
      <button onClick={toggleMobileMenu} className="md:hidden fixed top-4 right-4 z-30 p-2 bg-gray-800 text-white rounded-md" aria-label="Toggle menu">
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isMobileMenuOpen && <div className="md:hidden fixed inset-0 bg-black opacity-50 z-20" onClick={toggleMobileMenu}></div>}

      <aside className={`fixed top-0 left-0 w-64 bg-gray-900 text-white p-5 transform transition-transform duration-300 ease-in-out z-20 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:fixed h-screen flex flex-col`}>
        <div>
          <div className="mb-6 text-center">
            <Link href="/medico/agenda" className="text-2xl font-bold text-white hover:text-gray-300">
              Panel Médico
            </Link>
          </div>

          {/* --- 4. SECCIÓN MODIFICADA: SELECTOR DE ESPECIALIDAD --- */}
          <div className="mb-6">
            <label htmlFor="specialty-selector" className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Stethoscope size={16} />
              <span>Viendo como:</span>
            </label>
            <select
              id="specialty-selector"
              value={activeSpecialty}
              onChange={handleSpecialtyChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            >
              {medicoEspecialidades.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
          {/* --- FIN DE LA SECCIÓN MODIFICADA --- */}

          <nav>
            <ul>
              {navItems.map((item) => (
                <li key={item.href} className="mb-3">
                  <Link
                    href={item.href}
                    onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-gray-700 text-white'
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
}