/*
  # Fix Properties RLS Policies

  1. Changes
    - Drop existing RLS policies for properties table
    - Add new RLS policies that properly handle all operations
    - Ensure authenticated users can perform all operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON properties;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON properties;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON properties;

-- Create new policies
CREATE POLICY "Enable all operations for authenticated users" ON properties
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable read access for anonymous users" ON properties
  FOR SELECT
  TO anon
  USING (true);