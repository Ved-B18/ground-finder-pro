-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS award_booking_credits_trigger ON public.bookings;

-- Recreate the function to ONLY set credits_earned, not create payment
CREATE OR REPLACE FUNCTION public.award_booking_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  credits_amount DECIMAL(10,2);
BEGIN
  -- Calculate 5% of booking price
  credits_amount := NEW.price * 0.05;
  
  -- Update booking with earned credits (this can be done in BEFORE trigger)
  NEW.credits_earned := credits_amount;
  
  RETURN NEW;
END;
$function$;

-- Create the trigger to run BEFORE INSERT
-- This will only set the credits_earned field on the booking
CREATE TRIGGER award_booking_credits_trigger
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.award_booking_credits();

-- Create a new function to handle payment creation and credit award
-- This should be called AFTER successful Stripe payment
CREATE OR REPLACE FUNCTION public.process_successful_payment(
  p_booking_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_booking RECORD;
  v_credits_amount DECIMAL(10,2);
BEGIN
  -- Get booking details
  SELECT * INTO v_booking
  FROM public.bookings
  WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;
  
  -- Calculate credits (should match what's in credits_earned)
  v_credits_amount := v_booking.credits_earned;
  
  -- Add credits to user profile
  UPDATE public.profiles
  SET credits = credits + v_credits_amount
  WHERE id = v_booking.user_id;
  
  -- Create payment record
  INSERT INTO public.payments (user_id, booking_id, amount, credits_earned)
  VALUES (v_booking.user_id, p_booking_id, v_booking.price, v_credits_amount);
  
  -- Update booking status to confirmed
  UPDATE public.bookings
  SET status = 'confirmed'
  WHERE id = p_booking_id;
END;
$function$;