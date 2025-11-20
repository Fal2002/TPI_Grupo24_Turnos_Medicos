// components/AppointmentScheduler.tsx

'use client';

import { useState, useMemo, FormEvent, useEffect } from 'react';
import { Stethoscope, Calendar, Clock, Check, ArrowLeft, Building, Filter } from 'lucide-react';
import { getEspecialidades } from '@/services/especialidades';
import { getMedicos } from '@/services/medicos';
import { getAgendaDisponible, createTurno, TurnoCreate } from '@/services/turnos';
import { useRouter } from 'next/navigation';

interface Specialty {
  Id_especialidad: number;
  descripcion: string;
}

interface Doctor {
  Matricula: string;
  Nombre: string;
  Apellido: string;
  especialidades: Specialty[];
}

interface AppointmentSchedulerProps {
  patientId: number | null;
}

export default function AppointmentScheduler({ patientId }: AppointmentSchedulerProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    getEspecialidades().then((data) => setSpecialties(data));
    getMedicos().then((data) => setDoctors(data));
  }, []);

  const handleSpecialtyChange = (specialtyName: string) => {
    setSelectedSpecialty(specialtyName);
    setSelectedDoctor('');
    if (specialtyName) {
      getMedicos({ especialidad: specialtyName }).then(setDoctors);
    } else {
      getMedicos().then(setDoctors);
    }
  };

  // Fetch available times when date or doctor changes
  useEffect(() => {
  if (selectedDoctor && selectedDate) {
    setLoadingTimes(true);
    getAgendaDisponible(selectedDoctor, selectedDate)
      .then((data) => {
        const times = [...new Set(data.map((item: any) => String(item.hora)))] as string[];
setAvailableTimes(times);

      })
      .catch((err) => {
        console.error("Error fetching agenda:", err);
        setAvailableTimes([]);
      })
      .finally(() => setLoadingTimes(false));
  } else {
    setAvailableTimes([]);
  }
}, [selectedDoctor, selectedDate]);


  const filteredDoctors = doctors;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      alert("Error: No se pudo identificar al paciente. Por favor, inicie sesión nuevamente.");
      return;
    }

    setIsSubmitting(true);

    const selectedDoctorInfo = doctors.find(d => d.Matricula === selectedDoctor);
    if (!selectedDoctorInfo) return;

    // Find specialty ID (assuming the doctor has the selected specialty or we use the first one if not filtered)
    // Ideally we should know which specialty ID is being booked.
    // For now, let's pick the first specialty of the doctor or the one matching the filter.
    let specialtyId = selectedDoctorInfo.especialidades[0]?.Id_especialidad;
    if (selectedSpecialty) {
      const spec = selectedDoctorInfo.especialidades.find(s => s.descripcion === selectedSpecialty);
      if (spec) specialtyId = spec.Id_especialidad;
    }

    const turnoData: TurnoCreate = {
      Fecha: selectedDate,
      Hora: selectedTime,
      Paciente_nroPaciente: patientId,
      Medico_Matricula: selectedDoctor,
      Especialidad_Id: specialtyId,
      // Sucursal_Id: ... (we might need to get this from agenda available info if needed, but backend might infer or it's optional)
      Motivo: "Turno web",
      Duracion: 30 // Default or from agenda
    };

    try {
      await createTurno(turnoData);
      alert(`¡Turno confirmado con ${selectedDoctorInfo?.Nombre} ${selectedDoctorInfo?.Apellido} para el ${selectedDate} a las ${selectedTime}!`);
      // Reset or redirect
      router.push('/portal'); // Redirect to portal home
    } catch (error: any) {
      alert(`Error al agendar turno: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmedDoctorInfo = doctors.find(d => d.Matricula === selectedDoctor);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <form onSubmit={handleSubmit}>
        {/* PASO 1 */}
        <div className={step === 1 ? 'block' : 'hidden'}>
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-6"><Stethoscope /> Paso 1: Busca un Profesional</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="specialty" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><Filter size={16} /> Filtrar por Especialidad (Opcional)</label>
              <select id="specialty" value={selectedSpecialty} onChange={(e) => handleSpecialtyChange(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md">
                <option value="">Todas las especialidades</option>
                {specialties.map(spec => <option key={spec.Id_especialidad} value={spec.descripcion}>{spec.descripcion}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">Selecciona un Profesional</label>
              <select id="doctor" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" required>
                <option value="" disabled>-- Elige un médico --</option>
                {filteredDoctors.map(doctor => <option key={doctor.Matricula} value={doctor.Matricula}>{doctor.Nombre} {doctor.Apellido}</option>)}
              </select>
            </div>
          </div>
          <div className="text-right mt-8 border-t pt-6">
            <button type="button" onClick={() => setStep(2)} disabled={!selectedDoctor} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Elegir Fecha y Hora
            </button>
          </div>
        </div>

        {/* PASO 2 */}
        <div className={step === 2 ? 'block' : 'hidden'}>
          <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-blue-600 mb-4"><ArrowLeft size={16} /> Cambiar de médico</button>
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
                  loadingTimes ? <p className="col-span-full text-sm text-gray-500">Cargando horarios...</p> :
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

        {/* PASO 3 */}
        <div className={step === 3 ? 'block' : 'hidden'}>
          <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-blue-600 mb-4"><ArrowLeft size={16} /> Cambiar fecha/hora</button>
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4"><Check /> Paso 3: Confirma tu Turno</h2>
          <div className="p-6 border rounded-lg bg-gray-50 space-y-3">
            <p className="flex items-center text-gray-800"><Stethoscope size={18} className="mr-3 text-blue-600" /><span className="font-semibold mr-2">Profesional:</span> {confirmedDoctorInfo?.Nombre} {confirmedDoctorInfo?.Apellido}</p>
            <p className="flex items-center text-gray-800"><Building size={18} className="mr-3 text-blue-600" /><span className="font-semibold mr-2">Sucursal:</span> Consultar</p>
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