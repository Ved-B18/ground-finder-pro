import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingId = searchParams.get("booking_id");
    
    if (bookingId) {
      fetchBookingDetails(bookingId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          venues (
            name,
            sport,
            sport_emoji,
            location
          )
        `)
        .eq("id", bookingId)
        .single();

      if (error) throw error;
      
      // Update booking status to confirmed
      await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId);

      setBookingDetails(data);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12 flex items-center justify-center min-h-[80vh]">
        <Card className="max-w-2xl w-full mx-4 p-8 text-center animate-scale-in">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold italic mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your booking has been confirmed
            </p>
          </div>

          {bookingDetails && (
            <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left">
              <h2 className="font-bold text-lg mb-4">Booking Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium">
                    {bookingDetails.venues?.sport_emoji} {bookingDetails.venues?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(bookingDetails.booking_date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{bookingDetails.time_slot}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{bookingDetails.venues?.location}</p>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Paid</span>
                    <span className="text-2xl font-bold text-primary">
                      ${bookingDetails.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-green-600">
                    <span className="text-sm">Credits Earned</span>
                    <span className="font-bold">
                      +${bookingDetails.credits_earned || (bookingDetails.price * 0.05).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              variant="hero" 
              className="w-full gap-2"
              onClick={() => navigate("/dashboard")}
            >
              View My Bookings
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => navigate("/")}
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
