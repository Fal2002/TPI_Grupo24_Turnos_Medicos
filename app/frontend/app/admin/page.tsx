"use client";
import { FC, useState, useEffect } from 'react';
import { getMedicos } from '@/services/medicos';
import { getPacientes } from '@/services/pacientes';
import { getConsultorios } from '@/services/consultorios';
import { Users, UserRound, Building2, Stethoscope } from 'lucide-react';

const AnotacionPage: FC = () => {
  const [stats, setStats] = useState({
    medicos: 0,
    pacientes: 0,
    consultorios: 0,
  });
  const [specialtyStats, setSpecialtyStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medicos, pacientes, consultorios] = await Promise.all([
          getMedicos(),
          getPacientes(),
          getConsultorios()
        ]);

        // Calculate specialty stats
        const specCounts: Record<string, number> = {};
        if (Array.isArray(medicos)) {
          medicos.forEach((medico: any) => {
            if (medico.especialidades && Array.isArray(medico.especialidades)) {
              medico.especialidades.forEach((spec: any) => {
                const name = spec.descripcion;
                specCounts[name] = (specCounts[name] || 0) + 1;
              });
            }
          });
        }

        setStats({
          medicos: Array.isArray(medicos) ? medicos.length : 0,
          pacientes: Array.isArray(pacientes) ? pacientes.length : 0,
          consultorios: Array.isArray(consultorios) ? consultorios.length : 0,
        });
        setSpecialtyStats(specCounts);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando resumen...</div>;
  }

  const maxSpecialtyCount = Math.max(...Object.values(specialtyStats), 1);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Resumen General de la Clínica</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Stethoscope size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Médicos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.medicos}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <Users size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pacientes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pacientes}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
            <Building2 size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Consultorios</p>
            <p className="text-2xl font-bold text-gray-900">{stats.consultorios}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Specialty Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Médicos por Especialidad</h2>
          <div className="space-y-4">
            {Object.entries(specialtyStats).length > 0 ? (
              Object.entries(specialtyStats)
                .sort(([, a], [, b]) => b - a)
                .map(([name, count]) => (
                  <div key={name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{name}</span>
                      <span className="text-gray-500">{count} médicos</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxSpecialtyCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay datos de especialidades disponibles.</p>
            )}
          </div>
        </div>

        {/* Quick Actions or Other Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Información Adicional</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Bienvenido al panel de administración. Desde aquí puede gestionar los recursos de la clínica.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Gestione el personal médico y sus horarios.</li>
              <li>Administre la base de datos de pacientes.</li>
              <li>Configure consultorios y sucursales.</li>
              <li>Supervise las especialidades ofrecidas.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnotacionPage;
