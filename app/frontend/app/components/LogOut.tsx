'use client'
export default function LogoutButton() {
  const handleLogout = async (e: React.MouseEvent) => {
    
    await fetch("http://localhost:8000/users/logout", {
      method: "POST",
      credentials: "include", // necesario para que se envíen las cookies
    })
    window.location.href = "/" // o router.push("/") si usás useRouter()
  }

  return <button className="font-bold rounded transition-colors outline-2" onClick={handleLogout}>Cerrar sesión</button>
}
