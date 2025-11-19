// app/medico/layout.tsx

import SidebarMed from "../components/SidebarMed";
// 1. Importamos nuestro nuevo Provider
import { SpecialtyProvider } from "../contexts/SpecialtyContext"; // Ajusta la ruta

export default function MedicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. Envolvemos todo con el Provider
    <SpecialtyProvider>
      <div className="flex min-h-screen">
        <SidebarMed />
        <main className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </SpecialtyProvider>
  );
}