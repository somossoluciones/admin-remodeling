/*
  # Initial schema setup for MRQZ Remodeling

  1. New Tables
    - `bases`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (numeric)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `services`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (numeric)
      - `category` (text)
      - `unit` (text)
      - `multiplier` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `properties`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `units`
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key)
      - `code` (text)
      - `base_price` (numeric)
      - `square_feet` (numeric)
      - `bedrooms` (integer)
      - `bathrooms` (numeric)
      - `has_balcony` (boolean)
      - `has_curtains` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `quotations`
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key)
      - `unit_id` (uuid, foreign key)
      - `unit_number` (text)
      - `base_id` (uuid, foreign key)
      - `change_orders` (integer)
      - `change_orders_total` (numeric)
      - `total` (numeric)
      - `notes` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `quotation_items`
      - `id` (uuid, primary key)
      - `quotation_id` (uuid, foreign key)
      - `type` (text)
      - `service_id` (uuid, foreign key)
      - `name` (text)
      - `price` (numeric)
      - `quantity` (integer)
      - `multiplier` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bases table
CREATE TABLE bases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON bases
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON bases
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON bases
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  unit text,
  multiplier integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON services
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Properties table
CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Units table
CREATE TABLE units (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  code text NOT NULL,
  base_price numeric NOT NULL CHECK (base_price >= 0),
  square_feet numeric NOT NULL CHECK (square_feet > 0),
  bedrooms integer NOT NULL CHECK (bedrooms >= 0),
  bathrooms numeric NOT NULL CHECK (bathrooms >= 0),
  has_balcony boolean DEFAULT false,
  has_curtains boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON units
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON units
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON units
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Quotations table
CREATE TABLE quotations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid REFERENCES properties(id),
  unit_id uuid REFERENCES units(id),
  unit_number text NOT NULL,
  base_id uuid REFERENCES bases(id),
  change_orders integer DEFAULT 0,
  change_orders_total numeric DEFAULT 0,
  total numeric NOT NULL CHECK (total >= 0),
  notes text,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON quotations
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON quotations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON quotations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Quotation items table
CREATE TABLE quotation_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id uuid REFERENCES quotations(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('base', 'service', 'changeOrder')),
  service_id uuid REFERENCES services(id),
  name text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  quantity integer DEFAULT 1,
  multiplier integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON quotation_items
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON quotation_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON quotation_items
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO bases (name, price, is_active) VALUES
  ('BASE 1', 2000, true),
  ('BASE 2', 2600, true);

INSERT INTO services (name, price, category, unit, multiplier) VALUES
  ('CHIMNEY B', 250, 'Estructural', 'Unidad', 1),
  ('BARN DOORS', 75, 'Carpintería', 'X2', 2),
  ('BATH TUB', 300, 'Plomería', 'Unidad', 1),
  ('MIRRORS', 35, 'Acabados', 'X2', 2);

INSERT INTO properties (name, address) VALUES
  ('The Lakes Apartments', 'Denver, CO 80210'),
  ('Meridian', 'Denver, CO');

-- Insert sample units for The Lakes Apartments
WITH prop AS (SELECT id FROM properties WHERE name = 'The Lakes Apartments' LIMIT 1)
INSERT INTO units (property_id, code, base_price, square_feet, bedrooms, bathrooms, has_balcony, has_curtains)
SELECT 
  prop.id,
  'A1',
  2000,
  850,
  1,
  1,
  true,
  true
FROM prop
UNION ALL
SELECT 
  prop.id,
  'B1',
  2600,
  1100,
  2,
  2,
  true,
  true
FROM prop;

-- Insert sample units for Meridian
WITH prop AS (SELECT id FROM properties WHERE name = 'Meridian' LIMIT 1)
INSERT INTO units (property_id, code, base_price, square_feet, bedrooms, bathrooms, has_balcony, has_curtains)
SELECT 
  prop.id,
  'A1',
  1800,
  800,
  1,
  1,
  false,
  true
FROM prop
UNION ALL
SELECT 
  prop.id,
  'B1',
  2400,
  1000,
  2,
  2,
  true,
  true
FROM prop;