export interface Base {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
  unit?: string;
  multiplier?: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  units: UnitType[];
  additionalInfo?: string;
}

export interface UnitType {
  id: string;
  code: string;  // A1, B1, C1, etc.
  basePrice: number;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  hasBalcony: boolean;
  hasCurtains: boolean;
}

export interface ChangeOrder {
  id: string;
  name: string;
  category: 'repair' | 'plumbing' | 'electrical' | 'painting' | 'cleaning' | 'other';
  price: number;
  quantity?: number;
  unit?: string;
  notes?: string;
}

export interface QuotationItem {
  id: string;
  type: 'base' | 'service' | 'changeOrder';
  name: string;
  price: number;
  quantity?: number;
  multiplier?: number;
  category?: string;
  notes?: string;
}

export interface Project {
  id: string;
  propertyName: string;
  unitNumber: string;
  unitType: string;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  items: QuotationItem[];
  changeOrders: number;
  changeOrderTotal: number;
  total: number;
  date: string;
  status: 'draft' | 'sent' | 'approved' | 'invoiced' | 'paid' | 'cancelled';
  payment_status?: 'pending' | 'partial' | 'paid';
  payment_date?: string;
  notes?: string;
}