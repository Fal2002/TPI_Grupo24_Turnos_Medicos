'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// --- Definimos las estructuras de datos ---
interface MedicoEspecialidad {
  descripcion: string;
  Id_especialidad: number;
}

interface MedicoData {
  Nombre: string;
  Apellido: string;
  Matricula: string;
  email_usuario: string;
  especialidades: MedicoEspecialidad[];
}

// --- Definimos la forma del contexto ---
interface MedicoContextType {
  medico: MedicoData | null;
  activeSpecialty: MedicoEspecialidad | null;
  setActiveSpecialty: (specialty: MedicoEspecialidad | null) => void;
}

// --- Creamos el Contexto ---
const MedicoContext = createContext<MedicoContextType | undefined>(undefined);

// --- Creamos el Proveedor (Provider) ---
interface MedicoProviderProps {
  children: ReactNode;
  initialMedico: MedicoData | null; // Recibirá los datos del layout (Server Component)
}

export function MedicoProvider({ children, initialMedico }: MedicoProviderProps) {
  const [medico] = useState<MedicoData | null>(initialMedico);
  const [activeSpecialty, setActiveSpecialty] = useState<MedicoEspecialidad | null>(null);

  // Efecto para establecer la primera especialidad como activa por defecto
  useEffect(() => {
    if (medico && medico.especialidades.length > 0 && !activeSpecialty) {
      setActiveSpecialty(medico.especialidades[0]);
    }
  }, [medico, activeSpecialty]);

  const value = { medico, activeSpecialty, setActiveSpecialty };

  return (
    <MedicoContext.Provider value={value}>
      {children}
    </MedicoContext.Provider>
  );
}

// --- Creamos un Hook personalizado para consumir el contexto fácilmente ---
export function useMedico() {
  const context = useContext(MedicoContext);
  if (context === undefined) {
    throw new Error('useMedico debe ser usado dentro de un MedicoProvider');
  }
  return context;
}