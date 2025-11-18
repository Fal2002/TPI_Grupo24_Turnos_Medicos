// components/AppointmentScheduler.tsx

'use client';

import { useState, useMemo, FormEvent } from 'react';
import { Stethoscope, Calendar, Clock, Check, ArrowLeft, Building, Filter } from 'lucide-react';

const specialties = ['Cardiología', 'Dermatología', 'General'];

const doctors = [
  { id: '1', name: 'Dr. Juan Morales', branch: 'Sucursal Centro', specialties: ['Cardiología', 'General'] },
  { id: '2', name: 'Dra. Ana Torres', branch: 'Sucursal Norte', specialties: ['Dermatología'] },
  { id: '3', name: 'Dr. Carlos Ruiz', branch: 'Sucursal Centro', specialties: ['General'] },
];

export default function AppointmentScheduler() {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredDoctors = useMemo(() => {
    if (!selectedSpecialty) return doctors;
    return doctors.filter(doctor => doctor.specialties.includes(selectedSpecialty));
  }, [selectedSpecialty]);
  
  // --- CORRECCIÓN AQUÍ ---
  // He restaurado la lógica completa para generar los horarios.
  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];

    const times: string[] = [];
    // Horario de ejemplo: 9:00 AM a 5:00 PM
    let startTime = new Date(`${selectedDate}T09:00:00`);
    const endTime = new Date(`${selectedDate}T17:00:00`);
    const duration = 30; // Duración en minutos

    while (startTime < endTime) {
      times.push(
        startTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      );
      startTime.setMinutes(startTime.getMinutes() + duration);
    }
    return times;
  }, [selectedDate]);
  // --- FIN DE LA CORRECCIÓN ---

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setSelectedDoctor('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // ... (resto de la lógica de submit sin cambios)
    const selectedDoctorInfo = doctors.find(d => d.id === selectedDoctor);
    alert(`¡Turno confirmado con ${selectedDoctorInfo?.name} en ${selectedDoctorInfo?.branch} para el ${selectedDate} a las ${selectedTime}!`);
    setIsSubmitting(false);
    // ... (resto de la lógica de reinicio)
  };

  const confirmedDoctorInfo = doctors.find(d => d.id === selectedDoctor);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <form onSubmit={handleSubmit}>
        {/* PASO 1 (Sin cambios) */}
        <div className={step === 1 ? 'block' : 'hidden'}>
           <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-6"><Stethoscope /> Paso 1: Busca un Profesional</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="specialty" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Filter size={16} /> Filtrar por Especialidad (Opcional)</label>
              <select id="specialty" value={selectedSpecialty} onChange={(e) => handleSpecialtyChange(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md">
                <option value="">Todas las especialidades</option>
                {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">Selecciona un Profesional</label>
              <select id="doctor" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" required>
                <option value="" disabled>-- Elige un médico --</option>
                {filteredDoctors.map(doctor => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>)}
              </select>
            </div>
          </div>
          <div className="text-right mt-8 border-t pt-6">
              <button type="button" onClick={() => setStep(2)} disabled={!selectedDoctor} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                Elegir Fecha y Hora
              </button>
            </div>
        </div>

        {/* PASO 2 (Ahora funcionará correctamente) */}
        <div className={step === 2 ? 'block' : 'hidden'}>
          <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-blue-600 mb-4"><ArrowLeft size={16}/> Cambiar de médico</button>
           <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4"><Calendar /> Paso 2: Elige Fecha y Hora</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horarios Disponibles</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {selectedDate ? (
                  availableTimes.length > 0 ? (
                    availableTimes.map(time => (
                      <button key={time} type="button" onClick={() => setSelectedTime(time)} className={`p-2 rounded-md text-sm transition-colors ${selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        {time}
                      </button>
                    ))
                  ) : (
                    <p className="col-span-full text-sm text-gray-500">No hay horarios disponibles.</p>
                  )
                ) : <p className="col-span-full text-sm text-gray-500">Selecciona una fecha para ver los horarios.</p>}
              </div>
            </div>
          </div>
          {selectedTime && (
            <div className="text-right mt-6">
              <button type="button" onClick={() => setStep(3)} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                Siguiente
              </button>
            </div>
          )}
        </div>

        {/* PASO 3 (Sin cambios) */}
        <div className={step === 3 ? 'block' : 'hidden'}>
            <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-blue-600 mb-4"><ArrowLeft size={16}/> Cambiar fecha/hora</button>
             <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4"><Check /> Paso 3: Confirma tu Turno</h2>
            <div className="p-6 border rounded-lg bg-gray-50 space-y-3">
              <p className="flex items-center text-gray-800"><Stethoscope size={18} className="mr-3 text-blue-600" /><span className="font-semibold mr-2">Profesional:</span> {confirmedDoctorInfo?.name}</p>
              <p className="flex items-center text-gray-800"><Building size={18} className="mr-3 text-blue-600" /><span className="font-semibold mr-2">Sucursal:</span> {confirmedDoctorInfo?.branch}</p>
              <p className="flex items-center text-gray-800"><Calendar size={18} className="mr-3 text-blue-600" /><span className="font-semibold mr-2">Fecha:</span> {selectedDate}</p>
              <p className="flex items-center text-gray-800"><Clock size={18} className="mr-3 text-blue-600" /><span className="font-semibold mr-2">Hora:</span> {selectedTime}</p>
            </div>
            <div className="text-right mt-6">
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-green-400">
                {isSubmitting ? 'Confirmando...' : 'Confirmar Turno'}
              </button>
            </div>
        </div>
      </form>
    </div>
  );
}