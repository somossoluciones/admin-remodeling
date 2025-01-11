export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bases: {
        Row: {
          id: string
          name: string
          price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          price: number
          category: string
          unit: string | null
          multiplier: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          category: string
          unit?: string | null
          multiplier?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          category?: string
          unit?: string | null
          multiplier?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          name: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      units: {
        Row: {
          id: string
          property_id: string
          code: string
          base_price: number
          square_feet: number
          bedrooms: number
          bathrooms: number
          has_balcony: boolean
          has_curtains: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          code: string
          base_price: number
          square_feet: number
          bedrooms: number
          bathrooms: number
          has_balcony?: boolean
          has_curtains?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          code?: string
          base_price?: number
          square_feet?: number
          bedrooms?: number
          bathrooms?: number
          has_balcony?: boolean
          has_curtains?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      quotations: {
        Row: {
          id: string
          property_id: string
          unit_id: string
          unit_number: string
          base_id: string
          change_orders: number
          change_orders_total: number
          total: number
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          unit_id: string
          unit_number: string
          base_id: string
          change_orders?: number
          change_orders_total?: number
          total: number
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          unit_id?: string
          unit_number?: string
          base_id?: string
          change_orders?: number
          change_orders_total?: number
          total?: number
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      quotation_items: {
        Row: {
          id: string
          quotation_id: string
          type: string
          service_id: string | null
          name: string
          price: number
          quantity: number
          multiplier: number
          created_at: string
        }
        Insert: {
          id?: string
          quotation_id: string
          type: string
          service_id?: string | null
          name: string
          price: number
          quantity?: number
          multiplier?: number
          created_at?: string
        }
        Update: {
          id?: string
          quotation_id?: string
          type?: string
          service_id?: string | null
          name?: string
          price?: number
          quantity?: number
          multiplier?: number
          created_at?: string
        }
      }
    }
  }
}