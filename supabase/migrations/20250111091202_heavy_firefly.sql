/*
  # Fix foreign key relationships after table renames

  1. Changes
    - Drop and recreate foreign key constraints with correct references
    - Update trigger function to use correct table names
*/

-- Drop existing foreign key constraints
ALTER TABLE project_items
  DROP CONSTRAINT IF EXISTS quotation_items_quotation_id_fkey,
  DROP CONSTRAINT IF EXISTS project_items_project_id_fkey;

-- Add new foreign key constraint for project_items
ALTER TABLE project_items
  ADD CONSTRAINT project_items_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Update trigger function to use correct table references
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