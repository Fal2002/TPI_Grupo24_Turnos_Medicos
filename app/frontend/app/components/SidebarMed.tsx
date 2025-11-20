// components/SidebarMed.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Importamos iconos relevantes para el médico
import { Menu, X, LogOut, CalendarDays, Users, Stethoscope, Notebook } from 'lucide-react';
import { useSpecialty } from '../contexts/SpecialtyContext'; // Ajusta la ruta
import { getMedicoPorUserId } from '@/services/medicos';
import { useMedico } from '../contexts/MedicoContext';


interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}
interface MedicoEspecialidad {
  descripcion: string;
  Id_especialidad: number;
}
interface MedicoData {
  Nombre: string;
  Apellido: string;
  Matricula: string;
  email_usuario: string;
  especialidades: MedicoEspecialidad[];
}

/*
formato de medico
{
    "Nombre": "Marcelo",
    "Apellido": "Tinellis QUINTuagesimo",
    "Matricula": "AB123CD99",
    "email_usuario": "AB123CD99@clinica.com",
    "especialidades": [
        {
            "descripcion": "Kinesiología",
            "Id_especialidad": 2
        }
    ]
}

*/

// 1. Nuevos enlaces de navegación para el médico
const navItems: NavItem[] = [
  { href: '/medico/agenda', label: 'Mi Agenda', icon: CalendarDays },
  { href: '/medico/pacientes', label: 'Mis Pacientes', icon: Users },
  { href: '/medico/turnos', label: 'Mis Turnos', icon: Notebook },
];

// 2. Datos de ejemplo para las especialidades del médico
//const medicoEspecialidades = ['Cardiología', 'Clínica General'];


// El componente LogoutButton puede ser el mismo o importado de otro archivo
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
export default function SidebarMed() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 3. Estado para manejar la especialidad seleccionada
const { medico, activeSpecialty, setActiveSpecialty } = useMedico();

 const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    // Buscamos el objeto completo de la especialidad para guardarlo en el contexto
    const newSpecialty = medico?.especialidades.find(esp => esp.Id_especialidad === selectedId) || null;
    setActiveSpecialty(newSpecialty);
  };

 if (!medico || !activeSpecialty) {
    return (
      <aside className="fixed top-0 left-0 w-64 bg-gray-900 text-white p-5 h-screen">
        Cargando...
      </aside>
    );
  }

  const medicoEspecialidades = medico.especialidades.map(esp => esp.descripcion);

  // Sincronizar la primera especialidad con el contexto cuando el componente se monta




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
            <Link href="/medico" className="text-2xl font-bold text-white hover:text-gray-300">
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
            // Ahora el valor es el ID de la especialidad
            value={activeSpecialty.Id_especialidad}
            onChange={handleSpecialtyChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 ..."
          >
            {medico.especialidades.map(specialty => (
              <option key={specialty.Id_especialidad} value={specialty.Id_especialidad}>
                {specialty.descripcion}
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