/*
  # Add invoice support
  
  1. Changes
    - Add invoice_number to quotations
    - Add payment tracking fields
    - Add payments table for tracking individual payments
  
  2. Security
    - Maintains existing RLS policies
*/

-- Add payment related fields to quotations
ALTER TABLE quotations 
ADD COLUMN invoice_number text UNIQUE,
ADD COLUMN payment_status text 
  CHECK (payment_status IN ('pending', 'partial', 'paid')),
ADD COLUMN payment_date timestamptz,
ADD COLUMN payment_method text
  CHECK (payment_method IN ('cash', 'check', 'transfer', 'credit_card'));

-- Update existing status values to match new workflow
UPDATE quotations
SET status = CASE 
  WHEN status = 'final' THEN 'approved'
  ELSE status
END;

-- Add constraint after updating existing data
ALTER TABLE quotations
DROP CONSTRAINT IF EXISTS quotation_status_check,
ADD CONSTRAINT quotation_status_check 
  CHECK (status IN ('draft', 'sent', 'approved', 'invoiced', 'paid', 'cancelled'));

-- Add payment tracking table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id uuid REFERENCES quotations(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL 
    CHECK (payment_method IN ('cash', 'check', 'transfer', 'credit_card')),
  reference_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON payments
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON payments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create function to update quotation payment status
CREATE OR REPLACE FUNCTION update_quotation_payment_status()
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
  quotation_total AS (
    SELECT id, total
    FROM quotations
    WHERE id = NEW.quotation_id
  )
  UPDATE quotations q
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
  FROM payment_totals pt, quotation_total qt
  WHERE q.id = NEW.quotation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_status
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_quotation_payment_status();