import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Shield, 
  Coffee, 
  Car, 
  Lightbulb,
  ArrowLeft,
  Calendar as CalendarIcon,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Mock data
const venueDetails = {
  1: {
    name: "Green Valley Sports Complex",
    sport: "Football",
    sportEmoji: "⚽",
    price: 50,
    rating: 4.8,
    reviewCount: 124,
    location: "123 Downtown Street, City Center",
    distance: "2.3 km away",
    description: "Premium football ground with natural grass surface, perfect for competitive matches and training sessions. The facility features professional-grade turf, changing rooms, and ample parking space.",
    images: [
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
      "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800",
    ],
    amenities: [
      { icon: <Users className="w-5 h-5" />, name: "Changing Rooms" },
      { icon: <Car className="w-5 h-5" />, name: "Free Parking" },
      { icon: <Lightbulb className="w-5 h-5" />, name: "Floodlights" },
      { icon: <Coffee className="w-5 h-5" />, name: "Cafeteria" },
      { icon: <Shield className="w-5 h-5" />, name: "Security" },
    ],
    host: {
      name: "John Anderson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      joinedDate: "Member since 2022",
      rating: 4.9,
      venues: 3,
    },
    reviews: [
      {
        id: 1,
        user: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        rating: 5,
        date: "2 weeks ago",
        comment: "Excellent facility! The grass is well-maintained and the changing rooms are clean. Highly recommend for weekend games.",
      },
      {
        id: 2,
        user: "Sarah Williams",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        rating: 4,
        date: "1 month ago",
        comment: "Great ground overall. Would love to see more lighting for evening matches. Otherwise perfect!",
      },
      {
        id: 3,
        user: "David Kumar",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        rating: 5,
        date: "2 months ago",
        comment: "Best football ground in the area. Easy booking process and excellent facilities.",
      },
    ],
    availableSlots: [
      "06:00 AM - 08:00 AM",
      "08:00 AM - 10:00 AM",
      "04:00 PM - 06:00 PM",
      "06:00 PM - 08:00 PM",
      "08:00 PM - 10:00 PM",
    ],
  },
};

const VenueDetails = () => {
  const { id } = useParams();
  const venue = venueDetails[Number(id) as keyof typeof venueDetails] || venueDetails[1];
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [booking, setBooking] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to book a venue.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedSlot) {
      toast({
        title: "Select a time slot",
        description: "Please choose an available time slot to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Select a date",
        description: "Please choose a booking date.",
        variant: "destructive",
      });
      return;
    }

    setBooking(true);

    try {
      // For demo purposes, map route IDs to actual venue UUIDs
      const venueIdMap: Record<string, string> = {
        '1': '11111111-1111-1111-1111-111111111111',
        '2': '22222222-2222-2222-2222-222222222222',
        '3': '33333333-3333-3333-3333-333333333333',
        '4': '44444444-4444-4444-4444-444444444444',
        '5': '55555555-5555-5555-5555-555555555555',
        '6': '66666666-6666-6666-6666-666666666666',
      };
      
      const actualVenueId = venueIdMap[id || '1'];

      // Create booking in database with pending status
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          venue_id: actualVenueId,
          booking_date: selectedDate.toISOString().split('T')[0],
          time_slot: selectedSlot,
          price: venue.price,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: {
          bookingId: bookingData.id,
          amount: venue.price,
          venueName: venue.name,
          bookingDate: selectedDate.toLocaleDateString(),
          timeSlot: selectedSlot
        }
      });

      if (checkoutError) throw checkoutError;

      // Redirect to Stripe Checkout
      if (checkoutData?.url) {
        window.open(checkoutData.url, '_blank');
        
        toast({
          title: "Redirecting to payment",
          description: "Please complete your payment in the new tab to confirm your booking.",
        });
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/explore">
              <ArrowLeft className="mr-2" />
              Back to Explore
            </Link>
          </Button>

          {/* Image Gallery */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 animate-fade-in">
            <div className="md:col-span-2 h-96 relative rounded-xl overflow-hidden">
              <img
                src={venue.images[currentImageIndex]}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold">
                {venue.sportEmoji} {venue.sport}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {venue.images.slice(1).map((img, index) => (
                <div
                  key={index}
                  className="h-44 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setCurrentImageIndex(index + 1)}
                >
                  <img
                    src={img}
                    alt={`${venue.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Venue Info */}
              <Card className="p-6 animate-scale-in">
                <h1 className="text-3xl font-bold italic mb-4">{venue.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-bold text-lg">{venue.rating}</span>
                    <span className="text-muted-foreground">({venue.reviewCount} reviews)</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {venue.distance}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{venue.description}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{venue.location}</span>
                </div>
              </Card>

              {/* Amenities */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold italic mb-6">Amenities</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {venue.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="text-primary">{amenity.icon}</div>
                      <span className="font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Host Info */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold italic mb-6">Meet Your Host</h2>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={venue.host.avatar} />
                    <AvatarFallback>{venue.host.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{venue.host.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{venue.host.joinedDate}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="font-bold">{venue.host.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{venue.host.venues} venues</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Reviews */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold italic mb-6">Reviews</h2>
                <div className="space-y-6">
                  {venue.reviews.map(review => (
                    <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold">{review.user}</h4>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                            ))}
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24 animate-scale-in">
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-primary">${venue.price}</span>
                    <span className="text-muted-foreground"> / hour</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Date Picker */}
                  <div>
                    <Label className="text-base font-bold mb-3 block flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Select Date
                    </Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      disabled={(date) => date < new Date()}
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <Label className="text-base font-bold mb-3 block flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Available Slots
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {venue.availableSlots.map(slot => (
                        <Button
                          key={slot}
                          variant={selectedSlot === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSlot(slot)}
                          className="text-xs"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handleBooking}
                    disabled={booking || !selectedSlot}
                  >
                    {booking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Book Now"
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment via Stripe. Earn 5% credits on confirmed bookings!
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);

export default VenueDetails;
