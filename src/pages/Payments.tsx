import React from 'react';
import { Check, Loader2, Search } from 'lucide-react';
import { useProjects } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';

const Payments = () => {
  const { projects, loading, error } = useProjects();
  const [search, setSearch] = React.useState('');
  const [selectedProject, setSelectedProject] = React.useState<any>(null);
  const [paymentAmount, setPaymentAmount] = React.useState<number>(0);
  const [paymentMethod, setPaymentMethod] = React.useState<string>('cash');
  const [referenceNumber, setReferenceNumber] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    return projects.filter(q => 
      q.status !== 'paid' && 
      (q.unit_number.toLowerCase().includes(search.toLowerCase()) ||
       (q.property as any)?.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [projects, search]);

  const handlePayment = async () => {
    if (!selectedProject || !paymentAmount) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          project_id: selectedProject.id,
          amount: paymentAmount,
          payment_method: paymentMethod,
          reference_number: referenceNumber || null,
          notes: notes || null
        });

      if (error) throw error;
      
      // Reset form
      setSelectedProject(null);
      setPaymentAmount(0);
      setPaymentMethod('cash');
      setReferenceNumber('');
      setNotes('');
      
      // Refresh page
      window.location.reload();
    } catch (err) {
      console.error('Error registering payment:', err);
      alert('Error al registrar el pago');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error al cargar los proyectos
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Pagos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar proyecto por unidad o propiedad..."
              className="w-full border-b border-gray-200 focus:border-blue-500 outline-none py-1"
            />
          </div>
          
          <div className="space-y-4">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedProject?.id === project.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => {
                  setSelectedProject(project);
                  setPaymentAmount(
                    project.total - 
                    (project.items as any[])?.reduce((sum, item) => 
                      sum + (item.paid_amount || 0), 0) || 0
                  );
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">
                      {(project.property as any)?.name} - Unit {project.unit_number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Fecha: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${project.total.toLocaleString()}</p>
                    <p className={`text-sm ${
                      project.payment_status === 'paid' 
                        ? 'text-green-600'
                        : project.payment_status === 'partial'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {project.payment_status === 'paid' 
                        ? 'Pagado'
                        : project.payment_status === 'partial'
                        ? 'Pago Parcial'
                        : 'Pendiente'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-6">Registrar Pago</h2>
          
          {selectedProject ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2"
                  min="0"
                  max={selectedProject.total}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="cash">Efectivo</option>
                  <option value="check">Cheque</option>
                  <option value="transfer">Transferencia</option>
                  <option value="credit_card">Tarjeta de Crédito</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Referencia
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Opcional"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 h-24"
                  placeholder="Notas adicionales..."
                />
              </div>
              
              <button
                onClick={handlePayment}
                disabled={isSaving || !paymentAmount}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                <Check className="w-5 h-5 mr-2" />
                Registrar Pago
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Selecciona un proyecto para registrar el pago
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payments;