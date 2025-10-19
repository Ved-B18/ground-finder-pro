import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation schema for checkout request
const checkoutRequestSchema = z.object({
  bookingId: z.string().uuid({ message: "Invalid booking ID format" }),
  amount: z.number().positive({ message: "Amount must be positive" }).max(100000, { message: "Amount exceeds maximum limit" }),
  venueName: z.string().trim().min(1, { message: "Venue name is required" }).max(200, { message: "Venue name too long" }),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (use YYYY-MM-DD)" }),
  timeSlot: z.string().trim().min(1, { message: "Time slot is required" }).max(50, { message: "Time slot too long" }),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    // Get and validate booking details from request
    const body = await req.json();
    
    // Validate request data
    const validationResult = checkoutRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      console.error("Validation error:", firstError.message);
      return new Response(JSON.stringify({ error: "Invalid request data" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { bookingId, amount, venueName, bookingDate, timeSlot } = validationResult.data;
    console.log(`Creating checkout for booking ${bookingId}, amount: ${amount}`);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log(`Found existing customer: ${customerId}`);
    } else {
      console.log("No existing customer found");
    }

    // Create a one-time payment session with dynamic pricing
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Venue Booking: ${venueName}`,
              description: `Booking for ${bookingDate} at ${timeSlot}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?booking_id=${bookingId}`,
      cancel_url: `${req.headers.get("origin")}/venue/${bookingId}`,
      metadata: {
        booking_id: bookingId,
        user_id: user.id,
      },
    });

    console.log(`Checkout session created: ${session.id}`);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    // Return generic error message to client, detailed error is logged
    return new Response(JSON.stringify({ error: "Unable to process checkout. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
