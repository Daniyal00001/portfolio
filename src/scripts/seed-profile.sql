-- Insert Profile Data (Dynamic Header/Hero)
-- We need to know the User ID to insert into profiles, but for simplicity in this script 
-- we will use a workaround or just expect the user to run this after they have signed up.
-- HOWEVER, since RLS checks `auth.uid() = id`, we can't easily insert via SQL script unless we know the ID or disable RLS temporarily.
-- STRATEGY: We will creating a bucket and just inserting a row that matches the admin email if possible, 
-- but SQL doesn't easily let us look up auth.users by email in all contexts due to permissions.

-- ALTERNATIVE: We can just insert a record with a specific ID if we knew it.
-- But since we confirmed the email, we technically know the user exists.

-- BETTER APPROACH for this script:
-- We will use a "public" profile concept or just insert it and let the user claim it,
-- OR better yet, since I am the admin running this, I can use the dashboard.

-- BUT user wants "script".
-- Let's try to fetch the ID based on email if we are running as superuser (which SQL Editor usually is).

DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Try to find the user by email
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'faheemiqbalm@gmail.com' LIMIT 1;

  IF target_user_id IS NOT NULL THEN
    -- Delete existing profile to avoid conflict
    DELETE FROM profiles WHERE id = target_user_id;

    -- Insert new profile
    INSERT INTO profiles (
      id,
      name,
      role,
      summary,
      email,
      phone,
      address,
      nationality,
      social_linkedin,
      social_github,
      social_portfolio,
      resume_url,
      image_url
    ) VALUES (
      target_user_id,
      'Muhammad Faheem Iqbal',
      'Software Engineer | Frontend Developer',
      'ReactJS Frontend Developer with over 1 year of experience building scalable, responsive, and user-friendly web applications.',
      'faheemiqbalm@gmail.com',
      '+92 (332) 5194976',
      'Khanna Pul, Islamabad, Pakistan',
      'Pakistani',
      'https://www.linkedin.com/in/faheem506pk/',
      'https://github.com/faheem506pk',
      'https://faheem506pk.vercel.app',
      '/assets/PDF/CV/Muhammad_Faheem_Iqbal_CV.pdf', -- Keeping asset path as requested
      '/assets/images/dp.jpg' -- Placeholder, assuming user will upload or has one
    );
  END IF;
END $$;
