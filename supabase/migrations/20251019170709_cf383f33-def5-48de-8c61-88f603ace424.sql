-- Drop the existing check constraint
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Add updated check constraint with all needed status values
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'upcoming', 'completed', 'cancelled'));

-- Update any existing bookings that might have invalid status
UPDATE public.bookings 
SET status = 'upcoming' 
WHERE status NOT IN ('pending', 'confirmed', 'upcoming', 'completed', 'cancelled');