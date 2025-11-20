import { getMedicoPorUserId } from "@/services/medicos";
import SidebarMed from "../components/SidebarMed";
// 1. Importamos el nuevo Provider
import { MedicoProvider } from "../contexts/MedicoContext";
import { headers } from "next/headers";

export default async function MedicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const userId = (await headersList).get('x-user-id');

  if (!userId) {
    return <div>Error: No se pudo identificar al usuario.</div>;
  }

  const medico = await getMedicoPorUserId(userId);

  return (
    // 2. Envolvemos todo con MedicoProvider y le pasamos los datos del médico
    <MedicoProvider initialMedico={medico}>
      <div className="flex min-h-screen">
        <SidebarMed /> {/* Ya no necesita recibir `medico` como prop */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </MedicoProvider>
  );
}