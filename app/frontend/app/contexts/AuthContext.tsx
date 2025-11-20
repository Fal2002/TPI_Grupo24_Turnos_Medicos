// contexts/AuthContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, UserProfile } from '@/services/auth';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    error: string | null;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (err: any) {
            setError(err.message || 'Error al cargar usuario');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch user on mount, not on every render
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
