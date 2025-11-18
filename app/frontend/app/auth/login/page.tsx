// app/login/page.tsx

import LoginForm from '../../components/LoginForm'; // Ajusta la ruta a tu componente si es diferente

// Este es un Componente de Servidor, lo que es más óptimo
export default function LoginPage() {
  return (
    // La responsabilidad de la página es solo el layout y mostrar el componente
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
}