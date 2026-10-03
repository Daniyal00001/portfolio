-- =============================================================
-- Fix experience table: Add missing column + RPC function
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================

-- Step 1: Add the missing is_development column
ALTER TABLE experience ADD COLUMN IF NOT EXISTS is_development boolean DEFAULT true;

-- Step 2: Set existing non-dev entries (adjust company names as needed)
UPDATE experience SET is_development = false WHERE company ILIKE '%BestMobile%';

-- Step 3: Create RPC function to bypass PostgREST schema cache
CREATE OR REPLACE FUNCTION upsert_experience(
  p_id bigint DEFAULT NULL,
  p_company text DEFAULT '',
  p_position text DEFAULT '',
  p_duration text DEFAULT '',
  p_location text DEFAULT '',
  p_type text DEFAULT '',
  p_description text DEFAULT '',
  p_skills text[] DEFAULT '{}',
  p_logo_url text DEFAULT '',
  p_is_development boolean DEFAULT true
)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  IF p_id IS NOT NULL THEN
    UPDATE experience SET
      company = p_company,
      position = p_position,
      duration = p_duration,
      location = p_location,
      type = p_type,
      description = p_description,
      skills = p_skills,
      logo_url = p_logo_url,
      is_development = p_is_development
    WHERE id = p_id;
    
    SELECT row_to_json(e) INTO result
    FROM experience e WHERE e.id = p_id;
  ELSE
    INSERT INTO experience (company, position, duration, location, type, description, skills, logo_url, is_development)
    VALUES (p_company, p_position, p_duration, p_location, p_type, p_description, p_skills, p_logo_url, p_is_development)
    RETURNING row_to_json(experience) INTO result;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION upsert_experience TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_experience TO service_role;

-- Step 5: Notify PostgREST to reload schema (picks up new column)
NOTIFY pgrst, 'reload schema';
