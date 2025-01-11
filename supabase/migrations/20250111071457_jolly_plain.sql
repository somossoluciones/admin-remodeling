/*
  # Add additional services

  1. New Services
    - Added various new services with their respective categories and prices:
      - Structural: BIFOLD DOOR, DRYER REPLACEMENT, STOVE REPLACEMENT, etc.
      - Plumbing: WIRE BATHROOM, PLUMBING, TP HOLDER PATCH
      - Carpentry: BASEBOARD, CLOSET ASSEMBLY
      - Appliances: APPLIANCES
      - Cabinets: CABINETS, MOVE CABINETS
      - Fixtures: TOILET

  2. Security
    - Maintains existing RLS policies
*/

-- Insert new services
INSERT INTO services (name, price, category, unit, multiplier) VALUES
  ('BIFOLD DOOR', 50, 'Carpintería', 'X1', 1),
  ('DRYER REPLACEMENT', 35, 'Estructural', 'Unidad', 1),
  ('WIRE BATHROOM', 50, 'Plomería', 'Unidad', 1),
  ('DISH/STOVE REPLACEMENT', 200, 'Estructural', 'Unidad', 1),
  ('WASHER DRYER', 75, 'Estructural', 'Unidad', 1),
  ('DRYWALL REPAIR', 150, 'Estructural', 'Unidad', 1),
  ('TP HOLDER PATCH', 30, 'Plomería', 'Unidad', 1),
  ('STOVE REPLACEMENT', 100, 'Estructural', 'Unidad', 1),
  ('CABINETS', 750, 'Gabinetes', 'Unidad', 1),
  ('BASEBOARD', 288, 'Carpintería', '144LF', 1),
  ('APPLIANCES', 400, 'Electrodomésticos', 'Unidad', 1),
  ('CHIMNEY A', 100, 'Estructural', 'Unidad', 1),
  ('TOILET', 75, 'Plomería', 'Unidad', 1),
  ('PLUMBING', 125, 'Plomería', 'Unidad', 1),
  ('MOVE CABINETS', 100, 'Gabinetes', 'Unidad', 1),
  ('CLOSET ASSEMBLY', 175, 'Carpintería', 'Unidad', 1);

-- Update existing services with correct multipliers
UPDATE services 
SET multiplier = 4 
WHERE name = 'BARN DOORS' AND unit = 'X4';

UPDATE services 
SET multiplier = 6 
WHERE name = 'BARN DOORS' AND unit = 'X6';

UPDATE services 
SET multiplier = 2 
WHERE name = 'WIRE BATHROOM' AND unit = 'X2';