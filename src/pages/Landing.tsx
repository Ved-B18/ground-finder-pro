import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { MapPin, Search, Calendar, Shield, Clock, Star } from "lucide-react";
import heroImage from "@/assets/hero-sports.jpg";

const Landing = () => {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "Find Venues",
      description: "Browse hundreds of sports grounds near you",
    },
    {
      icon: <Calendar className="w-8 h-8 text-secondary" />,
      title: "Easy Booking",
      description: "Book your slot in seconds with instant confirmation",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Secure Payment",
      description: "Safe and secure payment processing",
    },
    {
      icon: <Clock className="w-8 h-8 text-secondary" />,
      title: "24/7 Access",
      description: "Book any time, play any time",
    },
  ];

  const sports = [
    { name: "Football", emoji: "⚽" },
    { name: "Cricket", emoji: "🏏" },
    { name: "Tennis", emoji: "🎾" },
    { name: "Basketball", emoji: "🏀" },
    { name: "Badminton", emoji: "🏸" },
    { name: "Volleyball", emoji: "🏐" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold italic mb-6">
              Game On,{" "}
              <span className="text-gradient">Anytime. Anywhere.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10">
              Discover and book the best sports venues in your city. From football fields to tennis courts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Button variant="hero" size="lg" asChild className="min-w-[200px]">
                <Link to="/explore">
                  <MapPin className="mr-2" />
                  Find a Ground
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="min-w-[200px] border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold">
                <Link to="/list-ground">List Your Ground</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Sports */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold italic text-center mb-12">
            Popular Sports
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sports.map((sport, index) => (
              <Card
                key={sport.name}
                className="p-6 text-center card-hover cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-3">{sport.emoji}</div>
                <h3 className="font-bold text-lg">{sport.name}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold italic text-center mb-16">
            Why Choose <span className="text-gradient">SportUp</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="p-8 text-center card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rebook Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto max-w-3xl text-center">
          <Star className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold italic mb-6">
            Ready to Play Again?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Login to view your previous bookings and rebook your favorite venues with just one click.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/auth">View My Bookings</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="mb-2 font-bold text-foreground">
            <span className="text-gradient">SportUp</span> - Game On, Anytime. Anywhere.
          </p>
          <p className="text-sm">© 2025 SportUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
