-- Add the 'images' column to the 'projects' table as a text array
-- This allows storing multiple image URLs for the carousel feature

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Optional: If you want to migrate existing data from 'image_url' to 'images'
-- UPDATE projects 
-- SET images = ARRAY[image_url] 
-- WHERE image_url IS NOT NULL AND (images IS NULL OR array_length(images, 1) IS NULL);
