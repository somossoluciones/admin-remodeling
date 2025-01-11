import React from 'react';
import { BarChart3, Building2, DollarSign, PlusCircle, TrendingUp, CreditCard, Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties, useProjects } from '../hooks/useSupabase';

interface PropertyStats {
  count: number;
  revenue: number;
}

interface ServiceStats {
  count: number;
  revenue: number;
}

const calculateStats = () => {
  let totalProjects = 0;
  let totalRevenue = 0;
  let totalPending = 0;
  let totalPaid = 0;
  let propertyStats: Record<string, PropertyStats> = {};
  let serviceStats: Record<string, ServiceStats> = {};

  return {
    totalProjects,
    totalRevenue,
    totalPending,
    totalPaid,
    propertyStats,
    serviceStats,
    averageProjectValue: totalProjects > 0 ? totalRevenue / totalProjects : 0
  };
};

const Dashboard = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { properties, loading: propertiesLoading } = useProperties();

  const stats = React.useMemo(() => {
    let totalProjects = 0;
    let totalRevenue = 0;
    let totalPending = 0;
    let totalPaid = 0;
    let propertyStats: Record<string, PropertyStats> = {};
    let serviceStats: Record<string, ServiceStats> = {};

    projects?.forEach(project => {
      totalProjects++;
      totalRevenue += project.total;
      
      if (project.payment_status === 'paid') {
        totalPaid += project.total;
      } else {
        totalPending += project.total;
      }

      // Property stats
      const propertyName = (project.property as any)?.name || 'Unknown';
      if (!propertyStats[propertyName]) {
        propertyStats[propertyName] = { count: 0, revenue: 0 };
      }
      propertyStats[propertyName].count++;
      propertyStats[propertyName].revenue += project.total;

      // Service stats
      (project.items as any[])?.forEach(item => {
        if (item.type === 'service') {
          if (!serviceStats[item.name]) {
            serviceStats[item.name] = { count: 0, revenue: 0 };
          }
          serviceStats[item.name].count++;
          serviceStats[item.name].revenue += item.price * (item.multiplier || 1);
        }
      });
    });

    return {
      totalProjects,
      totalRevenue,
      totalPending,
      totalPaid,
      propertyStats,
      serviceStats,
      averageProjectValue: totalProjects > 0 ? totalRevenue / totalProjects : 0
    };
  }, [projects]);

  if (projectsLoading || propertiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
        <Link
          to="/projects/new"
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Nuevo Proyecto
        </Link>
      </div>
      
      {/* Draft Projects Section */}
      {projects?.some(p => p.status === 'draft') && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-gray-600" />
            Borradores
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propiedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects
                    ?.filter(p => p.status === 'draft')
                    .map(project => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(project.property as any)?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {project.unit_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(project.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${project.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link
                            to={`/projects/${project.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow flex items-start">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
            <p className="text-2xl font-semibold text-gray-900">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow flex items-start">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Pagos Recibidos</h3>
            <p className="text-2xl font-semibold text-gray-900">
              ${stats.totalPaid.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow flex items-start">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Pagos Pendientes</h3>
            <p className="text-2xl font-semibold text-gray-900">
              ${stats.totalPending.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow flex items-start">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Proyectos</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalProjects}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow flex items-start">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Promedio por Proyecto</h3>
            <p className="text-2xl font-semibold text-gray-900">
              ${Math.round(stats.averageProjectValue).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Estadísticas por Propiedad</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Propiedad</th>
                  <th className="pb-3">Proyectos</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Pagado</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.propertyStats).map(([property, data]) => (
                  <tr key={property} className="border-b">
                    <td className="py-3">{property}</td>
                    <td className="py-3">{data.count}</td>
                    <td className="py-3">${data.revenue.toLocaleString('en-US')}</td>
                    <td className="py-3">${(data.revenue * 0.8).toLocaleString('en-US')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Servicios Más Solicitados</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Servicio</th>
                  <th className="pb-3">Cantidad</th>
                  <th className="pb-3">% del Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.serviceStats)
                  .sort((a, b) => b[1].count - a[1].count)
                  .slice(0, 5)
                  .map(([service, data]) => (
                    <tr key={service} className="border-b">
                      <td className="py-3">{service}</td>
                      <td className="py-3">{data.count}</td>
                      <td className="py-3 text-right">
                        {stats.totalProjects > 0
                          ? Math.round((data.count / stats.totalProjects) * 100)
                          : 0}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;