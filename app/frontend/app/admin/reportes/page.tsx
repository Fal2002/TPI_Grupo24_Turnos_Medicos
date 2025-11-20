'use client';

import { useState, useMemo } from 'react';
import { User, Stethoscope, Users, CalendarCheck, BarChart3, X, Calendar, Clock, Activity, Award, TrendingUp } from 'lucide-react';
import { generateReport, formatDateForAPI, getDaysAgo, ReportResponse } from '@/services/reportes';

// --- TIPOS Y CONFIGURACIÓN ---

const REPORT_TYPES = [
  { id: 'medico', label: 'Turnos por Médico', icon: User, description: 'Listado detallado y métricas de rendimiento' },
  { id: 'especialidad', label: 'Por Especialidad', icon: Stethoscope, description: 'Distribución de demanda por área' },
  { id: 'atendidos', label: 'Pacientes Atendidos', icon: Users, description: 'Historial de pacientes y estados' },
  { id: 'asistencias', label: 'Estadísticas de Asistencia', icon: CalendarCheck, description: 'Tasa de presentismo vs ausentismo' },
];

// --- COMPONENTE PRINCIPAL ---

export default function ReportesPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(formatDateForAPI(getDaysAgo(30)));
  const [endDate, setEndDate] = useState(formatDateForAPI(new Date()));

  const handleGenerate = async () => {
    if (!selectedReport) return;
    setIsGenerating(true);
    setError(null);
    setReportData(null);

    try {
      const data = await generateReport({
        type: selectedReport as any,
        start_date: startDate,
        end_date: endDate,
      });
      setReportData(data);
    } catch (err: any) {
      setError(err.message || 'Error al generar el reporte');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setReportData(null);
    setError(null);
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
                <BarChart3 className="text-white" size={28} />
            </div>
            Reportes Hospitalarios
          </h1>
          <p className="text-gray-500 mt-2 ml-1">Sistema de gestión de inteligencia de negocios y estadísticas.</p>
        </div>
      </div>

      {/* Selección de Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedReport === type.id;
          return (
            <button
              key={type.id}
              onClick={() => {
                setSelectedReport(type.id);
                handleClear();
              }}
              className={`
                relative p-6 rounded-2xl border transition-all duration-200 flex flex-col items-start text-left gap-3 group
                ${isSelected
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]'
                  : 'border-white bg-white hover:border-blue-300 hover:shadow-md text-gray-600'}
              `}
            >
              <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                <Icon size={24} />
              </div>
              <div>
                <span className="font-bold text-lg block">{type.label}</span>
                <span className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>{type.description}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Panel de Control (Filtros y Acción) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-end gap-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="text-blue-600" /> Fecha Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="text-blue-600" /> Fecha Fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedReport || isGenerating}
          className={`
            h-[46px] px-8 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 min-w-[200px]
            ${!selectedReport || isGenerating
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-900 hover:bg-black shadow-lg hover:shadow-xl hover:-translate-y-0.5'}
          `}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Procesando...
            </>
          ) : (
            <>
              Generar
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="bg-red-100 p-1 rounded-full"><X size={16}/></div>
            <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Visualización del Reporte */}
      {reportData && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between mb-4 px-2">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{reportData.title}</h2>
                    <p className="text-sm text-gray-500">Resultados del periodo: <span className="font-medium text-gray-700">{reportData.periodo}</span></p>
                </div>
                <button onClick={handleClear} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {selectedReport === 'medico' && <ReportTableMedicos data={reportData.data} />}
                {selectedReport === 'atendidos' && <ReportTableAtendidos data={reportData.data} />}
                {selectedReport === 'especialidad' && <ReportChartEspecialidades data={reportData.data} />}
                {selectedReport === 'asistencias' && <ReportChartAsistencias data={reportData.data} summary={reportData.summary} />}
            </div>
        </div>
      )}
    </div>
  );
}

// --- COMPONENTE: Reporte Médicos (Con nuevas estadísticas) ---

// Reemplaza la función ReportTableMedicos con esto:
function ReportTableMedicos({ data }: { data: any[] }) {
  // 1. CÁLCULO DE ESTADÍSTICAS (Recuperado)
  const stats = useMemo(() => {
    if (!data.length) return null;
    const totalDuracion = data.reduce((acc, curr) => acc + (curr.Duracion || 0), 0);
    const avgDuracion = Math.round(totalDuracion / data.length);
    
    // Encontrar médico con más turnos
    const medicoCount: Record<string, number> = {};
    data.forEach(t => {
        const name = `${t.Medico_Nombre} ${t.Medico_Apellido}`;
        medicoCount[name] = (medicoCount[name] || 0) + 1;
    });
    const topMedicoEntry = Object.entries(medicoCount).sort((a, b) => b[1] - a[1])[0];

    return { 
        avgDuracion, 
        topMedico: topMedicoEntry ? topMedicoEntry[0] : 'N/A',
        topMedicoCount: topMedicoEntry ? topMedicoEntry[1] : 0
    };
  }, [data]);

  // 2. AGRUPACIÓN DE DATOS (Indentación)
  const groupedData = useMemo(() => {
    const groups: Record<string, any> = {};
    
    data.forEach((turno) => {
      const key = turno.Medico_Matricula;
      if (!groups[key]) {
        groups[key] = {
          medico: {
            nombre: turno.Medico_Nombre,
            apellido: turno.Medico_Apellido,
            matricula: turno.Medico_Matricula
          },
          turnos: [],
          total_duracion: 0
        };
      }
      groups[key].turnos.push(turno);
      groups[key].total_duracion += (turno.Duracion || 0);
    });

    return Object.values(groups);
  }, [data]);

  if (!data || data.length === 0) return <EmptyState message="No hay turnos registrados." />;

  return (
    <div className="bg-gray-50 min-h-[400px]">
      {/* SECCIÓN DE ESTADÍSTICAS */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-gray-200 bg-white">
            <StatCard 
                icon={Clock} 
                label="Duración Promedio" 
                value={`${stats.avgDuracion} min`} 
                subtext="Por consulta realizada"
                color="blue"
            />
            <StatCard 
                icon={Award} 
                label="Médico Más Solicitado" 
                value={stats.topMedico.split(' ')[0]} // Solo primer nombre para que entre bien
                subtext={`${stats.topMedicoCount} turnos asignados`}
                color="purple"
            />
            <StatCard 
                icon={Activity} 
                label="Total Turnos" 
                value={data.length} 
                subtext="En el periodo seleccionado"
                color="green"
            />
        </div>
      )}

      {/* SECCIÓN DE LISTADO AGRUPADO */}
      <div className="p-6 space-y-6">
        {groupedData.map((group: any, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
            
            {/* Cabecera del Médico */}
            <div className="p-5 bg-white border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Dr/a. {group.medico.nombre} {group.medico.apellido}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono">Matrícula: {group.medico.matricula}</p>
                </div>
              </div>
              
              <div className="flex gap-4 text-sm">
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-center border border-gray-100">
                  <span className="block font-bold text-gray-800 text-lg">{group.turnos.length}</span>
                  <span className="text-xs text-gray-500 uppercase">Atenciones</span>
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-center border border-gray-100">
                  <span className="block font-bold text-gray-800 text-lg">{group.total_duracion}m</span>
                  <span className="text-xs text-gray-500 uppercase">Total</span>
                </div>
              </div>
            </div>

            {/* Lista Indentada de Pacientes */}
            <div className="bg-gray-50/50 p-4">
              <div className="grid gap-3">
                {group.turnos.map((turno: any, tIdx: number) => (
                  <div key={tIdx} className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ml-0 md:ml-4 border-l-4" style={{ borderLeftColor: tIdx % 2 === 0 ? 'transparent' : 'transparent' }}> 
                    <div className="flex items-center gap-3 min-w-[200px]">
                       <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {turno.Paciente_Nombre?.[0]}{turno.Paciente_Apellido?.[0]}
                       </div>
                       <div>
                          <p className="font-semibold text-gray-700">{turno.Paciente_Nombre} {turno.Paciente_Apellido}</p>
                          <p className="text-xs text-gray-400">Paciente</p>
                       </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400"/>
                        <span>{new Date(turno.Fecha).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400"/>
                        <span>{turno.Hora} hs</span>
                      </div>
                       <div className="flex items-center gap-2">
                        <Activity size={16} className="text-gray-400"/>
                        <span>{turno.Duracion} min</span>
                      </div>
                    </div>

                    <div className="min-w-[120px] flex justify-end">
                       <StatusBadge status={turno.Estado_Turno} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// --- COMPONENTE: Reporte Pacientes (Mejor Indentación) ---

// Reemplaza la función ReportTableAtendidos con esto:
function ReportTableAtendidos({ data }: { data: any[] }) {
  // 1. CÁLCULO DE ESTADÍSTICAS (Recuperado)
  const stats = useMemo(() => {
      if (!data.length) return null;
      const finalizados = data.filter(p => p.Estado_Final === 'Finalizado' || p.Estado_Final === 'Atendido').length;
      const rate = Math.round((finalizados / data.length) * 100);
      const uniquePatients = new Set(data.map(p => p.Nro_Paciente)).size;
      return { unique: uniquePatients, rate };
  }, [data]);
  
  // 2. AGRUPACIÓN DE DATOS (Historial Clínico)
  const groupedPatients = useMemo(() => {
    const groups: Record<string, any> = {};

    data.forEach((registro) => {
      const key = registro.Nro_Paciente;
      if (!groups[key]) {
        groups[key] = {
          paciente: {
            nombre: registro.Paciente_Nombre,
            apellido: registro.Paciente_Apellido,
            numero: registro.Nro_Paciente
          },
          historial: []
        };
      }
      groups[key].historial.push(registro);
    });

    // Ordenar por cantidad de visitas (opcional)
    return Object.values(groups).sort((a: any, b: any) => b.historial.length - a.historial.length);
  }, [data]);

  if (!data || data.length === 0) return <EmptyState message="No hay pacientes atendidos." />;

  return (
    <div className="bg-gray-50 min-h-[400px]">
      {/* SECCIÓN DE ESTADÍSTICAS */}
      {stats && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b border-gray-200 bg-white">
            <StatCard 
                icon={Users} 
                label="Pacientes Únicos" 
                value={stats.unique} 
                subtext="Atendidos en este periodo"
                color="indigo"
            />
            <StatCard 
                icon={TrendingUp} 
                label="Tasa de Finalización" 
                value={`${stats.rate}%`} 
                subtext="Turnos completados exitosamente"
                color="teal"
            />
         </div>
      )}

      {/* SECCIÓN DE LISTADO AGRUPADO */}
      <div className="p-6 space-y-6">
        {groupedPatients.map((group: any, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            
            {/* Cabecera Paciente */}
            <div className="p-5 bg-white flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
                    {group.paciente.nombre?.[0]}{group.paciente.apellido?.[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {group.paciente.apellido}, {group.paciente.nombre}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">ID: {group.paciente.numero}</span>
                    <span>•</span>
                    <span>{group.historial.length} visitas registradas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Historial Indentado */}
            <div className="bg-gray-50/50 p-4">
                <div className="space-y-1">
                    {group.historial.map((item: any, hIdx: number) => (
                        <div key={hIdx} className="relative pl-6 md:pl-8 py-3 pr-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                            
                            {/* Línea decorativa */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-200 rounded-l-lg group-hover:bg-blue-400 transition-colors"></div>

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col text-sm">
                                    <span className="font-semibold text-gray-800 flex items-center gap-2">
                                        <Calendar size={14} className="text-blue-500"/>
                                        {new Date(item.Fecha).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'long' })}
                                    </span>
                                    <span className="text-gray-500 text-xs ml-6 flex items-center gap-1">
                                        <Clock size={12}/> {item.Hora} hs
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`
                                    px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5
                                    ${item.Estado_Final === 'Finalizado' || item.Estado_Final === 'Atendido'
                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                        : 'bg-gray-100 text-gray-600 border-gray-200'}
                                `}>
                                    {(item.Estado_Final === 'Finalizado' || item.Estado_Final === 'Atendido') && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                                    {item.Estado_Final}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// --- COMPONENTE: Gráfico de Pastel SVG (Especialidades) ---
// Este componente crea un Donut Chart usando SVG puro, sin librerías externas

function ReportChartEspecialidades({ data }: { data: any[] }) {
    if (!data || data.length === 0) return <EmptyState message="Sin datos de especialidades." />;

    // Calcular total para porcentajes
    const total = data.reduce((acc, item) => acc + (item.Total_Turnos || 0), 0);
    
    // Colores profesionales para las porciones
    const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];

    // Lógica para generar "slices" del SVG
    let cumulativePercent = 0;
    
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const slices = data.map((item, index) => {
        const percent = item.Total_Turnos / total;
        const startPercent = cumulativePercent;
        cumulativePercent += percent;
        const endPercent = cumulativePercent;

        // Si es 100%, es un círculo completo
        if (percent === 1) {
            return { ...item, path: null, isFull: true, color: COLORS[index % COLORS.length] };
        }

        const [startX, startY] = getCoordinatesForPercent(startPercent);
        const [endX, endY] = getCoordinatesForPercent(endPercent);
        const largeArcFlag = percent > 0.5 ? 1 : 0;

        const pathData = [
            `M ${startX} ${startY}`, // Move
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
            `L 0 0`, // Line to center
        ].join(' ');

        return { ...item, path: pathData, isFull: false, color: COLORS[index % COLORS.length], percent };
    });

    return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Gráfico SVG */}
            <div className="relative w-64 h-64 mx-auto">
                <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                    {slices.map((slice, idx) => (
                        slice.isFull ? (
                            <circle key={idx} r="1" fill={slice.color} />
                        ) : (
                            <path key={idx} d={slice.path!} fill={slice.color} className="hover:opacity-90 transition-opacity cursor-pointer" />
                        )
                    ))}
                    {/* Agujero del centro para hacerlo Donut */}
                    <circle r="0.6" fill="white" />
                </svg>
                {/* Texto central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-gray-800">{total}</span>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Turnos</span>
                </div>
            </div>

            {/* Leyenda con Barras de Progreso */}
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 mb-4">Distribución por Área</h3>
                {data.map((item, idx) => {
                    const percentage = ((item.Total_Turnos / total) * 100).toFixed(1);
                    const color = COLORS[idx % COLORS.length];
                    return (
                        <div key={idx} className="group">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                                    {item.Especialidad_Nombre}
                                </span>
                                <span className="text-gray-500">{percentage}% ({item.Total_Turnos})</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div 
                                    className="h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${percentage}%`, backgroundColor: color }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// --- COMPONENTE: Asistencias (Estilo existente mejorado) ---

function ReportChartAsistencias({ data, summary }: { data: any[]; summary?: any }) {
  if (!data || data.length === 0) return <EmptyState message="No hay datos de asistencia." />;

  const asistencias = data.find(item => item.Tipo_Registro === 'Finalizado' || item.Tipo_Registro === 'Asistió')?.Total_Turnos || 0;
  const inasistencias = data.find(item => item.Tipo_Registro === 'Ausente')?.Total_Turnos || 0;
  const total = asistencias + inasistencias;

  const asistenciaPercent = total > 0 ? (asistencias / total) : 0;
  const dashArray = asistenciaPercent * 100 * Math.PI; // Aproximación simplificada para SVG stroke

  return (
    <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center justify-center relative">
                <svg width="200" height="200" viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" stroke="#fee2e2" strokeWidth="20" fill="none" />
                    <circle 
                        cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="20" fill="none" 
                        strokeDasharray={`${asistenciaPercent * 251.2} 251.2`} // 2 * PI * 40 ≈ 251.2
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute text-center">
                    <span className="text-3xl font-bold text-gray-800">{(asistenciaPercent * 100).toFixed(0)}%</span>
                    <span className="block text-xs text-gray-500">Presentismo</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-green-600 font-semibold mb-1">Pacientes que Asistieron</p>
                        <h4 className="text-2xl font-bold text-green-800">{asistencias}</h4>
                    </div>
                    <div className="bg-green-200 p-2 rounded-lg"><User size={24} className="text-green-700"/></div>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-red-600 font-semibold mb-1">Ausencias</p>
                        <h4 className="text-2xl font-bold text-red-800">{inasistencias}</h4>
                    </div>
                    <div className="bg-red-200 p-2 rounded-lg"><X size={24} className="text-red-700"/></div>
                </div>
            </div>
        </div>
    </div>
  );
}

// --- COMPONENTES AUXILIARES ---

function StatCard({ icon: Icon, label, value, subtext, color }: any) {
    const colorClasses: any = {
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
        green: "bg-green-100 text-green-600",
        indigo: "bg-indigo-100 text-indigo-600",
        teal: "bg-teal-100 text-teal-600",
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-gray-100 text-gray-600'}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <h4 className="text-xl font-bold text-gray-900 mt-0.5">{value}</h4>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Pendiente': 'bg-amber-100 text-amber-800 border-amber-200',
    'Confirmado': 'bg-blue-100 text-blue-800 border-blue-200',
    'Finalizado': 'bg-green-100 text-green-800 border-green-200',
    'Ausente': 'bg-red-100 text-red-800 border-red-200',
    'Cancelado': 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const defaultStyle = 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || defaultStyle}`}>
      {status || 'Desconocido'}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-gray-400">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <BarChart3 size={32} className="text-gray-300" />
      </div>
      <p className="text-lg font-medium text-gray-500">{message}</p>
    </div>
  );
}

function formatDateSafe(dateStr: string) {
    if (!dateStr) return 'N/A';
    // Asumimos formato ISO o YYYY-MM-DD
    try {
        const date = new Date(dateStr + 'T00:00:00'); // Hack para evitar timezone issues si viene solo fecha
        return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr));
    } catch (e) {
        return dateStr;
    }
}