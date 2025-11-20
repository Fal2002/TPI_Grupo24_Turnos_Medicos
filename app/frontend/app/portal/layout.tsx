import { headers } from "next/headers";
import Sidebar from "../components/Sidebar";
import { getPacientePorUserId } from "@/services/pacientes";
import { PacienteProvider } from "../contexts/PacienteConetxt";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const headerList = headers();
  const userId = (await headerList).get('x-user-id');
  if (!userId) {
    return <div>Error: No se pudo identificar al usuario.</div>;
  }
  const paciente = await getPacientePorUserId(Number(userId));
  return (
    <PacienteProvider initialPaciente={paciente}>
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar específica del portal */}
      <Sidebar />

      {/* Contenido de la sección portal */}
       <main className="md:ml-64 p-4 md:p-8"> {/* <-- CAMBIO AQUÍ */}
          {children}
        </main>
    </div>
    </PacienteProvider>
  );
}