-- =============================================================
-- Fix experience table: Add missing column + RPC function
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================

-- Step 1: Add the missing is_development column
ALTER TABLE experience ADD COLUMN IF NOT EXISTS is_development boolean DEFAULT true;

-- Step 2: Set existing non-dev entries (adjust company names as needed)
UPDATE experience SET is_development = false WHERE company ILIKE '%BestMobile%';

-- Step 3: Company and bullet links
ALTER TABLE experience ADD COLUMN IF NOT EXISTS company_url text;
ALTER TABLE experience ADD COLUMN IF NOT EXISTS links jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE experience ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;

-- Step 4: Replace the RPC so new link fields can be saved
DO $$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT oid::regprocedure AS signature
    FROM pg_proc
    WHERE proname = 'upsert_experience'
  LOOP
    EXECUTE 'DROP FUNCTION ' || fn.signature;
  END LOOP;
END $$;

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
  p_is_development boolean DEFAULT true,
  p_company_url text DEFAULT '',
  p_links jsonb DEFAULT '[]'::jsonb
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
      is_development = p_is_development,
      company_url = p_company_url,
      links = COALESCE(p_links, '[]'::jsonb)
    WHERE id = p_id;
    
    SELECT row_to_json(e) INTO result
    FROM experience e WHERE e.id = p_id;
  ELSE
    INSERT INTO experience (company, position, duration, location, type, description, skills, logo_url, is_development, company_url, links)
    VALUES (p_company, p_position, p_duration, p_location, p_type, p_description, p_skills, p_logo_url, p_is_development, p_company_url, COALESCE(p_links, '[]'::jsonb))
    RETURNING row_to_json(experience) INTO result;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Grant permissions
GRANT EXECUTE ON FUNCTION upsert_experience(bigint, text, text, text, text, text, text, text[], text, boolean, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_experience(bigint, text, text, text, text, text, text, text[], text, boolean, text, jsonb) TO service_role;

UPDATE experience
SET
  company_url = 'https://devsinc.com/',
  links = '[
    {"label":"Agents Anywhere","url":"https://agentsanywhere.ai/"},
    {"label":"VeriCasa","url":"https://vericasa.com/en"}
  ]'::jsonb
WHERE company = 'Devsinc';

UPDATE experience
SET
  company_url = 'https://www.linkedin.com/company/directorate-of-information-technology-gcu-lahore/',
  links = '[
    {"label":"GCU LMS","url":"https://lms.gcu.edu.pk/"},
    {"label":"GCU Societies Portal","url":"https://societies.gcu.edu.pk:10580/"},
    {"label":"GCU SFC","url":"https://sfc.gcu.edu.pk/"}
  ]'::jsonb
WHERE company = 'Directorate of Information Technology, GCU';

-- Step 6: Notify PostgREST to reload schema (picks up new column)
NOTIFY pgrst, 'reload schema';
