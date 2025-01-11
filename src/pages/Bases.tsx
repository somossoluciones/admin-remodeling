import React from 'react';
import { Plus, Pencil, X, Check, Loader2 } from 'lucide-react';
import { useBases } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';

interface EditingBase {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
}

const Bases = () => {
  const { bases, loading, error } = useBases();
  const [editingBase, setEditingBase] = React.useState<EditingBase | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleEdit = (base: EditingBase) => {
    setEditingBase(base);
  };

  const handleCancel = () => {
    setEditingBase(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!editingBase) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('bases')
        .update({
          name: editingBase.name,
          price: editingBase.price,
          is_active: editingBase.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingBase.id);

      if (error) throw error;
      
      // Refresh the page to get updated data
      window.location.reload();
    } catch (err) {
      console.error('Error updating base:', err);
      alert('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
      setEditingBase(null);
    }
  };

  const handleCreate = async () => {
    if (!editingBase) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('bases')
        .insert({
          name: editingBase.name,
          price: editingBase.price,
          is_active: editingBase.is_active
        });

      if (error) throw error;
      
      // Refresh the page to get updated data
      window.location.reload();
    } catch (err) {
      console.error('Error creating base:', err);
      alert('Error al crear la base');
    } finally {
      setIsSaving(false);
      setEditingBase(null);
      setIsCreating(false);
    }
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingBase({
      id: 'new',
      name: '',
      price: 0,
      is_active: true
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
        Error al cargar las bases
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bases</h1>
        <button
          onClick={startCreating}
          disabled={isCreating}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Base
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-4">Nombre</th>
                <th className="pb-4">Precio</th>
                <th className="pb-4">Estado</th>
                <th className="pb-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isCreating && (
                <tr className="border-b">
                  <td className="py-4">
                    <input
                      type="text"
                      value={editingBase?.name || ''}
                      onChange={(e) => setEditingBase(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Nombre de la base"
                    />
                  </td>
                  <td className="py-4">
                    <input
                      type="number"
                      value={editingBase?.price || 0}
                      onChange={(e) => setEditingBase(prev => prev ? {...prev, price: Number(e.target.value)} : null)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Precio"
                    />
                  </td>
                  <td className="py-4">
                    <select
                      value={editingBase?.is_active ? 'true' : 'false'}
                      onChange={(e) => setEditingBase(prev => prev ? {...prev, is_active: e.target.value === 'true'} : null)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
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
              {bases.map(base => (
                <tr key={base.id} className="border-b">
                  {editingBase?.id === base.id ? (
                    <>
                      <td className="py-4">
                        <input
                          type="text"
                          value={editingBase.name}
                          onChange={(e) => setEditingBase(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-4">
                        <input
                          type="number"
                          value={editingBase.price}
                          onChange={(e) => setEditingBase(prev => prev ? {...prev, price: Number(e.target.value)} : null)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-4">
                        <select
                          value={editingBase.is_active.toString()}
                          onChange={(e) => setEditingBase(prev => prev ? {...prev, is_active: e.target.value === 'true'} : null)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="true">Activo</option>
                          <option value="false">Inactivo</option>
                        </select>
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
                      <td className="py-4">{base.name}</td>
                      <td className="py-4">${base.price.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          base.is_active 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {base.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleEdit(base)}
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

export default Bases;