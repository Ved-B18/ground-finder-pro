-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('venue-images', 'venue-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket policies
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Venue images bucket policies
CREATE POLICY "Anyone can view venue images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'venue-images');

CREATE POLICY "Hosts can upload venue images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'venue-images'
    AND public.has_role(auth.uid(), 'host')
  );

CREATE POLICY "Hosts can update venue images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'venue-images');

CREATE POLICY "Hosts can delete venue images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'venue-images');