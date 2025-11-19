// components/AgendaManager.tsx

'use client';

import { useState, FormEvent } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';

type RegularScheduleItem = {
  id: number;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
};

// Datos de Ejemplo
const specialties = ['Cardiología', 'Dermatología', 'Pediatría', 'General'];
const branches = ['Sucursal Centro', 'Sucursal Norte', 'Sucursal Sur'];
const daysOfWeek = [
  { value: 'monday', label: 'Lunes' },
  { value: 'tuesday', label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday', label: 'Jueves' },
  { value: 'friday', label: 'Viernes' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' },
];

// 1. Añadimos un prop para recibir la especialidad activa del Sidebar
interface AgendaManagerProps {
  activeSpecialty?: string;
}

export default function AgendaManager({ activeSpecialty = 'Cardiología' }: AgendaManagerProps) {
  const [activeTab, setActiveTab] = useState<'regular' | 'exceptional'>('regular');
  
  // Estado para Agenda Regular
  const [regularSchedule, setRegularSchedule] = useState<RegularScheduleItem[]>([]);
  const [regularDuration, setRegularDuration] = useState(30);
  const [regularBranch, setRegularBranch] = useState(branches[0]);
  
  // Estado para Agenda Excepcional
  const [exceptionType, setExceptionType] = useState<'availability' | 'non-availability'>('non-availability');
  const [exceptionStartDate, setExceptionStartDate] = useState('');
  const [exceptionEndDate, setExceptionEndDate] = useState('');
  const [exceptionReason, setExceptionReason] = useState('');
  const [exceptionSpecialty, setExceptionSpecialty] = useState(specialties[0]);

  // Manejadores para Agenda Regular (sin cambios funcionales)
  const addRegularDay = () => setRegularSchedule([...regularSchedule, { id: Date.now(), day: 'monday', startTime: '09:00', endTime: '17:00' }]);
  const updateRegularDay = (id: number, field: string, value: string) => setRegularSchedule(regularSchedule.map(item => item.id === id ? { ...item, [field]: value } : item));
  const removeRegularDay = (id: number) => setRegularSchedule(regularSchedule.filter(item => item.id !== id));

  const handleSaveRegular = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Guardando Agenda Regular para la especialidad:', activeSpecialty);
    console.log({
      duration: regularDuration,
      branch: regularBranch,
      schedule: regularSchedule,
    });
    // API call: await fetch('/api/medico/agenda/regular', { body: JSON.stringify({ specialty: activeSpecialty, ... }) });
  };

  // Manejadores para Agenda Excepcional (sin cambios funcionales)
  const handleSaveException = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Guardando Excepción:', {
      type: exceptionType,
      startDate: exceptionStartDate,
      endDate: exceptionEndDate,
      reason: exceptionReason,
      specialty: activeSpecialty, // La especialidad ahora siempre se envía
    });
    // API call: await fetch('/api/medico/agenda/excepcional', { ... });
  };


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
          <form onSubmit={handleSaveRegular} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700">Configuración de Horario para <span className="text-blue-600">{activeSpecialty}</span></h2>
            {/* --- 2. ELIMINADO EL SELECTOR DE ESPECIALIDAD DE AQUÍ --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duración promedio (minutos)</label>
                <select id="duration" value={regularDuration} onChange={e => setRegularDuration(Number(e.target.value))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                </select>
              </div>
              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Sucursal</label>
                <select id="branch" value={regularBranch} onChange={e => setRegularBranch(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                  {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h2 className="text-xl font-bold text-gray-700">Días y Horas de Trabajo</h2>
              <div className="space-y-4 mt-4">
                {regularSchedule.map(item => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-3 bg-gray-50 rounded-md">
                    <select value={item.day} onChange={e => updateRegularDay(item.id, 'day', e.target.value)} className="p-2 border border-gray-300 rounded-md">
                      {daysOfWeek.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                    <input type="time" value={item.startTime} onChange={e => updateRegularDay(item.id, 'startTime', e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                    <input type="time" value={item.endTime} onChange={e => updateRegularDay(item.id, 'endTime', e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                    <button type="button" onClick={() => removeRegularDay(item.id)} className="text-red-500 hover:text-red-700 flex items-center justify-center"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addRegularDay} className="mt-4 flex items-center gap-2 text-blue-600 font-semibold"><Plus size={18} /> Añadir día de trabajo</button>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"><Save size={18} /> Guardar Agenda Regular</button>
            </div>
          </form>
        )}

        {activeTab === 'exceptional' && (
          <form onSubmit={handleSaveException} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700">Programar una Excepción</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Excepción</label>
              <div className="flex gap-6">
                <label className="flex items-center"><input type="radio" name="exceptionType" value="non-availability" checked={exceptionType === 'non-availability'} onChange={() => setExceptionType('non-availability')} className="h-4 w-4 text-blue-600 border-gray-300"/><span className="ml-2 text-gray-700">No Disponibilidad</span></label>
                <label className="flex items-center"><input type="radio" name="exceptionType" value="availability" checked={exceptionType === 'availability'} onChange={() => setExceptionType('availability')} className="h-4 w-4 text-blue-600 border-gray-300"/><span className="ml-2 text-gray-700">Disponibilidad Extra</span></label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Inicio</label>
                <input type="datetime-local" id="startDate" value={exceptionStartDate} onChange={e => setExceptionStartDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fin</label>
                <input type="datetime-local" id="endDate" value={exceptionEndDate} onChange={e => setExceptionEndDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
              </div>
            </div>
            
            
            
            <div className="flex justify-end pt-4 border-t">
              <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"><Save size={18} /> Guardar Excepción</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}