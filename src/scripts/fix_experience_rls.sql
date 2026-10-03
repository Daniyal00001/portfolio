-- Fix: Grant permissions on ALL experience table columns to authenticated users
-- This resolves "Could not find column in schema cache" errors

-- 1. Grant full table access to authenticated users
GRANT ALL ON TABLE experience TO authenticated;
GRANT SELECT ON TABLE experience TO anon;

-- 2. Ensure RLS is enabled with correct policies
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow public read" ON experience;
DROP POLICY IF EXISTS "Allow authenticated all" ON experience;
DROP POLICY IF EXISTS "Public read access" ON experience;
DROP POLICY IF EXISTS "Authenticated full access" ON experience;

-- Create clean policies
CREATE POLICY "Public read access" ON experience
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated full access" ON experience
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Force PostgREST to reload its schema cache 
-- (This is the key step that makes newly added columns visible)
NOTIFY pgrst, 'reload schema';
