/*
  # Export current database data
  
  This migration exports all current data from the database tables.
  
  1. Data Exported:
    - Bases
    - Services
    - Properties
    - Units
    - Projects
    - Project Items
    - Payments
*/

-- Export bases data
INSERT INTO bases (id, name, price, is_active, created_at, updated_at)
SELECT id, name, price, is_active, created_at, updated_at
FROM bases
ON CONFLICT (id) DO NOTHING;

-- Export services data
INSERT INTO services (id, name, price, category, unit, multiplier, created_at, updated_at)
SELECT id, name, price, category, unit, multiplier, created_at, updated_at
FROM services
ON CONFLICT (id) DO NOTHING;

-- Export properties data
INSERT INTO properties (id, name, address, created_at, updated_at)
SELECT id, name, address, created_at, updated_at
FROM properties
ON CONFLICT (id) DO NOTHING;

-- Export units data
INSERT INTO units (
  id, property_id, code, base_price, square_feet, 
  bedrooms, bathrooms, has_balcony, has_curtains, 
  created_at, updated_at
)
SELECT 
  id, property_id, code, base_price, square_feet,
  bedrooms, bathrooms, has_balcony, has_curtains,
  created_at, updated_at
FROM units
ON CONFLICT (id) DO NOTHING;

-- Export projects data
INSERT INTO projects (
  id, property_id, unit_id, unit_number, base_id,
  change_orders, change_orders_total, total, notes,
  status, payment_status, payment_date, payment_method,
  created_at, updated_at
)
SELECT 
  id, property_id, unit_id, unit_number, base_id,
  change_orders, change_orders_total, total, notes,
  status, payment_status, payment_date, payment_method,
  created_at, updated_at
FROM projects
ON CONFLICT (id) DO NOTHING;

-- Export project items data
INSERT INTO project_items (
  id, project_id, type, service_id, name,
  price, quantity, multiplier, created_at
)
SELECT 
  id, project_id, type, service_id, name,
  price, quantity, multiplier, created_at
FROM project_items
ON CONFLICT (id) DO NOTHING;

-- Export payments data
INSERT INTO payments (
  id, project_id, amount, payment_method,
  reference_number, notes, created_at, created_by
)
SELECT 
  id, project_id, amount, payment_method,
  reference_number, notes, created_at, created_by
FROM payments
ON CONFLICT (id) DO NOTHING;