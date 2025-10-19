-- Add detailed venue fields for the listing form
ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS venue_type TEXT DEFAULT 'outdoor',
ADD COLUMN IF NOT EXISTS surface_type TEXT,
ADD COLUMN IF NOT EXISTS capacity INTEGER,
ADD COLUMN IF NOT EXISTS lighting_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS parking_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS changing_rooms BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS accessibility_features TEXT[],
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS directions_notes TEXT,
ADD COLUMN IF NOT EXISTS equipment_provided TEXT[],
ADD COLUMN IF NOT EXISTS extra_services TEXT[],
ADD COLUMN IF NOT EXISTS safety_measures TEXT[],
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS weekend_rate DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS deposit_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT 'flexible',
ADD COLUMN IF NOT EXISTS operating_hours_start TIME,
ADD COLUMN IF NOT EXISTS operating_hours_end TIME,
ADD COLUMN IF NOT EXISTS unavailable_dates DATE[],
ADD COLUMN IF NOT EXISTS cover_photo TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS house_rules TEXT,
ADD COLUMN IF NOT EXISTS age_restriction TEXT DEFAULT 'all_ages',
ADD COLUMN IF NOT EXISTS weather_policy TEXT,
ADD COLUMN IF NOT EXISTS additional_notes TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;

-- Create index for draft venues
CREATE INDEX IF NOT EXISTS idx_venues_status ON public.venues(status);
CREATE INDEX IF NOT EXISTS idx_venues_host_id ON public.venues(host_id);

-- Update RLS policies to allow hosts to create drafts
DROP POLICY IF EXISTS "Hosts can create venues" ON public.venues;
CREATE POLICY "Hosts can create venues" ON public.venues
  FOR INSERT
  WITH CHECK (
    auth.uid() = host_id AND 
    has_role(auth.uid(), 'host'::app_role)
  );

-- Allow hosts to update their own venue drafts
DROP POLICY IF EXISTS "Hosts can update own venues" ON public.venues;
CREATE POLICY "Hosts can update own venues" ON public.venues
  FOR UPDATE
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- Only show published venues to non-owners
DROP POLICY IF EXISTS "Anyone can view venues" ON public.venues;
CREATE POLICY "Anyone can view published venues" ON public.venues
  FOR SELECT
  USING (status = 'published' OR auth.uid() = host_id);