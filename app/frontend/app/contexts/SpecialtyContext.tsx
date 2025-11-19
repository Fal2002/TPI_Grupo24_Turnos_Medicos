// contexts/SpecialtyContext.tsx

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define la "forma" de los datos que compartiremos
interface SpecialtyContextType {
  activeSpecialty: string;
  setActiveSpecialty: (specialty: string) => void;
}

// Creamos el contexto con un valor por defecto (que no se usará realmente)
const SpecialtyContext = createContext<SpecialtyContextType | undefined>(undefined);

// Datos de ejemplo para el valor inicial
const medicoEspecialidades = ['Cardiología', 'Clínica General'];

// Creamos el "Proveedor" que contendrá la lógica del estado
export function SpecialtyProvider({ children }: { children: ReactNode }) {
  const [activeSpecialty, setActiveSpecialty] = useState<string>(medicoEspecialidades[0]);

  return (
    <SpecialtyContext.Provider value={{ activeSpecialty, setActiveSpecialty }}>
      {children}
    </SpecialtyContext.Provider>
  );
}

// Creamos un hook personalizado para facilitar el uso del contexto
export function useSpecialty() {
  const context = useContext(SpecialtyContext);
  if (context === undefined) {
    throw new Error('useSpecialty must be used within a SpecialtyProvider');
  }
  return context;
}