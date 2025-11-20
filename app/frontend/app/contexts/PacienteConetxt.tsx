'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';


interface PacienteData {
    nroPaciente: number;
    Nombre: string;
    Apellido: string;
    Email: string;
}

interface PacienteContextType {
    paciente: PacienteData | null;
    setPaciente: (paciente: PacienteData | null) => void;
}

const PacienteContext = createContext<PacienteContextType | undefined>(undefined);

interface PacienteProviderProps {
    children: ReactNode;
    initialPaciente: PacienteData | null;
}
export function PacienteProvider({ children, initialPaciente }: PacienteProviderProps) {
    const [paciente, setPaciente] = useState<PacienteData | null>(initialPaciente);
    const value = { paciente, setPaciente };

    return (
        <PacienteContext.Provider value={value}>
            {children}
        </PacienteContext.Provider>
    );
}

export function usePaciente() {
    const context = useContext(PacienteContext);
    if (context === undefined) {
        throw new Error('usePaciente must be used within a PacienteProvider');
    }
    return context;
}
