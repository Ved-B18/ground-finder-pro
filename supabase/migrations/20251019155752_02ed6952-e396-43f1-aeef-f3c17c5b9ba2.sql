-- Create venues table
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sport TEXT NOT NULL,
  sport_emoji TEXT,
  location TEXT NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  credits_used DECIMAL(10,2) DEFAULT 0,
  credits_earned DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  credits_earned DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, booking_id)
);

-- Enable RLS
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Venues RLS Policies
CREATE POLICY "Anyone can view venues"
  ON public.venues FOR SELECT
  USING (true);

CREATE POLICY "Hosts can create venues"
  ON public.venues FOR INSERT
  WITH CHECK (auth.uid() = host_id AND public.has_role(auth.uid(), 'host'));

CREATE POLICY "Hosts can update own venues"
  ON public.venues FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete own venues"
  ON public.venues FOR DELETE
  USING (auth.uid() = host_id);

-- Bookings RLS Policies
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Hosts can view bookings for their venues"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE venues.id = bookings.venue_id
      AND venues.host_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Payments RLS Policies
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Reviews RLS Policies
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for own bookings"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Function to calculate and award credits after booking
CREATE OR REPLACE FUNCTION public.award_booking_credits()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  credits_amount DECIMAL(10,2);
BEGIN
  -- Calculate 5% of booking price
  credits_amount := NEW.price * 0.05;
  
  -- Update booking with earned credits
  NEW.credits_earned := credits_amount;
  
  -- Add credits to user profile
  UPDATE public.profiles
  SET credits = credits + credits_amount
  WHERE id = NEW.user_id;
  
  -- Create payment record
  INSERT INTO public.payments (user_id, booking_id, amount, credits_earned)
  VALUES (NEW.user_id, NEW.id, NEW.price, credits_amount);
  
  RETURN NEW;
END;
$$;

-- Trigger to award credits on booking
CREATE TRIGGER award_credits_on_booking
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.award_booking_credits();

-- Function to update venue rating
CREATE OR REPLACE FUNCTION public.update_venue_rating()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.venues
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM public.reviews
      WHERE venue_id = NEW.venue_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE venue_id = NEW.venue_id
    )
  WHERE id = NEW.venue_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update venue rating on review
CREATE TRIGGER update_rating_on_review
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_venue_rating();

-- Triggers for updated_at
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON public.venues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();