import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/SidebarAdmin";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar específica del portal */}
      <AdminSidebar />

      {/* Contenido de la sección portal */}
      <main className="md:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}