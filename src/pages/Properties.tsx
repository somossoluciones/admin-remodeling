import React from 'react';
import { Plus, Pencil, X, Check, Loader2, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { useProperties } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';

interface EditingProperty {
  id: string;
  name: string;
  address: string;
}

interface EditingUnit {
  id: string;
  property_id: string;
  code: string;
  base_price: number;
  square_feet: number;
  bedrooms: number;
  bathrooms: number;
  has_balcony: boolean;
  has_curtains: boolean;
}

const Properties = () => {
  const { properties, loading, error } = useProperties();
  const [editingProperty, setEditingProperty] = React.useState<EditingProperty | null>(null);
  const [editingUnit, setEditingUnit] = React.useState<EditingUnit | null>(null);
  const [expandedProperty, setExpandedProperty] = React.useState<string | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isCreatingUnit, setIsCreatingUnit] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleEdit = (property: EditingProperty) => {
    setEditingProperty(property);
  };

  const handleEditUnit = (unit: EditingUnit) => {
    setEditingUnit(unit);
  };

  const handleCancel = () => {
    setEditingProperty(null);
    setIsCreating(false);
  };

  const handleCancelUnit = () => {
    setEditingUnit(null);
    setIsCreatingUnit(null);
  };

  const handleSave = async () => {
    if (!editingProperty) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          name: editingProperty.name,
          address: editingProperty.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProperty.id);

      if (error) throw error;
      
      window.location.reload();
    } catch (err) {
      console.error('Error updating property:', err);
      alert('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
      setEditingProperty(null);
    }
  };

  const handleSaveUnit = async () => {
    if (!editingUnit) return;
    
    setIsSaving(true);
    try {
      if (editingUnit.id === 'new') {
        const { error } = await supabase
          .from('units')
          .insert({
            property_id: editingUnit.property_id,
            code: editingUnit.code,
            base_price: editingUnit.base_price,
            square_feet: editingUnit.square_feet,
            bedrooms: editingUnit.bedrooms,
            bathrooms: editingUnit.bathrooms,
            has_balcony: editingUnit.has_balcony,
            has_curtains: editingUnit.has_curtains
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('units')
          .update({
            code: editingUnit.code,
            base_price: editingUnit.base_price,
            square_feet: editingUnit.square_feet,
            bedrooms: editingUnit.bedrooms,
            bathrooms: editingUnit.bathrooms,
            has_balcony: editingUnit.has_balcony,
            has_curtains: editingUnit.has_curtains,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingUnit.id);

        if (error) throw error;
      }
      
      window.location.reload();
    } catch (err) {
      console.error('Error saving unit:', err);
      alert('Error al guardar la unidad');
    } finally {
      setIsSaving(false);
      setEditingUnit(null);
      setIsCreatingUnit(null);
    }
  };

  const handleCreate = async () => {
    if (!editingProperty) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .insert({
          name: editingProperty.name,
          address: editingProperty.address
        });

      if (error) throw error;
      
      window.location.reload();
    } catch (err) {
      console.error('Error creating property:', err);
      alert('Error al crear la propiedad');
    } finally {
      setIsSaving(false);
      setEditingProperty(null);
      setIsCreating(false);
    }
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingProperty({
      id: 'new',
      name: '',
      address: '',
      additional_info: ''
    });
  };

  const startCreatingUnit = (propertyId: string) => {
    setIsCreatingUnit(propertyId);
    setEditingUnit({
      id: 'new',
      property_id: propertyId,
      code: '',
      base_price: 0,
      square_feet: 0,
      bedrooms: 1,
      bathrooms: 1,
      has_balcony: false,
      has_curtains: false
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
        Error al cargar las propiedades
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Propiedades</h1>
        <button
          onClick={startCreating}
          disabled={isCreating}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Propiedad
        </button>
      </div>
      
      <div className="space-y-6">
        {isCreating && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editingProperty?.name || ''}
                  onChange={(e) => setEditingProperty(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Nombre de la propiedad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={editingProperty?.address || ''}
                  onChange={(e) => setEditingProperty(prev => prev ? {...prev, address: e.target.value} : null)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Dirección"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Información Adicional
                </label>
                <textarea
                  value={editingProperty?.additional_info || ''}
                  onChange={(e) => setEditingProperty(prev => prev ? {...prev, additional_info: e.target.value} : null)}
                  className="w-full border rounded px-3 py-2 h-24"
                  placeholder="Información adicional sobre la propiedad..."
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={handleCreate}
                disabled={isSaving}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {properties?.map(property => (
          <div key={property.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              {editingProperty?.id === property.id ? (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={editingProperty.name}
                      onChange={(e) => setEditingProperty(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={editingProperty.address}
                      onChange={(e) => setEditingProperty(prev => prev ? {...prev, address: e.target.value} : null)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Información Adicional
                    </label>
                    <textarea
                      value={editingProperty?.additional_info || ''}
                      onChange={(e) => setEditingProperty(prev => prev ? {...prev, additional_info: e.target.value} : null)}
                      className="w-full border rounded px-3 py-2 h-24"
                      placeholder="Información adicional sobre la propiedad..."
                    />
                  </div>
                  <div className="col-span-2 flex justify-end space-x-3">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Building2 className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-semibold">{property.name}</h3>
                      <p className="text-gray-600">{property.address}</p>
                      {property.additional_info && (
                        <p className="text-sm text-gray-500 mt-1">{property.additional_info}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleEdit(property)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setExpandedProperty(
                        expandedProperty === property.id ? null : property.id
                      )}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedProperty === property.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {expandedProperty === property.id && (
              <div className="border-t">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Unidades</h4>
                    <button
                      onClick={() => startCreatingUnit(property.id)}
                      className="flex items-center text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Nueva Unidad
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2">Código</th>
                          <th className="pb-2">Precio Base</th>
                          <th className="pb-2">Pies²</th>
                          <th className="pb-2">Hab</th>
                          <th className="pb-2">Baños</th>
                          <th className="pb-2">Balcón</th>
                          <th className="pb-2">Cortinas</th>
                          <th className="pb-2">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isCreatingUnit === property.id && (
                          <tr className="border-b">
                            <td className="py-2">
                              <input
                                type="text"
                                value={editingUnit?.code || ''}
                                onChange={(e) => setEditingUnit(prev => prev ? {...prev, code: e.target.value} : null)}
                                className="w-full border rounded px-2 py-1"
                                placeholder="A1"
                              />
                            </td>
                            <td className="py-2">
                              <input
                                type="number"
                                value={editingUnit?.base_price || 0}
                                onChange={(e) => setEditingUnit(prev => prev ? {...prev, base_price: Number(e.target.value)} : null)}
                                className="w-full border rounded px-2 py-1"
                              />
                            </td>
                            <td className="py-2">
                              <input
                                type="number"
                                value={editingUnit?.square_feet || 0}
                                onChange={(e) => setEditingUnit(prev => prev ? {...prev, square_feet: Number(e.target.value)} : null)}
                                className="w-full border rounded px-2 py-1"
                              />
                            </td>
                            <td className="py-2">
                              <input
                                type="number"
                                value={editingUnit?.bedrooms || 1}
                                onChange={(e) => setEditingUnit(prev => prev ? {...prev, bedrooms: Number(e.target.value)} : null)}
                                className="w-full border rounded px-2 py-1"
                              />
                            </td>
                            <td className="py-2">
                              <input
                                type="number"
                                value={editingUnit?.bathrooms || 1}
                                onChange={(e) => setEditingUnit(prev => prev ? {...prev, bathrooms: Number(e.target.value)} : null)}
                                className="w-full border rounded px-2 py-1"
                              />
                            </td>
                            <td className="py-2">
                              <input
                                type="checkbox"
                                checked={editingUnit?.has_balcony || false}
                                onChange={(e) => setEditingUnit(prev => prev ? {...prev, has_balcony: e.target.checked} : null)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="py-2">
                              <input
                                type="checkbox"
                                checked={editingUnit?.has_curtains || false}
                                onChange={(e) => setEditingUnit(prev => prev ? {...prev, has_curtains: e.target.checked} : null)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="py-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={handleSaveUnit}
                                  disabled={isSaving}
                                  className="text-green-500 hover:text-green-700"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={handleCancelUnit}
                                  disabled={isSaving}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                        {property.units?.map((unit: any) => (
                          <tr key={unit.id} className="border-b">
                            {editingUnit?.id === unit.id ? (
                              <>
                                <td className="py-2">
                                  <input
                                    type="text"
                                    value={editingUnit.code}
                                    onChange={(e) => setEditingUnit(prev => prev ? {...prev, code: e.target.value} : null)}
                                    className="w-full border rounded px-2 py-1"
                                  />
                                </td>
                                <td className="py-2">
                                  <input
                                    type="number"
                                    value={editingUnit.base_price}
                                    onChange={(e) => setEditingUnit(prev => prev ? {...prev, base_price: Number(e.target.value)} : null)}
                                    className="w-full border rounded px-2 py-1"
                                  />
                                </td>
                                <td className="py-2">
                                  <input
                                    type="number"
                                    value={editingUnit.square_feet}
                                    onChange={(e) => setEditingUnit(prev => prev ? {...prev, square_feet: Number(e.target.value)} : null)}
                                    className="w-full border rounded px-2 py-1"
                                  />
                                </td>
                                <td className="py-2">
                                  <input
                                    type="number"
                                    value={editingUnit.bedrooms}
                                    onChange={(e) => setEditingUnit(prev => prev ? {...prev, bedrooms: Number(e.target.value)} : null)}
                                    className="w-full border rounded px-2 py-1"
                                  />
                                </td>
                                <td className="py-2">
                                  <input
                                    type="number"
                                    value={editingUnit.bathrooms}
                                    onChange={(e) => setEditingUnit(prev => prev ? {...prev, bathrooms: Number(e.target.value)} : null)}
                                    className="w-full border rounded px-2 py-1"
                                  />
                                </td>
                                <td className="py-2">
                                  <input
                                    type="checkbox"
                                    checked={editingUnit.has_balcony}
                                    onChange={(e) => setEditingUnit(prev => prev ? {...prev, has_balcony: e.target.checked} : null)}
                                    className="rounded border-gray-300"
                                  />
                                </td>
                                <td className="py-2">
                                  <input
                                    type="checkbox"
                                    checked={editingUnit.has_curtains}
                                    onChange={(e) => setEditingUnit(prev => prev ? {...prev, has_curtains: e.target.checked} : null)}
                                    className="rounded border-gray-300"
                                  />
                                </td>
                                <td className="py-2">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={handleSaveUnit}
                                      disabled={isSaving}
                                      className="text-green-500 hover:text-green-700"
                                    >
                                      <Check className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={handleCancelUnit}
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
                                <td className="py-2">{unit.code}</td>
                                <td className="py-2">${unit.base_price.toLocaleString()}</td>
                                <td className="py-2">{unit.square_feet}</td>
                                <td className="py-2">{unit.bedrooms}</td>
                                <td className="py-2">{unit.bathrooms}</td>
                                <td className="py-2">{unit.has_balcony ? '✓' : '—'}</td>
                                <td className="py-2">{unit.has_curtains ? '✓' : '—'}</td>
                                <td className="py-2">
                                  <button
                                    onClick={() => handleEditUnit(unit)}
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties;