-- Create the post-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read (no auth needed to view images)
CREATE POLICY "Anyone can view post images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'post-images');