// components/DoctorAppointments.tsx

'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { Calendar, Clock, User, Edit, Trash2, Check, Play, Plus, X, Pill, Eye, FileText, UserX, Megaphone, Stethoscope } from 'lucide-react';
import { useMedico } from '../contexts/MedicoContext'; // Ajusta la ruta a tu contexto
import { getTurnosPorMedico, cambiarEstadoTurno, actualizarTurno } from '@/services/turnos'; // Ajusta la ruta a tu servicio
import { getPacienteByNumero } from '@/services/pacientes';
import { obtenerRecetasPorTurno, crearReceta, eliminarReceta, agregarMedicamentoAReceta, obtenerMedicamentosDeReceta, RecetaOut } from '@/services/recetas';
import { obtenerMedicamentos, MedicamentoOut } from '@/services/medicamentos';

interface Turno {
  Fecha: string;
  Hora: string;
  Motivo: string | null;
  Diagnostico: string | null;
  estado: 'Confirmado' | 'Pendiente' | 'Atendido' | 'Finalizado' | 'Cancelado' | 'Ausente' | 'Anunciado'; // Cambiado de Estado a estado
  Paciente_nroPaciente: number;
  paciente_nombre?: string;
  paciente_apellido?: string;
  Especialidad_Id: number;
  especialidad_descripcion: string;
  Medico_Matricula: string;
}

// --- Tipos de Datos Expandidos ---
type Prescription = { id: number; medicine: string; quantity: number };
type Appointment = {
  id: number;
  patientName: string;
  specialty: string;
  dateTime: string;
  reason: string; // 1. Añadimos el motivo
  status: 'Confirmado' | 'Pendiente' | 'Atendido' | 'Finalizado' | 'Cancelado' | 'Ausente' | 'Anunciado';
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
  Atendido: 'border-teal-500 animate-pulse', Finalizado: 'border-green-500',
  Cancelado: 'border-gray-400 opacity-60',
    Ausente: 'border-red-500 opacity-60',
    Anunciado: 'border-purple-500',
};

// --- Componente Principal ---
export default function DoctorAppointments() {
  const { medico, activeSpecialty } = useMedico();

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<'Cancelado' | 'Atendido' | 'Finalizado' | 'Ausente' | 'Anunciado' | 'prescriptions' | 'edit' | null>(null);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [activeTab, setActiveTab] = useState<'confirmados' | 'pendientes' | 'atendidos' | 'historial'>('confirmados');
  
  // --- Estado para Recetas y Medicamentos ---
  const [recetas, setRecetas] = useState<(RecetaOut & { medicamentos: MedicamentoOut[] })[]>([]);
  const [availableMedicamentos, setAvailableMedicamentos] = useState<MedicamentoOut[]>([]);
  const [selectedMedicamentoId, setSelectedMedicamentoId] = useState<number | ''>('');
  const [cantidad, setCantidad] = useState<string>(''); // Solo visual por ahora

  useEffect(() => {
    const fetchTurnos = async () => {
      if (!medico) return; // Si no hay médico logueado, no hacer nada

      setIsLoading(true);
      try {
        const data = await getTurnosPorMedico(medico.Matricula);
        
        // Enriquecer los turnos con los datos del paciente
        const turnosConPacientes = await Promise.all(data.map(async (turno: Turno) => {
          try {
            const paciente = await getPacienteByNumero(turno.Paciente_nroPaciente);
            return {
              ...turno,
              paciente_nombre: paciente.Nombre,
              paciente_apellido: paciente.Apellido
            };
          } catch (error) {
            console.error(`Error al cargar paciente ${turno.Paciente_nroPaciente}:`, error);
            return {
              ...turno,
              paciente_nombre: 'Desconocido',
              paciente_apellido: ''
            };
          }
        }));

        setTurnos(turnosConPacientes);
      } catch (error) {
        console.error("Error al cargar los turnos:", error);
        alert("No se pudieron cargar los turnos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTurnos();
  }, [medico]); // Se vuelve a ejecutar si cambia el médico (aunque no debería pasar en la misma sesión)

  const filteredTurnos = useMemo(() => {
    if (!activeSpecialty) return [];
    return turnos
      .filter(turno => turno.Especialidad_Id === activeSpecialty.Id_especialidad)
      .sort((a, b) => new Date(`${a.Fecha}T${a.Hora}`).getTime() - new Date(`${b.Fecha}T${b.Hora}`).getTime());
  }, [turnos, activeSpecialty]);

  const tabTurnos = useMemo(() => {
    return filteredTurnos.filter(turno => {
      if (activeTab === 'confirmados') return ['Confirmado', 'Anunciado'].includes(turno.estado);
      if (activeTab === 'pendientes') return turno.estado === 'Pendiente';
      if (activeTab === 'atendidos') return turno.estado === 'Atendido';
      if (activeTab === 'historial') return ['Finalizado', 'Cancelado', 'Ausente'].includes(turno.estado);
      return false;
    });
  }, [filteredTurnos, activeTab]);
  
  // --- Manejadores de Estado y Acciones ---
  const handleOpenModal = (type: typeof modal, turno: Turno) => {
    setSelectedTurno(turno);
    setModal(type);
  };
  
  const handleCloseModals = () => setModal(null);
  
  const handleStatusChange = async (newStatus: Turno['estado']) => {
    if (!selectedTurno) return;

    const pkData = {
      fecha: selectedTurno.Fecha,
      hora: selectedTurno.Hora,
      paciente_nro: selectedTurno.Paciente_nroPaciente,
    };

    // Mapeo de estados del frontend a acciones del backend
    const actionMap: Record<string, string> = {
      'Cancelado': 'cancelar',
      'Atendido': 'atender',
      'Finalizado': 'finalizar',
      'Confirmado': 'confirmar',
      'Ausente': 'marcarAusente',
      'Anunciado': 'anunciar',
      // 'reprogramar' y 'anunciar' no están en la UI actual pero podrían agregarse
    };

    const accion = actionMap[newStatus];

    if (!accion) {
      alert(`Estado no soportado: ${newStatus}`);
      return;
    }

    try {
      await cambiarEstadoTurno(pkData, accion);
      // Actualizamos el estado local para reflejar el cambio en la UI instantáneamente
      setTurnos(prev => 
        prev.map(turno => 
          (turno.Fecha === selectedTurno.Fecha && turno.Hora === selectedTurno.Hora && turno.Paciente_nroPaciente === selectedTurno.Paciente_nroPaciente) 
          ? { ...turno, estado: newStatus } 
          : turno
        )
      );
      alert(`Turno actualizado a: ${newStatus}`);
    } catch (error) {
      console.error("Error al cambiar el estado del turno:", error);
      alert(`No se pudo actualizar el turno: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      handleCloseModals();
    }
  };
  
  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTurno) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const fechaHora = formData.get('fechaHora') as string;
    const motivo = formData.get('motivo') as string;
    const diagnostico = formData.get('diagnostico') as string;

    // Parse fechaHora "YYYY-MM-DDTHH:mm"
    const [fecha, hora] = fechaHora.split('T');

    const pkData = {
      fecha: selectedTurno.Fecha,
      hora: selectedTurno.Hora,
      paciente_nro: selectedTurno.Paciente_nroPaciente,
    };

    const nuevosDatos: any = {};
    if (fecha !== selectedTurno.Fecha) nuevosDatos.Fecha = fecha;
    if (hora !== selectedTurno.Hora) nuevosDatos.Hora = hora;
    if (motivo !== (selectedTurno.Motivo || '')) nuevosDatos.Motivo = motivo;
    if (diagnostico !== (selectedTurno.Diagnostico || '')) nuevosDatos.Diagnostico = diagnostico;

    if (Object.keys(nuevosDatos).length === 0) {
        handleCloseModals();
        return;
    }

    try {
      await actualizarTurno(pkData, nuevosDatos);
      
      setTurnos(prev => prev.map(t => {
        if (t.Fecha === selectedTurno.Fecha && t.Hora === selectedTurno.Hora && t.Paciente_nroPaciente === selectedTurno.Paciente_nroPaciente) {
            return { 
                ...t, 
                Fecha: nuevosDatos.Fecha || t.Fecha,
                Hora: nuevosDatos.Hora || t.Hora,
                Motivo: nuevosDatos.Motivo !== undefined ? nuevosDatos.Motivo : t.Motivo,
                Diagnostico: nuevosDatos.Diagnostico !== undefined ? nuevosDatos.Diagnostico : t.Diagnostico
            };
        }
        return t;
      }));
      alert('Turno actualizado correctamente');
      handleCloseModals();
    } catch (error) {
      console.error("Error al actualizar turno:", error);
      alert(`Error al actualizar turno: ${error instanceof Error ? error.message : 'Desconocido'}`);
    }
  };

  // Cargar recetas y medicamentos al abrir el modal
  useEffect(() => {
    if (modal === 'prescriptions' && selectedTurno) {
      // 1. Cargar Medicamentos Disponibles
      obtenerMedicamentos()
        .then(setAvailableMedicamentos)
        .catch(err => console.error("Error cargando medicamentos:", err));

      // 2. Cargar Recetas del Turno
      obtenerRecetasPorTurno(selectedTurno.Fecha, selectedTurno.Hora, selectedTurno.Paciente_nroPaciente)
        .then(async (recetasData) => {
            // 3. Para cada receta, cargar sus medicamentos
            const recetasCompletas = await Promise.all(recetasData.map(async (r: { Id: number; }) => {
                try {
                    const meds = await obtenerMedicamentosDeReceta(r.Id);
                    return { ...r, medicamentos: meds };
                } catch (e) {
                    console.error(`Error cargando medicamentos para receta ${r.Id}`, e);
                    return { ...r, medicamentos: [] };
                }
            }));
            setRecetas(recetasCompletas);
        })
        .catch(err => console.error("Error cargando recetas:", err));
    }
  }, [modal, selectedTurno]);

  const handleCreateReceta = async () => {
    if (!selectedTurno) return;
    try {
      const nueva = await crearReceta({
        Turno_Fecha: selectedTurno.Fecha,
        Turno_Hora: selectedTurno.Hora,
        Turno_Paciente_nroPaciente: selectedTurno.Paciente_nroPaciente
      });
      // La nueva receta empieza sin medicamentos
      setRecetas([...recetas, { ...nueva, medicamentos: [] }]);
    } catch (error) {
      console.error(error);
      alert("Error al crear receta");
    }
  };

  const handleAddMedicamento = async (recetaId: number) => {
    if (!selectedMedicamentoId) {
        alert("Seleccione un medicamento");
        return;
    }
    try {
        await agregarMedicamentoAReceta(recetaId, Number(selectedMedicamentoId));
        
        // Actualizar estado local
        const medToAdd = availableMedicamentos.find(m => m.Id === Number(selectedMedicamentoId));
        if (medToAdd) {
            setRecetas(prev => prev.map(r => {
                if (r.Id === recetaId) {
                    return { ...r, medicamentos: [...r.medicamentos, medToAdd] };
                }
                return r;
            }));
        }
        setSelectedMedicamentoId('');
        setCantidad('');
    } catch (error) {
        console.error(error);
        alert("Error al agregar medicamento");
    }
  };

  const handleDeleteReceta = async (id: number) => {
    if (!confirm("¿Seguro que desea eliminar esta receta?")) return;
    try {
      await eliminarReceta(id);
      setRecetas(recetas.filter(r => r.Id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar receta");
    }
  };
  
  const isAtendiendo = (status: Appointment['status']) => status === 'Atendido';
  const isFinalizado = (status: Appointment['status']) => status === 'Finalizado';
  const isCancelado = (status: Appointment['status']) => status === 'Cancelado';
  
  const isPastAppointment = (fecha: string, hora: string) => {
    const appointmentDate = new Date(`${fecha}T${hora}`);
    return appointmentDate < new Date();
  };

  const formatDateTime = (fecha: string, hora: string) => 
    new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(`${fecha}T${hora}`));

  if (isLoading) return <div>Cargando turnos...</div>;

  return (
    <div className="space-y-6">
      {/* Tabs de Navegación */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('confirmados')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'confirmados' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
          }`}
        >
          Confirmados
        </button>
        <button
          onClick={() => setActiveTab('pendientes')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pendientes' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setActiveTab('atendidos')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'atendidos' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
          }`}
        >
          Atendidos
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'historial' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
          }`}
        >
          Historial
        </button>
      </div>

      {tabTurnos.length > 0 ? (
        tabTurnos.map(turno => {
          // 5. Usamos datos y lógica reales
          const uniqueKey = `${turno.Fecha}-${turno.Hora}-${turno.Paciente_nroPaciente}`;
          const isPast = isPastAppointment(turno.Fecha, turno.Hora);
          const isCancelado = turno.estado === 'Cancelado';
          const isAtendiendo = turno.estado === 'Atendido';
          const isFinalizado = turno.estado === 'Finalizado';
          return (
            <div key={uniqueKey} className={`p-5 rounded-lg shadow-md border-l-4 ${statusStyles[turno.estado]}`}>
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <p className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <User size={20}/> {`${turno.paciente_nombre} ${turno.paciente_apellido}`}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Calendar size={16}/> {formatDateTime(turno.Fecha, turno.Hora)}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <FileText size={16}/> Motivo: <span className="italic">{turno.Motivo || 'No especificado'}</span>
                  </p>
                  {activeTab === 'historial' && turno.Diagnostico && (
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <Stethoscope size={16}/> Diagnóstico: <span className="italic">{turno.Diagnostico}</span>
                    </p>
                  )}
                  <p className={`mt-2 text-sm font-semibold text-gray-700`}>Estado: <span className="font-bold">{turno.estado}</span></p>
                </div>
                <div className="flex flex-wrap items-start gap-2 mt-4 md:mt-0">
                  <button onClick={() => handleOpenModal('prescriptions', turno)} disabled={isCancelado} className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-100 text-purple-700 font-semibold rounded-md hover:bg-purple-200 disabled:opacity-50">
                    <Pill size={16}/> Recetas
                  </button>
                  {turno.estado === 'Confirmado' && (
                    <button onClick={() => handleOpenModal('Anunciado', turno)} className="p-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200" title="Anunciar Llegada">
                        <Megaphone size={16}/>
                    </button>
                  )}
                  <button onClick={() => handleOpenModal('Atendido', turno)} disabled={isPast || isCancelado || isAtendiendo || isFinalizado || turno.estado !== 'Anunciado'} className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 disabled:bg-gray-100 disabled:text-gray-400">
                    <Play size={16}/>
                  </button>
                  <button onClick={() => handleOpenModal('Finalizado', turno)} disabled={isPast || isCancelado || isFinalizado || (turno.estado !== 'Anunciado' && !isAtendiendo)} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400">
                    <Check size={16}/>
                  </button>
                  {turno.estado === 'Anunciado' && (
                    <button onClick={() => handleOpenModal('Ausente', turno)} className="p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200" title="Marcar como Ausente">
                        <UserX size={16}/>
                    </button>
                  )}
                  <button onClick={() => handleOpenModal('edit', turno)} disabled={['Finalizado', 'Cancelado', 'Ausente'].includes(turno.estado)} className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400">
                    <Edit size={16}/>
                  </button>
                  <button onClick={() => handleOpenModal('Cancelado', turno)} disabled={isPast || isCancelado || isFinalizado} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 italic">No hay turnos en la categoría <span className="font-semibold">{activeTab}</span>.</p>
      )}

      {/* --- MODALES --- */}
      {selectedTurno && (
        <>
        
          {/* Modal de Edición */}
          {modal === 'edit' && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <form onSubmit={handleSaveChanges} className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Editar Turno de {selectedTurno.paciente_nombre} {selectedTurno.paciente_apellido}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                    <input 
                        name="fechaHora"
                        type="datetime-local" 
                        defaultValue={`${selectedTurno.Fecha}T${selectedTurno.Hora}`} 
                        className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Motivo</label>
                    <textarea 
                        name="motivo"
                        placeholder="Motivo..." 
                        rows={2} 
                        defaultValue={selectedTurno.Motivo || ''} 
                        className="w-full p-2 border rounded-md"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Diagnóstico</label>
                    <textarea 
                        name="diagnostico"
                        placeholder="Diagnóstico..." 
                        rows={4} 
                        defaultValue={selectedTurno.Diagnostico || ''} 
                        className="w-full p-2 border rounded-md"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={handleCloseModals} className="px-4 py-2 rounded-md bg-gray-200">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">Guardar Cambios</button>
                </div>
              </form>
            </div>
          )}

          {/* Modal de Recetas */}
          {modal === 'prescriptions' && selectedTurno && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Recetas para {selectedTurno.paciente_nombre}</h2>
                    {selectedTurno.estado === 'Atendido' && (
                        <button 
                            onClick={handleCreateReceta}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                            <Plus size={16}/> Nueva Receta
                        </button>
                    )}
                </div>
                
                <div className="space-y-6">
                  {recetas.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay recetas generadas para este turno.</p>
                  ) : (
                    recetas.map((receta) => (
                        <div key={receta.Id} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                            <div className="flex justify-between items-center mb-3 border-b pb-2">
                                <h3 className="font-semibold text-gray-800">Receta #{receta.Id}</h3>
                                {selectedTurno.estado === 'Atendido' && (
                                    <button 
                                        onClick={() => handleDeleteReceta(receta.Id)}
                                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                                    >
                                        <Trash2 size={14} /> Eliminar Receta
                                    </button>
                                )}
                            </div>

                            {/* Lista de Medicamentos */}
                            <div className="mb-3">
                                {receta.medicamentos.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">Sin medicamentos.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {receta.medicamentos.map((med, idx) => (
                                            <li key={`${receta.Id}-${med.Id}-${idx}`} className="flex items-center gap-2 text-sm bg-white p-2 rounded border">
                                                <Pill size={14} className="text-blue-500"/>
                                                <span className="font-medium">{med.Nombre}</span>
                                                {med.dosis && <span className="text-gray-500">({med.dosis})</span>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Formulario para agregar medicamento (Solo si Atendido) */}
                            {selectedTurno.estado === 'Atendido' && (
                                <div className="mt-3 flex gap-2 items-end bg-white p-3 rounded border border-dashed border-gray-300">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Medicamento</label>
                                        <select 
                                            className="w-full p-1.5 text-sm border rounded"
                                            value={selectedMedicamentoId}
                                            onChange={(e) => setSelectedMedicamentoId(e.target.value ? Number(e.target.value) : '')}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {availableMedicamentos.map(m => (
                                                <option key={m.Id} value={m.Id}>{m.Nombre} {m.dosis ? `(${m.dosis})` : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad</label>
                                        <input 
                                            type="number" 
                                            className="w-full p-1.5 text-sm border rounded"
                                            placeholder="Cant."
                                            value={cantidad}
                                            onChange={(e) => setCantidad(e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => handleAddMedicamento(receta.Id)}
                                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                  )}
                </div>
                
                <div className="text-right border-t pt-4 mt-4">
                    <button onClick={handleCloseModals} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium">
                        Cerrar
                    </button>
                </div>
              </div>
            </div>
          )}
                  
          {/* Modales de Confirmación Simples */}
          {['Cancelado', 'Atendido', 'Finalizado', 'Ausente', 'Anunciado'].includes(modal || '') && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
                 <h2 className="text-xl font-bold mb-2">Confirmar Acción</h2>
                 <p className="text-gray-600 mb-4">¿Estás seguro de que quieres marcar este turno como <span className="font-semibold">{modal}?</span></p>
                 <div className="flex justify-center gap-4 mt-6">
                   <button onClick={handleCloseModals} className="px-6 py-2 rounded-md bg-gray-200">No, volver</button>
                   <button onClick={() => handleStatusChange(modal as Turno['estado'])} className="px-6 py-2 rounded-md bg-blue-600 text-white">Sí, confirmar</button>
                 </div>
              </div>
            </div>
          )}
        </>
      )}
	  
	  
	  
    </div>
  );}