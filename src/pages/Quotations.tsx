import React from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuotationPDF from '../components/QuotationPDF';
import { sampleBases, sampleServices, sampleProperties } from '../data/sampleData';
import type { QuotationItem } from '../types';

const Projects = () => {
  const [property, setProperty] = React.useState('');
  const [unitNumber, setUnitNumber] = React.useState('');
  const [unitType, setUnitType] = React.useState('');
  const [baseId, setBaseId] = React.useState('');
  const [selectedServices, setSelectedServices] = React.useState<QuotationItem[]>([]);
  const [changeOrders, setChangeOrders] = React.useState(0);
  const [notes, setNotes] = React.useState('');

  const selectedProperty = sampleProperties.find(p => p.id === property);
  const selectedBase = sampleBases.find(b => b.id === baseId);
  const selectedUnitType = selectedProperty?.units?.find(u => u.code === unitType);

  // Calculate change orders total
  const changeOrderTotal = changeOrders * 10; // $10 per CO

  const addService = () => {
    const newService: QuotationItem = {
      id: Date.now().toString(),
      type: 'service',
      name: '',
      price: 0,
    };
    setSelectedServices([...selectedServices, newService]);
  };

  const removeService = (id: string) => {
    setSelectedServices(selectedServices.filter(s => s.id !== id));
  };

  const updateService = (id: string, serviceId: string) => {
    const service = sampleServices.find(s => s.id === serviceId);
    if (!service) return;

    setSelectedServices(selectedServices.map(s => 
      s.id === id 
        ? { 
            ...s, 
            name: service.name, 
            price: service.price,
            multiplier: service.multiplier 
          }
        : s
    ));
  };

  const calculateTotal = () => {
    const basePrice = selectedBase?.price || 0;
    const servicesTotal = selectedServices.reduce((sum, service) => {
      return sum + (service.price * (service.multiplier || 1));
    }, 0);
    return basePrice + servicesTotal + changeOrderTotal;
  };

  const quotationData = {
    id: Date.now().toString(),
    propertyName: selectedProperty?.name || '',
    unitNumber,
    unitType: selectedUnitType?.code || '',
    squareFeet: selectedUnitType?.squareFeet || 0,
    bedrooms: selectedUnitType?.bedrooms || 0,
    bathrooms: selectedUnitType?.bathrooms || 0,
    items: [
      ...(selectedBase ? [{
        id: selectedBase.id,
        type: 'base' as const,
        name: selectedBase.name,
        price: selectedBase.price,
      }] : []),
      ...selectedServices,
    ],
    changeOrders,
    changeOrderTotal,
    total: calculateTotal(),
    date: new Date().toLocaleDateString(),
    status: 'draft',
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-800 mr-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Nuevo Proyecto</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Propiedad
            </label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-2"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
            >
              <option value="">Seleccionar propiedad...</option>
              {sampleProperties.map(prop => (
                <option key={prop.id} value={prop.id}>
                  {prop.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Unidad
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
            >
              <option value="">Seleccionar tipo...</option>
              {selectedProperty?.units?.map(unit => (
                <option key={unit.id} value={unit.code}>
                  {unit.code} - {unit.bedrooms}BR/{unit.bathrooms}BA - {unit.squareFeet}sqft
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change Orders (COs)
            </label>
            <input
              type="number"
              min="0"
              value={changeOrders}
              onChange={(e) => setChangeOrders(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            {changeOrders > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Total COs: ${changeOrderTotal}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unidad
            </label>
            <input
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              type="text"
              placeholder="Número de unidad"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        
        {selectedUnitType && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Detalles de la Unidad</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Cuartos:</span> {selectedUnitType.bedrooms}
              </div>
              <div>
                <span className="text-gray-600">Baños:</span> {selectedUnitType.bathrooms}
              </div>
              <div>
                <span className="text-gray-600">Pies Cuadrados:</span> {selectedUnitType.squareFeet}
              </div>
              <div>
                <span className="text-gray-600">Balcón:</span> {selectedUnitType.hasBalcony ? 'Sí' : 'No'}
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Base</h2>
          <select 
            className="w-full border border-gray-300 rounded-lg p-2"
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
          >
            <option value="">Seleccionar base...</option>
            {sampleBases.map(base => (
              <option key={base.id} value={base.id}>
                {base.name} (${base.price.toLocaleString('en-US')})
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Servicios Adicionales</h2>
          {selectedServices.map((service, index) => (
            <div key={service.id} className="flex items-center gap-4 mb-4">
              <select
                className="flex-1 border border-gray-300 rounded-lg p-2"
                value={service.name ? sampleServices.find(s => s.name === service.name)?.id : ''}
                onChange={(e) => updateService(service.id, e.target.value)}
              >
                <option value="">Seleccionar servicio...</option>
                {sampleServices.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (${s.price.toLocaleString('en-US')}{s.multiplier ? ` X${s.multiplier}` : ''})
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeService(service.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button 
            onClick={addService}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar servicio
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas Adicionales
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 h-24"
            placeholder="Agregar notas o comentarios adicionales..."
          />
        </div>
        
        <div className="mb-8 text-right">
          <p className="text-gray-600 mb-2">
            Base: ${selectedBase?.price.toLocaleString('en-US') || 0}
          </p>
          {changeOrders > 0 && (
            <p className="text-gray-600 mb-2">
              Change Orders: ${changeOrderTotal.toLocaleString('en-US')}
            </p>
          )}
          {selectedServices.length > 0 && (
            <p className="text-gray-600 mb-2">
              Servicios: ${selectedServices.reduce((sum, service) => 
                sum + (service.price * (service.multiplier || 1)), 0).toLocaleString('en-US')}
            </p>
          )}
          <p className="text-xl font-semibold">
            Total: ${calculateTotal().toLocaleString('en-US')}
          </p>
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => {
              // Save as draft functionality
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Guardar Borrador
          </button>
          <PDFDownloadLink
            document={<QuotationPDF quotation={quotationData} />}
            fileName={`proyecto-${unitNumber}.pdf`}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {({ loading }) =>
              loading ? 'Generando PDF...' : 'Descargar PDF'
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default Projects;