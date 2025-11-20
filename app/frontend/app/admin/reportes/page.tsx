'use client';

import { useState } from 'react';
import { User, Stethoscope, Users, CalendarCheck, BarChart3, FileText } from 'lucide-react';

const REPORT_TYPES = [
  { id: 'medico', label: 'Por Médico', icon: User },
  { id: 'especialidad', label: 'Por Especialidad', icon: Stethoscope },
  { id: 'atendidos', label: 'Pacientes Atendidos', icon: Users },
  { id: 'asistencias', label: 'Asistencias', icon: CalendarCheck },
];

export default function ReportesPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleGenerate = () => {
    if (!selectedReport) return;
    setIsGenerating(true);
    setShowReport(false);
    
    // Simular carga de datos
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            Gestión de Reportes
          </h1>
          <p className="text-gray-500 text-sm mt-1">Seleccione el tipo de reporte que desea generar.</p>
        </div>
      
      {/* Selección de tipo de reporte */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedReport === type.id;
          return (
            <button
              key={type.id}
              onClick={() => {
                setSelectedReport(type.id);
                setShowReport(false);
              }}
              className={`
                p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                  : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50 text-gray-600 bg-white'}
              `}
            >
              <Icon size={32} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
              <span className="font-medium text-lg">{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Botón Generar */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleGenerate}
          disabled={!selectedReport || isGenerating}
          className={`
            px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-2
            ${!selectedReport || isGenerating 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}
          `}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generando...
            </>
          ) : (
            <>
              <BarChart3 size={20} />
              Generar Reporte
            </>
          )}
        </button>
      </div>

      {/* Área de visualización del reporte */}
      {showReport && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                Resultados: {REPORT_TYPES.find(r => r.id === selectedReport)?.label}
              </h2>
              <button 
                onClick={() => setShowReport(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Limpiar
              </button>
            </div>
            
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-500">
              <BarChart3 size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium">Componente de reporte: {selectedReport}</p>
              <p className="text-sm">Aquí se implementará la visualización de los datos.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

