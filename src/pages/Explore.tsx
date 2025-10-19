import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Star, Filter, X, Navigation } from "lucide-react";

// Mock venue data with coordinates
const mockVenues = [
  {
    id: 1,
    name: "Green Valley Sports Complex",
    sport: "Football",
    sportEmoji: "⚽",
    price: 50,
    rating: 4.8,
    reviews: 124,
    location: "Downtown, 2.3 km away",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
    amenities: ["Changing Rooms", "Parking", "Lighting"],
    lat: 40.7589,
    lng: -73.9851,
  },
  {
    id: 2,
    name: "Ace Tennis Courts",
    sport: "Tennis",
    sportEmoji: "🎾",
    price: 40,
    rating: 4.9,
    reviews: 89,
    location: "Northside, 1.8 km away",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
    amenities: ["Changing Rooms", "Cafe", "Lighting"],
    lat: 40.7829,
    lng: -73.9654,
  },
  {
    id: 3,
    name: "Champions Cricket Ground",
    sport: "Cricket",
    sportEmoji: "🏏",
    price: 75,
    rating: 4.7,
    reviews: 156,
    location: "East End, 3.5 km away",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
    amenities: ["Changing Rooms", "Parking", "Cafe"],
    lat: 40.7282,
    lng: -73.9442,
  },
  {
    id: 4,
    name: "Slam Dunk Basketball Arena",
    sport: "Basketball",
    sportEmoji: "🏀",
    price: 45,
    rating: 4.6,
    reviews: 92,
    location: "Westside, 2.1 km away",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
    amenities: ["Changing Rooms", "Parking", "Lighting"],
    lat: 40.7489,
    lng: -74.0123,
  },
  {
    id: 5,
    name: "Shuttle Masters Badminton Hall",
    sport: "Badminton",
    sportEmoji: "🏸",
    price: 30,
    rating: 4.5,
    reviews: 67,
    location: "South Plaza, 1.2 km away",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
    amenities: ["Changing Rooms", "AC", "Parking"],
    lat: 40.7029,
    lng: -74.0134,
  },
  {
    id: 6,
    name: "Spike Zone Volleyball Court",
    sport: "Volleyball",
    sportEmoji: "🏐",
    price: 35,
    rating: 4.4,
    reviews: 54,
    location: "Beach Road, 4.2 km away",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
    amenities: ["Outdoor", "Parking", "Beach Access"],
    lat: 40.6782,
    lng: -73.9442,
  },
];

const Explore = () => {
  const [filterOpen, setFilterOpen] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const sports = ["Football", "Cricket", "Tennis", "Basketball", "Badminton", "Volleyball"];

  const toggleSport = (sport: string) => {
    setSelectedSports(prev =>
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const filteredVenues = mockVenues.filter(venue => {
    const sportMatch = selectedSports.length === 0 || selectedSports.includes(venue.sport);
    const priceMatch = venue.price >= priceRange[0] && venue.price <= priceRange[1];
    const ratingMatch = venue.rating >= minRating;
    return sportMatch && priceMatch && ratingMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Panel */}
            <aside
              className={`lg:w-80 ${
                filterOpen ? "block" : "hidden lg:block"
              } animate-fade-in`}
            >
              <Card className="p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFilterOpen(false)}
                    className="lg:hidden"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Sport Type */}
                <div className="mb-6">
                  <Label className="text-base font-bold mb-3 block">Sport Type</Label>
                  <div className="space-y-3">
                    {sports.map(sport => (
                      <div key={sport} className="flex items-center gap-2">
                        <Checkbox
                          id={sport}
                          checked={selectedSports.includes(sport)}
                          onCheckedChange={() => toggleSport(sport)}
                        />
                        <label
                          htmlFor={sport}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {sport}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <Label className="text-base font-bold mb-3 block">
                    Price per Hour: ${priceRange[0]} - ${priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <Label className="text-base font-bold mb-3 block">Minimum Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinRating(rating)}
                        className="flex-1"
                      >
                        {rating}★
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedSports([]);
                    setPriceRange([0, 100]);
                    setMinRating(0);
                  }}
                >
                  Clear All Filters
                </Button>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Filter Toggle (Mobile) */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-xl font-bold">
                  {filteredVenues.length} Venues Found
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setFilterOpen(true)}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </div>

              {/* Venue Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {filteredVenues.map((venue, index) => (
                  <Link key={venue.id} to={`/venue/${venue.id}`}>
                    <Card className="overflow-hidden card-hover animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="relative h-48">
                        <img
                          src={venue.image}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                          {venue.sportEmoji} {venue.sport}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold mb-2">{venue.name}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                          <MapPin className="w-4 h-4" />
                          {venue.location}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="font-bold">{venue.rating}</span>
                            <span className="text-muted-foreground text-sm">
                              ({venue.reviews} reviews)
                            </span>
                          </div>
                          <div className="text-xl font-bold text-primary">
                            ${venue.price}/hr
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {venue.amenities.map(amenity => (
                            <span
                              key={amenity}
                              className="text-xs bg-muted px-2 py-1 rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {filteredVenues.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-lg text-muted-foreground">
                    No venues found matching your filters. Try adjusting your search criteria.
                  </p>
                </Card>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
