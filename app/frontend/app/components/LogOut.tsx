'use client'
export default function LogOutButton() {
  const handleLogout = async (e: React.MouseEvent) => {
    
    await fetch("http://localhost:8000/api/auth/logout", {
      method: "POST",
      credentials: "include", // necesario para que se envíen las cookies
    })
    window.location.href = "/" // o router.push("/") si usás useRouter()
  }

  return <button className="font-bold rounded transition-colors outline-2" onClick={handleLogout}>Cerrar sesión</button>
}
