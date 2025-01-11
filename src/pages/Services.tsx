import React from 'react';
import { Plus, Pencil, X, Check, Loader2 } from 'lucide-react';
import { useServices } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';

interface EditingService {
  id: string;
  name: string;
  price: number;
  category: string;
  unit: string | null;
  multiplier: number | null;
}

const Services = () => {
  const { services, loading, error } = useServices();
  const [editingService, setEditingService] = React.useState<EditingService | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const categories = ['Estructural', 'Carpintería', 'Plomería', 'Acabados', 'Eléctrico', 'Limpieza'];
  const units = ['Unidad', 'X2', 'X3', 'X4', 'Metro', 'Pie'];

  const handleEdit = (service: EditingService) => {
    setEditingService(service);
  };

  const handleCancel = () => {
    setEditingService(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!editingService) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('services')
        .update({
          name: editingService.name,
          price: editingService.price,
          category: editingService.category,
          unit: editingService.unit,
          multiplier: editingService.multiplier,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingService.id);

      if (error) throw error;
      
      // Refresh the page to get updated data
      window.location.reload();
    } catch (err) {
      console.error('Error updating service:', err);
      alert('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
      setEditingService(null);
    }
  };

  const handleCreate = async () => {
    if (!editingService) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('services')
        .insert({
          name: editingService.name,
          price: editingService.price,
          category: editingService.category,
          unit: editingService.unit,
          multiplier: editingService.multiplier
        });

      if (error) throw error;
      
      // Refresh the page to get updated data
      window.location.reload();
    } catch (err) {
      console.error('Error creating service:', err);
      alert('Error al crear el servicio');
    } finally {
      setIsSaving(false);
      setEditingService(null);
      setIsCreating(false);
    }
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingService({
      id: 'new',
      name: '',
      price: 0,
      category: categories[0],
      unit: 'Unidad',
      multiplier: 1
    });
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
        Error al cargar los servicios
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Servicios</h1>
        <button
          onClick={startCreating}
          disabled={isCreating}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Servicio
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-4">Nombre</th>
                <th className="pb-4">Categoría</th>
                <th className="pb-4">Precio</th>
                <th className="pb-4">Unidad</th>
                <th className="pb-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isCreating && (
                <tr className="border-b">
                  <td className="py-4">
                    <input
                      type="text"
                      value={editingService?.name || ''}
                      onChange={(e) => setEditingService(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Nombre del servicio"
                    />
                  </td>
                  <td className="py-4">
                    <select
                      value={editingService?.category || ''}
                      onChange={(e) => setEditingService(prev => prev ? {...prev, category: e.target.value} : null)}
                      className="w-full border rounded px-2 py-1"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4">
                    <input
                      type="number"
                      value={editingService?.price || 0}
                      onChange={(e) => setEditingService(prev => prev ? {...prev, price: Number(e.target.value)} : null)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Precio"
                    />
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <select
                        value={editingService?.unit || ''}
                        onChange={(e) => setEditingService(prev => prev ? {
                          ...prev,
                          unit: e.target.value,
                          multiplier: e.target.value.startsWith('X') ? Number(e.target.value.slice(1)) : 1
                        } : null)}
                        className="border rounded px-2 py-1"
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCreate}
                        disabled={isSaving}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {services.map(service => (
                <tr key={service.id} className="border-b">
                  {editingService?.id === service.id ? (
                    <>
                      <td className="py-4">
                        <input
                          type="text"
                          value={editingService.name}
                          onChange={(e) => setEditingService(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-4">
                        <select
                          value={editingService.category}
                          onChange={(e) => setEditingService(prev => prev ? {...prev, category: e.target.value} : null)}
                          className="w-full border rounded px-2 py-1"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4">
                        <input
                          type="number"
                          value={editingService.price}
                          onChange={(e) => setEditingService(prev => prev ? {...prev, price: Number(e.target.value)} : null)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <select
                            value={editingService.unit || ''}
                            onChange={(e) => setEditingService(prev => prev ? {
                              ...prev,
                              unit: e.target.value,
                              multiplier: e.target.value.startsWith('X') ? Number(e.target.value.slice(1)) : 1
                            } : null)}
                            className="border rounded px-2 py-1"
                          >
                            {units.map(unit => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="text-green-500 hover:text-green-700"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4">{service.name}</td>
                      <td className="py-4">{service.category}</td>
                      <td className="py-4">${service.price.toLocaleString()}</td>
                      <td className="py-4">{service.unit}</td>
                      <td className="py-4">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Services;