/*
  # Update payments table structure

  1. Changes
    - Drop existing trigger and function
    - Update column name from quotation_id to project_id
    - Update trigger function to use new column names
*/

-- Drop the old trigger first
DROP TRIGGER IF EXISTS update_payment_status ON payments;

-- Drop the old function
DROP FUNCTION IF EXISTS update_project_payment_status();

-- Drop the old foreign key constraint
ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS payments_quotation_id_fkey,
  DROP CONSTRAINT IF EXISTS payments_project_id_fkey;

-- Rename the column
ALTER TABLE payments
  RENAME COLUMN quotation_id TO project_id;

-- Add the new foreign key constraint
ALTER TABLE payments
  ADD CONSTRAINT payments_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Create the new trigger function with updated column references
CREATE OR REPLACE FUNCTION update_project_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  WITH payment_totals AS (
    SELECT 
      project_id,
      SUM(amount) as total_paid
    FROM payments
    WHERE project_id = NEW.project_id
    GROUP BY project_id
  ),
  project_total AS (
    SELECT id, total
    FROM projects
    WHERE id = NEW.project_id
  )
  UPDATE projects p
  SET 
    payment_status = 
      CASE 
        WHEN pt.total_paid >= project_total.total THEN 'paid'
        WHEN pt.total_paid > 0 THEN 'partial'
        ELSE 'pending'
      END,
    payment_date = 
      CASE 
        WHEN pt.total_paid >= project_total.total THEN NOW()
        ELSE payment_date
      END,
    status = 
      CASE 
        WHEN pt.total_paid >= project_total.total THEN 'paid'
        ELSE status
      END
  FROM payment_totals pt, project_total
  WHERE p.id = NEW.project_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the new trigger
CREATE TRIGGER update_payment_status
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_project_payment_status();