-- Drop the foreign key constraint from profiles to auth.users if it exists
-- This allows single_owner mode to seed a profile without requiring an auth.users record
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Make sure id is still the primary key, but no longer enforces existing in auth.users
