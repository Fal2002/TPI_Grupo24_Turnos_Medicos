// components/DoctorAppointments.tsx

'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { Calendar, Clock, User, Edit, Trash2, Check, Play, Plus, X, Pill, Eye, FileText } from 'lucide-react';

// --- Tipos de Datos Expandidos ---
type Prescription = { id: number; medicine: string; quantity: number };
type Appointment = {
  id: number;
  patientName: string;
  specialty: string;
  dateTime: string;
  reason: string; // 1. Añadimos el motivo
  status: 'Confirmado' | 'Pendiente' | 'Atendiendo' | 'Finalizado' | 'Cancelado' | 'Ausente';
  diagnosis: string;
  prescriptions: Prescription[];
};

// --- Datos Falsos (Mock Data) con más detalle ---
const mockAppointments: Appointment[] = [
  { id: 1, patientName: 'Carlos Sánchez', specialty: 'Cardiología', dateTime: '2025-12-20T10:30:00', reason: 'Control anual', status: 'Ausente', diagnosis: '', prescriptions: [] },
  { id: 2, patientName: 'Maria Rodriguez', specialty: 'Cardiología', dateTime: '2025-12-20T11:00:00', reason: 'Dolor en el pecho', status: 'Pendiente', diagnosis: '', prescriptions: [{id: 1, medicine: 'Aspirina 100mg', quantity: 30}] },
  { id: 3, patientName: 'Lucia Fernández', specialty: 'Clínica General', dateTime: '2025-12-21T09:00:00', reason: 'Chequeo de rutina', status: 'Confirmado', diagnosis: '', prescriptions: [] },
  { id: 4, patientName: 'Pedro Gómez', specialty: 'Cardiología', dateTime: '2025-10-01T14:30:00', reason: 'Seguimiento post-operatorio', status: 'Finalizado', diagnosis: 'Arritmia leve controlada.', prescriptions: [{id: 2, medicine: 'Aspirina Prevent 100mg', quantity: 60}] },
  { id: 5, patientName: 'Ana Perez', specialty: 'Clínica General', dateTime: '2025-12-22T15:00:00', reason: 'Consulta por gripe', status: 'Cancelado', diagnosis: '', prescriptions: [] },
];
const mockMedicines = ['Paracetamol 500mg', 'Ibuprofeno 400mg', 'Amoxicilina 875mg', 'Loratadina 10mg', 'Aspirina 100mg'];

const statusStyles: Record<Appointment['status'], string> = {
  Confirmado: 'border-blue-500', Pendiente: 'border-yellow-500',
  Atendiendo: 'border-teal-500 animate-pulse', Finalizado: 'border-green-500',
  Cancelado: 'border-gray-400 opacity-60',
    Ausente: 'border-red-500 opacity-60',
};

// --- Componente Principal ---
export default function DoctorAppointments({ activeSpecialty }: { activeSpecialty: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<'edit' | 'Cancelado' | 'Atendiendo' | 'Finalizado' | 'prescriptions' | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    setTimeout(() => { setAppointments(mockAppointments); setIsLoading(false); }, 500);
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(app => app.specialty === activeSpecialty)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [appointments, activeSpecialty]);
  
  // --- Manejadores de Estado y Acciones ---
  const handleOpenModal = (type: typeof modal, appointment: Appointment) => {
    setSelectedAppointment({ ...appointment });
    setModal(type);
  };
  
  const handleCloseModals = () => setModal(null);
  
  const handleStatusChange = (newStatus: Appointment['status']) => {
    if (!selectedAppointment) return;
    setAppointments(prev => prev.map(app => app.id === selectedAppointment.id ? { ...app, status: newStatus } : app));
    handleCloseModals();
  };
  
  const handleSaveChanges = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    setAppointments(prev => prev.map(app => app.id === selectedAppointment.id ? selectedAppointment : app));
    handleCloseModals();
  };

  const handleAddPrescription = (medicine: string, quantity: number) => {
    if (!selectedAppointment || !medicine || quantity <= 0) return;
    const newPrescription: Prescription = { id: Date.now(), medicine, quantity };
    setSelectedAppointment(prev => prev ? { ...prev, prescriptions: [...prev.prescriptions, newPrescription] } : null);
  };

  const isAtendiendo = (status: Appointment['status']) => status === 'Atendiendo';
  const isFinalizado = (status: Appointment['status']) => status === 'Finalizado';
  const isCancelado = (status: Appointment['status']) => status === 'Cancelado';
  
  const isPastAppointment = (dateTime: string) =>{
   if ((new Date(dateTime) < new Date()) )return true;
   return false;
  };
  const formatDateTime = (iso: string) => new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(iso));

  if (isLoading) return <div>Cargando turnos...</div>;

  return (
    <div className="space-y-6">
      {filteredAppointments.length > 0 ? (
        filteredAppointments.map(app => {
          const isPast = isPastAppointment(app.dateTime);
          const isCancel = isCancelado(app.status);
          const isAtend = isAtendiendo(app.status);
          const isFinal = isFinalizado(app.status);
          return (
            <div key={app.id} className={`p-5 rounded-lg shadow-md border-l-4 ${statusStyles[app.status]}`}>
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <p className="font-bold text-lg text-gray-800 flex items-center gap-2"><User size={20}/> {app.patientName}</p>
                  <p className="text-gray-600 flex items-center gap-2 mt-1"><Calendar size={16}/> {formatDateTime(app.dateTime)}</p>
                  <p className="text-gray-600 flex items-center gap-2 mt-1"><FileText size={16}/> Motivo: <span className="italic">{app.reason}</span></p>
                  <p className={`mt-2 text-sm font-semibold`}>Estado: {app.status}</p>
                </div>
                <div className="flex flex-wrap items-start gap-2 mt-4 md:mt-0">
                  <button onClick={() => handleOpenModal('prescriptions', app)} disabled={isCancel} className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-100 text-purple-700 font-semibold rounded-md hover:bg-purple-200"><Pill size={16}/> Recetas</button>
                  <button onClick={() => handleOpenModal('Atendiendo', app)} disabled={isPast || isCancel || isAtend || isFinal} className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 disabled:bg-gray-100 disabled:text-gray-400"><Play size={16}/></button>
                  <button onClick={() => handleOpenModal('Finalizado', app)} disabled={isPast || isCancel || isFinal} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400"><Check size={16}/></button>
                  <button onClick={() => handleOpenModal('edit', app)} disabled={isPast || isCancel || isAtend || isFinal} className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400"><Edit size={16}/></button>
                  <button onClick={() => handleOpenModal('Cancelado', app)} disabled={isPast || isCancel || isFinal} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No hay turnos agendados para esta especialidad.</p>
      )}

      {/* --- MODALES --- */}
      {selectedAppointment && (
        <>
          {/* Modal de Edición */}
          {modal === 'edit' && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <form onSubmit={handleSaveChanges} className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Editar Turno de {selectedAppointment.patientName}</h2>
                <div className="space-y-4">
                  <input type="datetime-local" value={selectedAppointment.dateTime.substring(0, 16)} onChange={e => setSelectedAppointment({...selectedAppointment, dateTime: e.target.value})} className="w-full p-2 border rounded-md"/>
                  <textarea placeholder="Diagnóstico..." rows={4} value={selectedAppointment.diagnosis} onChange={e => setSelectedAppointment({...selectedAppointment, diagnosis: e.target.value})} className="w-full p-2 border rounded-md"></textarea>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={handleCloseModals} className="px-4 py-2 rounded-md bg-gray-200">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">Guardar Cambios</button>
                </div>
              </form>
            </div>
          )}

          {/* Modal de Recetas */}
          {modal === 'prescriptions' && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Recetas para {selectedAppointment.patientName}</h2>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Recetas Actuales</h3>
                  {selectedAppointment.prescriptions.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">{selectedAppointment.prescriptions.map(p => <li key={p.id}>{p.medicine} (Cantidad: {p.quantity})</li>)}</ul>
                  ) : <p>No hay recetas.</p>}
                </div>
                {isAtendiendo(selectedAppointment.status) && (<form onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); handleAddPrescription(data.get('medicine') as string, Number(data.get('quantity'))); e.currentTarget.reset(); }} className="border-t pt-4 space-y-2">
                   <h3 className="font-semibold mb-2">Añadir Nueva Receta</h3>
                   <select name="medicine" className="w-full p-2 border rounded-md" ><option value="">Seleccionar medicamento...</option>{mockMedicines.map(m => <option key={m} value={m}>{m}</option>)}</select>
                   <input type="number" name="quantity" placeholder="Cantidad" min="1" className="w-full p-2 border rounded-md"/>
                   <button type="submit" className="px-4 py-2 rounded-md bg-purple-600 text-white w-full">Añadir Receta</button>
                </form>)}
                <div className="text-right mt-4"><button onClick={handleCloseModals} className="px-4 py-2 rounded-md bg-gray-200">Cerrar</button></div>
              </div>
            </div>
          )}
          
          {/* Modales de Confirmación Simples */}
          {['Cancelado', 'Atendiendo', 'Finalizado'].includes(modal || '') && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
                 <h2 className="text-xl font-bold mb-2">Confirmar Acción</h2>
                 <p className="text-gray-600 mb-4">¿Estás seguro de que quieres marcar este turno como <span className="font-semibold">{modal}?</span></p>
                 <div className="flex justify-center gap-4 mt-6">
                   <button onClick={handleCloseModals} className="px-6 py-2 rounded-md bg-gray-200">No, volver</button>
                   <button onClick={() => handleStatusChange(modal as Appointment['status'])} className="px-6 py-2 rounded-md bg-blue-600 text-white">Sí, confirmar</button>
                 </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}