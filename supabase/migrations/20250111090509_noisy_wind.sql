/*
  # Update payment references for projects

  1. Changes
    - Update foreign key reference in payments table to point to projects
    - Drop and recreate trigger to use project_id instead of quotation_id
*/

-- Drop the old trigger first
DROP TRIGGER IF EXISTS update_payment_status ON payments;

-- Drop the old function
DROP FUNCTION IF EXISTS update_project_payment_status();

-- Update the column and constraint in a single ALTER TABLE
ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS payments_quotation_id_fkey,
  ALTER COLUMN quotation_id TYPE uuid USING quotation_id::uuid,
  ALTER COLUMN quotation_id SET DEFAULT gen_random_uuid(),
  ADD CONSTRAINT payments_project_id_fkey 
    FOREIGN KEY (quotation_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Create the new trigger function
CREATE OR REPLACE FUNCTION update_project_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  WITH payment_totals AS (
    SELECT 
      quotation_id,
      SUM(amount) as total_paid
    FROM payments
    WHERE quotation_id = NEW.quotation_id
    GROUP BY quotation_id
  ),
  project_total AS (
    SELECT id, total
    FROM projects
    WHERE id = NEW.quotation_id
  )
  UPDATE projects p
  SET 
    payment_status = 
      CASE 
        WHEN pt.total_paid >= qt.total THEN 'paid'
        WHEN pt.total_paid > 0 THEN 'partial'
        ELSE 'pending'
      END,
    payment_date = 
      CASE 
        WHEN pt.total_paid >= qt.total THEN NOW()
        ELSE payment_date
      END,
    status = 
      CASE 
        WHEN pt.total_paid >= qt.total THEN 'paid'
        ELSE status
      END
  FROM payment_totals pt, project_total qt
  WHERE p.id = NEW.quotation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the new trigger
CREATE TRIGGER update_payment_status
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_project_payment_status();