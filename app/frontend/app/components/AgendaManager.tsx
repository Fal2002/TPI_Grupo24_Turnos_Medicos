// components/AgendaManager.tsx

'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Plus, Save, Trash2, CalendarCheck2 } from 'lucide-react';

// --- Importaciones de Servicios ---
import { getSucursales } from '@/services/sucursales';
import { 
  getAgendasRegulares,
  registrarAgendaRegular, 
  eliminarAgendaRegular,
  registrarAgendaExcepcional,
  getAgendasExcepcionales,
  eliminarAgendaExcepcional,
  AgendaRegularPostEntry,
  AgendaRegularOut,
  AgendaRegularId,
  AgendaExcepcionalOut,
  AgendaExcepcionalId
} from '@/services/agendas';

// --- Interfaces y Tipos ---
interface Sucursal {
  Id: number;
  Nombre: string;
  Direccion: string;
}

type RegularScheduleItem = {
  id: number;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
};

// --- Mapeos para transformación de datos ---
const dayNameToNumber: { [key: string]: number } = {
  monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7,
};

const numberToDayName: { [key: number]: RegularScheduleItem['day'] } = {
  1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday', 7: 'sunday',
};

const daysOfWeek = [
  { value: 'monday', label: 'Lunes' }, { value: 'tuesday', label: 'Martes' }, { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday', label: 'Jueves' }, { value: 'friday', label: 'Viernes' }, { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' },
];

// --- Props del Componente ---
interface AgendaManagerProps {
  medicoMatricula: string;
  activeSpecialtyId: number;
  activeSpecialtyName?: string;
}

// --- Componente Principal ---
export default function AgendaManager({ 
  medicoMatricula, 
  activeSpecialtyId, 
  activeSpecialtyName = 'la especialidad' 
}: AgendaManagerProps) {
  
  // --- Estados ---
  const [activeTab, setActiveTab] = useState<'regular' | 'exceptional'>('regular');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para Agenda Regular
  const [branches, setBranches] = useState<Sucursal[]>([]);
  const [regularBranchId, setRegularBranchId] = useState('');
  const [regularSchedule, setRegularSchedule] = useState<RegularScheduleItem[]>([]); // Para el formulario de NUEVOS horarios
  const [savedAgendas, setSavedAgendas] = useState<AgendaRegularOut[]>([]); // Para MOSTRAR horarios existentes
  const [regularDuration, setRegularDuration] = useState(30);
  
  // Estados para Agenda Excepcional
  const [savedExceptions, setSavedExceptions] = useState<AgendaExcepcionalOut[]>([]);
  const [exceptionType, setExceptionType] = useState<'availability' | 'non-availability'>('non-availability');
  const [exceptionStartDate, setExceptionStartDate] = useState('');
  const [exceptionEndDate, setExceptionEndDate] = useState('');

  // --- Carga de Datos Iniciales ---
  useEffect(() => {
    const loadComponentData = async () => {
      if (!medicoMatricula || !activeSpecialtyId) return;

      setIsLoading(true);
      try {
        const [sucursalesData, agendasData, excepcionesData] = await Promise.all([
          getSucursales(),
          getAgendasRegulares(medicoMatricula),
          getAgendasExcepcionales(medicoMatricula)
        ]);
        
        setBranches(sucursalesData);
        if (sucursalesData.length > 0 && !regularBranchId) {
          setRegularBranchId(String(sucursalesData[0].Id));
        }

        const agendasForSpecialty = agendasData.filter(
          (agenda) => agenda.Especialidad_Id === activeSpecialtyId
        );
        
        setSavedAgendas(agendasForSpecialty);
        setSavedExceptions(excepcionesData);
        // Limpiamos el formulario de creación cada vez que cambia la especialidad
        setRegularSchedule([]);

      } catch (error) {
        console.error("Error al cargar datos de la agenda:", error);
        alert('No se pudieron cargar los datos. Por favor, refresque la página.');
      } finally {
        setIsLoading(false);
      }
    };

    loadComponentData();
  }, [medicoMatricula, activeSpecialtyId]);

  // --- Manejadores de UI para el formulario ---
  const addRegularDay = () => setRegularSchedule([...regularSchedule, { id: Date.now(), day: 'monday', startTime: '09:00', endTime: '17:00' }]);
  const updateRegularDay = (id: number, field: string, value: string) => setRegularSchedule(regularSchedule.map(item => item.id === id ? { ...item, [field]: value } : item));
  const removeRegularDay = (id: number) => setRegularSchedule(regularSchedule.filter(item => item.id !== id));
  
  // --- Manejadores de API ---
  const handleSaveRegular = async (e: FormEvent) => {
    e.preventDefault();
    if (regularSchedule.length === 0) {
      alert('Debe añadir al menos un día de trabajo en el formulario.');
      return;
    }
    setIsSubmitting(true);

    const payload: AgendaRegularPostEntry[] = regularSchedule.map(item => ({
      Dia_de_semana: dayNameToNumber[item.day], Hora_inicio: item.startTime, Hora_fin: item.endTime,
      Especialidad_Id: activeSpecialtyId, Duracion: regularDuration, Sucursal_Id: Number(regularBranchId),
    }));

    try {
      await Promise.all(payload.map(entry => registrarAgendaRegular(medicoMatricula, entry)));
      alert('¡Nuevos horarios guardados con éxito!');
      setRegularSchedule([]); // Limpiamos el formulario
      // Volvemos a cargar las agendas para mostrar la recién creada
      const updatedAgendas = await getAgendasRegulares(medicoMatricula);
      setSavedAgendas(updatedAgendas.filter(a => a.Especialidad_Id === activeSpecialtyId));
    } catch (error) {
      console.error("Error al guardar la agenda:", error);
      alert(`Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRegular = async (agendaToDelete: AgendaRegularOut) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este horario?")) return;
    
    const id: AgendaRegularId = {
      Especialidad_Id: agendaToDelete.Especialidad_Id,
      Dia_de_semana: agendaToDelete.Dia_de_semana,
      Hora_inicio: agendaToDelete.Hora_inicio,
    };

    try {
      await eliminarAgendaRegular(medicoMatricula, id);
      alert("Horario eliminado correctamente.");
      // Actualizamos el estado local para reflejar el cambio en la UI
      setSavedAgendas(currentAgendas => 
        currentAgendas.filter(agenda => 
          agenda.Dia_de_semana !== id.Dia_de_semana || agenda.Hora_inicio !== id.Hora_inicio
        )
      );
    } catch (error) {
      console.error("Error al eliminar horario:", error);
      alert(`No se pudo eliminar el horario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };
  const handleSaveException = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // El input 'datetime-local' genera "YYYY-MM-DDTHH:mm".
    const splitDateTime = (isoString: string) => {
        if (!isoString) return { date: '', time: '' };
        const [date, time] = isoString.split('T');
        return { date, time };
    };

    const start = splitDateTime(exceptionStartDate);
    const end = splitDateTime(exceptionEndDate);

    try {
      const newException = await registrarAgendaExcepcional(medicoMatricula, {
        Fecha_inicio: start.date,
        Hora_inicio: start.time,
        Fecha_Fin: end.date,
        Hora_Fin: end.time,
        Es_Disponible: exceptionType === 'availability' ? 1 : 0,
        Especialidad_Id: activeSpecialtyId,
        // Usamos la sucursal seleccionada en la pestaña regular como default si es disponibilidad extra
        // Ojo: Esto asume que el usuario seleccionó algo en la otra pestaña o que hay un default.
        // Si se requiere consultorio específico, habría que agregar inputs. Por ahora enviamos defaults o nulls.
        Consultorio_Sucursal_Id: exceptionType === 'availability' ? Number(regularBranchId) : undefined,
        Consultorio_Numero: exceptionType === 'availability' ? 1 : undefined, // Hardcodeado temporalmente o requerir input
        Motivo: 'Excepción de agenda' // Se podría agregar un input para esto
      });
      alert('¡Excepción guardada con éxito!');
      setSavedExceptions([...savedExceptions, newException]);
      // Limpiar formulario
      setExceptionStartDate('');
      setExceptionEndDate('');
    } catch (error) {
      console.error("Error al guardar la excepción:", error);
      alert(`Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteException = async (ex: AgendaExcepcionalOut) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta excepción?")) return;
    
    const id: AgendaExcepcionalId = {
        Especialidad_Id: ex.Especialidad_Id,
        Fecha_inicio: ex.Fecha_inicio,
        Hora_inicio: ex.Hora_inicio
    };

    try {
      await eliminarAgendaExcepcional(medicoMatricula, id);
      setSavedExceptions(prev => prev.filter(e => 
        e.Fecha_inicio !== ex.Fecha_inicio || e.Hora_inicio !== ex.Hora_inicio
      ));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar excepción");
    }
  };
  
  // --- Renderizado ---

  if (isLoading) {
    return <div className="w-full max-w-4xl mx-auto p-6">Cargando...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveTab('regular')} className={`px-6 py-3 font-semibold ${activeTab === 'regular' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
          1. Agenda Regular
        </button>
        <button onClick={() => setActiveTab('exceptional')} className={`px-6 py-3 font-semibold ${activeTab === 'exceptional' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
          2. Agenda Excepcional
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'regular' && (
          <><form onSubmit={handleSaveRegular} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700">Configuración de Horario para <span className="text-blue-600">{activeSpecialtyName}</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duración (minutos)</label>
                <select id="duration" value={regularDuration} onChange={e => setRegularDuration(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md">
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                </select>
              </div>
              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Sucursal</label>
                <select
                  id="branch"
                  value={regularBranchId}
                  onChange={e => setRegularBranchId(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                >
                  {branches.map((sucursal) => (
                    <option key={sucursal.Id} value={sucursal.Id}>
                      {sucursal.Nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h2 className="text-xl font-bold text-gray-700">Días y Horas de Trabajo</h2>
              <div className="space-y-4 mt-4">
                {regularSchedule.map(item => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-3 bg-gray-50 rounded-md">
                    <select value={item.day} onChange={e => updateRegularDay(item.id, 'day', e.target.value)} className="p-2 border rounded-md">
                      {daysOfWeek.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                    <input type="time" value={item.startTime} onChange={e => updateRegularDay(item.id, 'startTime', e.target.value)} className="p-2 border rounded-md" />
                    <input type="time" value={item.endTime} onChange={e => updateRegularDay(item.id, 'endTime', e.target.value)} className="p-2 border rounded-md" />
                    <button type="button" onClick={() => removeRegularDay(item.id)} className="text-red-500 hover:text-red-700 flex items-center justify-center"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addRegularDay} className="mt-4 flex items-center gap-2 text-blue-600 font-semibold"><Plus size={18} /> Añadir día</button>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                <Save size={18} /> {isSubmitting ? 'Guardando...' : 'Guardar Agenda Regular'}
              </button>
            </div>
          </form><div className="mt-10 pt-6 border-t-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-3">
                <CalendarCheck2 size={24} />
                Horarios Ya Cargados
              </h2>
              {savedAgendas.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {savedAgendas.map(agenda => {
                    const branchName = branches.find(b => b.Id === agenda.Sucursal_Id)?.Nombre || 'Desconocida';
                    const dayLabel = daysOfWeek.find(d => d.value === numberToDayName[agenda.Dia_de_semana])?.label || 'Día inválido';
                    return (
                      <div key={`${agenda.Dia_de_semana}-${agenda.Hora_inicio}`} className="grid grid-cols-[1fr,auto] items-center p-3 bg-white border rounded-lg shadow-sm">
                        <div>
                          <p className="font-bold text-gray-800">{dayLabel}</p>
                          <p className="text-sm text-gray-600">
                            De <span className="font-medium">{agenda.Hora_inicio}</span> a <span className="font-medium">{agenda.Hora_fin}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            En {branchName} (Duración: {agenda.Duracion} min)
                          </p>
                        </div>
                        <button onClick={() => handleDeleteRegular(agenda)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 text-gray-500">No hay horarios regulares guardados para esta especialidad.</p>
              )}
            </div></>
        )}

        {activeTab === 'exceptional' && (
          <>
          <form onSubmit={handleSaveException} className="space-y-6">
             <h2 className="text-xl font-bold text-gray-700">Programar una Excepción para <span className="text-blue-600">{activeSpecialtyName}</span></h2>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Excepción</label>
              <div className="flex gap-6">
                <label className="flex items-center">
                    <input type="radio" name="exceptionType" value="non-availability" checked={exceptionType === 'non-availability'} onChange={() => setExceptionType('non-availability')} className="h-4 w-4"/>
                    <span className="ml-2 text-gray-700">No Disponibilidad</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" name="exceptionType" value="availability" checked={exceptionType === 'availability'} onChange={() => setExceptionType('availability')} className="h-4 w-4"/>
                    <span className="ml-2 text-gray-700">Disponibilidad Extra</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Inicio</label>
                <input type="datetime-local" id="startDate" value={exceptionStartDate} onChange={e => setExceptionStartDate(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md"/>
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fin</label>
                <input type="datetime-local" id="endDate" value={exceptionEndDate} onChange={e => setExceptionEndDate(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md"/>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                <Save size={18} /> {isSubmitting ? 'Guardando...' : 'Guardar Excepción'}
              </button>
            </div>
          </form>
          
          <div className="mt-10 pt-6 border-t-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-3">
                <CalendarCheck2 size={24} />
                Excepciones Cargadas
              </h2>
              {savedExceptions.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {savedExceptions.map(ex => (
                    <div key={`${ex.Fecha_inicio}-${ex.Hora_inicio}`} className="grid grid-cols-[1fr,auto] items-center p-3 bg-white border rounded-lg shadow-sm">
                      <div>
                        <p className="font-bold text-gray-800">
                            {ex.Es_Disponible === 1 ? 'Disponibilidad Extra' : 'No Disponibilidad'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Desde: <span className="font-medium">{ex.Fecha_inicio} {ex.Hora_inicio}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Hasta: <span className="font-medium">{ex.Fecha_Fin} {ex.Hora_Fin}</span>
                        </p>
                        {ex.Motivo && <p className="text-sm text-gray-500 italic">Motivo: {ex.Motivo}</p>}
                      </div>
                      <button onClick={() => handleDeleteException(ex)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-gray-500">No hay excepciones cargadas.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}