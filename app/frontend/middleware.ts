// middleware.ts

import { NextResponse, type NextRequest } from "next/server";

// 1. Define las rutas de destino para cada rol
const protectedRoutes = {
    paciente: ['/turnos', '/portal'], // Rutas de paciente
    medico: ['/medico'],                            // Rutas de médico (con /medico es suficiente para cubrir /medico/agenda)
    admin: ['/admin']                               // Rutas de administrador
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access_token')?.value;

    if (process.env.BYPASS_AUTH === 'true') {
        // Si la variable está activada, salta toda la lógica de autenticación.
        console.log("BYPASS_AUTH está activado. Saltando autenticación.");
        return NextResponse.next();
    }

    // --- Lógica de redirección SI el usuario NO está logueado ---
    if (!token) {
        let intendedRole: string | null = null;

        // Comprueba a qué tipo de ruta protegida intentaba acceder
        if (protectedRoutes.paciente.some((route) => pathname.startsWith(route))) {
            intendedRole = 'paciente';
        } else if (protectedRoutes.medico.some((route) => pathname.startsWith(route))) {
            intendedRole = 'medico';
        } else if (protectedRoutes.admin.some((route) => pathname.startsWith(route))) {
            intendedRole = 'admin';
        }

        // Si la ruta es una de las protegidas y no hay token...
        if (intendedRole) {
            // ...redirige a la página de login, pre-seleccionando la pestaña correcta
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('rol', intendedRole);
            loginUrl.searchParams.set('redirectedFrom', pathname); // Opcional: para redirigir después del login
            return NextResponse.redirect(loginUrl);
        }
    }

    // --- Lógica de redirección SI el usuario YA está logueado ---
    // Opcional: Si un usuario logueado intenta ir al login, redirígelo a su dashboard
    if (token && pathname === '/login') {
       // Aquí necesitarías una forma de saber el rol del usuario desde el token (ej. decodificándolo)
       // Por ahora, lo dejamos simple. Pero es una mejora a futuro.
    }


    // Si no se cumple ninguna condición de redirección, permite que la solicitud continúe
    return NextResponse.next();
}

// Configura el matcher para que el middleware solo se ejecute en las rutas que nos interesan
export const config = {
    matcher: [
        /*
         * Coincide con todas las rutas excepto las que empiezan por:
         * - api (llamadas a la API)
         * - _next/static (archivos estáticos)
         * - _next/image (optimización de imágenes)
         * - favicon.ico (el icono de la pestaña)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}