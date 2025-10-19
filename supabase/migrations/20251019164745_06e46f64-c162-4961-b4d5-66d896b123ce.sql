-- Fix profiles table RLS - restrict to authenticated users only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Add policy for hosts to view payments for their venue bookings
CREATE POLICY "Hosts can view payments for their venue bookings" 
ON public.payments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM public.bookings b
    JOIN public.venues v ON b.venue_id = v.id
    WHERE b.id = payments.booking_id
      AND v.host_id = auth.uid()
  )
);