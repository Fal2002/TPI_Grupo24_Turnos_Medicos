// middleware.ts

import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// 👇 CAMBIO 1: Actualizamos la interfaz para que coincida con tu JWT
interface JwtPayload {
    user_id: number;
    email: string;
    role_id: number;
    exp: number;
    sub: string;
}

// 👇 CAMBIO 2: Creamos un mapa para traducir role_id a un nombre de rol
// ❗ IMPORTANTE: Asegúrate de que estos números coincidan con los IDs de tu base de datos.
const roleIdMap: { [key: number]: 'paciente' | 'medico' | 'admin' } = {
    1: 'admin',
    2: 'medico',
    3: 'paciente',
};

// Rutas protegidas para cada rol (basado en el nombre del rol)
const protectedRoutes = {
    paciente: ['/portal'],
    medico: ['/medico'],
    admin: ['/admin'],
};

// Mapeo de roles a sus dashboards
const roleDashboards = {
    paciente: '/portal',
    medico: '/medico',
    admin: '/admin',
};

// Función para obtener la clave secreta del JWT (sin cambios)
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET no está definida en las variables de entorno');
    }
    return new TextEncoder().encode(secret);
};


export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access_token')?.value;

    if (process.env.BYPASS_AUTH === 'true') {
        console.log("BYPASS_AUTH está activado. Saltando autenticación.");
        return NextResponse.next();
    }

    if (!token) {
        const allProtectedRoutes = Object.values(protectedRoutes).flat();
        if (allProtectedRoutes.some((route) => pathname.startsWith(route))) {
            const loginUrl = new URL('/login', request.url);
            // Lógica para pre-seleccionar rol (sin cambios)
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    try {
        const { payload } = await jwtVerify<JwtPayload>(token, getJwtSecret());
        
        // 👇 CAMBIO 3: Usamos el mapa y los nuevos campos del payload
        const userRole = roleIdMap[payload.role_id];
        const userId = String(payload.user_id); // Convertimos el ID a string para las cabeceras

        // Medida de seguridad: si el role_id no existe en nuestro mapa, el token es inválido.
        if (!userRole) {
            throw new Error('Rol de usuario inválido o no reconocido.');
        }

        // Redirección si un usuario logueado intenta acceder a /login
        if (pathname.startsWith('/login')) {
            const dashboardUrl = roleDashboards[userRole] || '/';
            return NextResponse.redirect(new URL(dashboardUrl, request.url));
        }

        // Protección de rutas por rol
        const allowedRoutes = protectedRoutes[userRole] || [];
        const isAccessingAllowedRoute = allowedRoutes.some((route) => pathname.startsWith(route));
        
        const allProtectedRoutes = Object.values(protectedRoutes).flat();
        const isAccessingAnyProtectedRoute = allProtectedRoutes.some((route) => pathname.startsWith(route));

        if (isAccessingAnyProtectedRoute && !isAccessingAllowedRoute) {
            const dashboardUrl = roleDashboards[userRole] || '/';
            return NextResponse.redirect(new URL(dashboardUrl, request.url));
        }

        // Enriquecer la petición con los datos del usuario
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', userId);
        requestHeaders.set('x-user-role', userRole);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (error) {
        // El token es inválido (expirado, rol no reconocido, etc.)
        console.error("Fallo en la verificación del token:", error);
        
        const loginUrl = new URL('/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('access_token');
        
        return response;
    }
}

// Configuración del matcher (sin cambios)
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};