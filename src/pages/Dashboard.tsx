import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  CreditCard, 
  Heart, 
  Settings,
  Plus,
  Edit,
  BarChart,
  Clock,
  Star,
  Users
} from "lucide-react";

const Dashboard = () => {
  const [userRole] = useState<"player" | "host">("player"); // Can be toggled based on actual auth

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    credits: 25,
    role: userRole,
  };

  const mockBookings = [
    {
      id: 1,
      venue: "Green Valley Sports Complex",
      sport: "⚽ Football",
      date: "2025-10-25",
      time: "06:00 PM - 08:00 PM",
      price: 50,
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400",
    },
    {
      id: 2,
      venue: "Ace Tennis Courts",
      sport: "🎾 Tennis",
      date: "2025-10-20",
      time: "04:00 PM - 05:00 PM",
      price: 40,
      status: "completed",
      image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400",
    },
  ];

  const mockPaymentHistory = [
    {
      id: 1,
      description: "Green Valley Sports Complex",
      date: "2025-10-15",
      amount: 50,
      credits: 2.5,
      status: "completed",
    },
    {
      id: 2,
      description: "Ace Tennis Courts",
      date: "2025-10-10",
      amount: 40,
      credits: 2,
      status: "completed",
    },
  ];

  const mockSavedVenues = [
    {
      id: 1,
      name: "Champions Cricket Ground",
      sport: "🏏 Cricket",
      rating: 4.7,
      price: 75,
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400",
    },
    {
      id: 4,
      name: "Slam Dunk Basketball Arena",
      sport: "🏀 Basketball",
      rating: 4.6,
      price: 45,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
    },
  ];

  const mockHostListings = [
    {
      id: 1,
      name: "My Football Ground",
      sport: "⚽ Football",
      rating: 4.8,
      bookings: 45,
      revenue: 2250,
      image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <Card className="p-8 mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold italic mb-2">{user.name}</h1>
                <p className="text-muted-foreground mb-3">{user.email}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-sm">
                    {user.role === "player" ? "Player" : "Venue Host"}
                  </Badge>
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <CreditCard className="w-5 h-5" />
                    ${user.credits} Credits
                  </div>
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue={userRole === "player" ? "bookings" : "listings"} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 h-auto">
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">My Bookings</span>
                <span className="sm:hidden">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Payments</span>
                <span className="sm:hidden">Pay</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
              </TabsTrigger>
              {userRole === "host" && (
                <TabsTrigger value="listings" className="gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">My Listings</span>
                  <span className="sm:hidden">Listings</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* My Bookings */}
            <TabsContent value="bookings" className="space-y-4 animate-fade-in">
              {mockBookings.map(booking => (
                <Card key={booking.id} className="p-6 card-hover">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={booking.image}
                      alt={booking.venue}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{booking.venue}</h3>
                          <p className="text-muted-foreground">{booking.sport}</p>
                        </div>
                        <Badge variant={booking.status === "upcoming" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {booking.time}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-2xl font-bold text-primary">${booking.price}</span>
                        {booking.status === "upcoming" && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Reschedule</Button>
                            <Button variant="destructive" size="sm">Cancel</Button>
                          </div>
                        )}
                        {booking.status === "completed" && (
                          <Button variant="outline" size="sm">
                            Book Again
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Payment History */}
            <TabsContent value="payments" className="space-y-4 animate-fade-in">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Total Credits Earned</p>
                    <p className="text-3xl font-bold text-primary">${user.credits}</p>
                  </div>
                  <CreditCard className="w-16 h-16 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Earn 5% credits on every confirmed booking!
                </p>
              </Card>

              {mockPaymentHistory.map(payment => (
                <Card key={payment.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold mb-1">{payment.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${payment.amount}</p>
                      <p className="text-sm text-primary">+${payment.credits} credits</p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Saved Venues */}
            <TabsContent value="saved" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                {mockSavedVenues.map(venue => (
                  <Link key={venue.id} to={`/venue/${venue.id}`}>
                    <Card className="overflow-hidden card-hover">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold mb-1">{venue.name}</h3>
                            <p className="text-muted-foreground text-sm">{venue.sport}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Heart className="w-5 h-5 fill-primary text-primary" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="font-bold">{venue.rating}</span>
                          </div>
                          <span className="text-xl font-bold text-primary">${venue.price}/hr</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* Host Listings */}
            {userRole === "host" && (
              <TabsContent value="listings" className="space-y-6 animate-fade-in">
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold italic mb-4">Host Dashboard</h3>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
                          <p className="text-2xl font-bold">45</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                          <p className="text-2xl font-bold text-primary">$2,250</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
                          <p className="text-2xl font-bold">4.8 ⭐</p>
                        </div>
                      </div>
                    </div>
                    <BarChart className="w-16 h-16 text-primary hidden md:block" />
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button variant="hero" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Venue
                  </Button>
                </div>

                {mockHostListings.map(listing => (
                  <Card key={listing.id} className="p-6 card-hover">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={listing.image}
                        alt={listing.name}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{listing.name}</h3>
                            <p className="text-muted-foreground">{listing.sport}</p>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <Star className="w-4 h-4" />
                              <span className="text-sm">Rating</span>
                            </div>
                            <p className="font-bold">{listing.rating}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <Users className="w-4 h-4" />
                              <span className="text-sm">Bookings</span>
                            </div>
                            <p className="font-bold">{listing.bookings}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <CreditCard className="w-4 h-4" />
                              <span className="text-sm">Revenue</span>
                            </div>
                            <p className="font-bold text-primary">${listing.revenue}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
