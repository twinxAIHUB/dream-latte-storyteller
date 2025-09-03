-- Debug and Fix Coffee Tasting Config Database Issues
-- Run these commands in your Supabase SQL Editor

-- 1. Check if the table exists and its structure
SELECT table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'coffee_tasting_config';

-- 2. Check existing data
SELECT * FROM coffee_tasting_config ORDER BY updated_at DESC;

-- 3. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'coffee_tasting_config';

-- 4. Enable RLS if not enabled
ALTER TABLE public.coffee_tasting_config ENABLE ROW LEVEL SECURITY;

-- 5. Create comprehensive policies for coffee_tasting_config
-- Drop existing policies first
DROP POLICY IF EXISTS "Enable read access for all users" ON public.coffee_tasting_config;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.coffee_tasting_config;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.coffee_tasting_config;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.coffee_tasting_config;

-- Create new policies
CREATE POLICY "Enable read access for all users"
ON public.coffee_tasting_config
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON public.coffee_tasting_config
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON public.coffee_tasting_config
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
ON public.coffee_tasting_config
FOR DELETE
TO authenticated
USING (true);

-- 6. Insert a test record if none exists
INSERT INTO coffee_tasting_config (
  title,
  description,
  event_date,
  start_time,
  end_time,
  max_participants,
  min_participants,
  price_per_person,
  down_payment_percentage,
  featured_coffees,
  additional_info,
  is_active,
  updated_at
) VALUES (
  'Coffee Tasting Session',
  'Join us for an exclusive coffee tasting experience',
  'September 2024',
  '10:00 AM',
  '12:00 PM',
  6,
  4,
  1000,
  50,
  'Premium coffees from our curated collection',
  '50% down payment required to secure your spot.',
  true,
  NOW()
) ON CONFLICT DO NOTHING;

-- 7. Verify the test record was inserted
SELECT * FROM coffee_tasting_config WHERE is_active = true;
