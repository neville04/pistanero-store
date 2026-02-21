
-- Add checkout fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS transaction_id text,
ADD COLUMN IF NOT EXISTS delivery_method text NOT NULL DEFAULT 'pickup',
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS phone text;

-- Update status default to 'pending' (already is, but let's be explicit)
-- Valid statuses will be: pending, processing, delivered
