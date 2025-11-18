// components/AdminSidebar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Stethoscope, 
  Award, 
  Building2, 
  DoorOpen, 
  Menu, 
  X, 
  LogOut,
  Plus,        // Icono Crear
  LayoutList,  // Icono Gestionar (antes Eye)
  ChevronDown 
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const navItems: NavItem[] = [
  { href: '/admin/pacientes', label: 'Pacientes', icon: Users },
  { href: '/admin/medicos', label: 'Médicos', icon: Stethoscope },
  { href: '/admin/especialidades', label: 'Especialidades', icon: Award },
  { href: '/admin/sucursales', label: 'Sucursales', icon: Building2 },
  { href: '/admin/consultorios', label: 'Consultorios', icon: DoorOpen },
];

const LogoutButton = () => {
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8000/users/logout", {
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
      className="flex items-center w-full p-3 rounded-lg transition-colors text-gray-400 hover:bg-red-900/30 hover:text-red-400 mt-2"
    >
      <LogOut className="mr-3" size={20} />
      <span>Cerrar sesión</span>
    </button>
  );
};

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 right-4 z-30 p-2 bg-gray-900 text-white rounded-md shadow-lg"
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
                    md:translate-x-0 md:relative h-screen flex flex-col border-r border-gray-800 overflow-y-auto`}
      >
        <div>
          <div className="mb-8 text-center flex flex-col items-center">
            <Link href="/dashboard" className="text-xl font-bold text-white hover:text-gray-300 tracking-wider">
              ADMINISTRACIÓN
            </Link>
            <span className="text-xs text-gray-500 mt-1">Gestión Clínica</span>
          </div>

          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const isHovered = hoveredItem === item.label;

                return (
                  <li 
                    key={item.href}
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative"
                  >
                    {/* Botón Principal */}
                    <Link
                      href={item.href}
                      onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 z-10 relative
                                  ${isActive
                                    ? 'bg-blue-700 text-white shadow-md' 
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                  }`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-300 ${isHovered ? 'rotate-180 opacity-100' : 'opacity-0 -rotate-90'}`} 
                      />
                    </Link>

                    {/* Submenú Desplegable */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-800/50 rounded-b-lg
                                  ${isHovered ? 'max-h-32 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                    >
                      <ul className="flex flex-col text-sm">
                        
                        {/* Opción: Gestionar (Antes Consultar) */}
                        <li>
                          <Link 
                            href={`${item.href}`}
                            className="flex items-center py-2 pl-12 pr-4 text-gray-400 hover:text-blue-400 hover:bg-gray-800 transition-colors"
                          >
                            <LayoutList size={16} className="mr-2" />
                            Gestionar
                          </Link>
                        </li>
                        
                        {/* Opción: Crear */}
                        <li>
                          <Link 
                            href={`${item.href}/nuevo`} 
                            className="flex items-center py-2 pl-12 pr-4 text-gray-400 hover:text-green-400 hover:bg-gray-800 transition-colors"
                          >
                            <Plus size={16} className="mr-2" />
                            Crear
                          </Link>
                        </li>

                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="mt-auto">
          <div className="pt-4 border-t border-gray-800">
            <LogoutButton />
          </div>
          <p className="mt-4 text-center text-xs text-gray-600">
            © 2025 Sistema Médico
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;