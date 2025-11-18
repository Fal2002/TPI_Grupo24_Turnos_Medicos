// app/registro/page.tsx

import RegisterForm from '../../components/RegisterForm'; // Ajusta la ruta a tu componente si es necesario

// Este es un Componente de Servidor, más eficiente
export default function RegisterPage() {
  return (
    // La página se encarga del layout general
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <RegisterForm />
    </div>
  );
}