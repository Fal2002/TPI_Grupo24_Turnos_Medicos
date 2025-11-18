import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import LogOut from './LogOut';



const Navbar = async () => {

  const token = (await cookies()).get('access_token')?.value
  const isLoggedIn = !!!token

    return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-white text-2xl font-bold">
            Logo
          </Link>
        </div>

        {/* Botones de Navegación */}
        <div className="hidden md:flex space-x-4">
          <Link href="/analysis" className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
            Análisis
          </Link>
          <Link href="/anotacion" className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
            Anotación
          </Link>
          <Link href="/contacto" className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
            Contacto
          </Link>
        </div>

        {/* Botones de Autenticación */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
          <><Link href="/auth/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors border-2">
                Iniciar Sesión
              </Link><Link
                href="/auth/register"
                className="bg-transparent text-blue-500 font-bold py-2 px-4 rounded border-2 border-blue-500 hover:bg-blue-700 hover:text-white transition-colors"
              >
                  Registrarse
                </Link></>
          ) : (
            <LogOut />
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;