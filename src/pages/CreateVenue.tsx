import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";

const sports = ["Football", "Cricket", "Tennis", "Basketball", "Badminton", "Volleyball"];
const sportEmojis: Record<string, string> = {
  Football: "⚽",
  Cricket: "🏏",
  Tennis: "🎾",
  Basketball: "🏀",
  Badminton: "🏸",
  Volleyball: "🏐",
};

const commonAmenities = [
  "Changing Rooms",
  "Free Parking",
  "Floodlights",
  "Cafeteria",
  "Security",
  "AC",
  "Outdoor",
  "Beach Access",
  "Cafe",
  "Lighting",
];

const CreateVenue = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [venueName, setVenueName] = useState("");
  const [description, setDescription] = useState("");
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || userRole !== "host")) {
      toast({
        title: "Access denied",
        description: "Only venue hosts can create listings.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [user, userRole, loading, navigate, toast]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageUpload = (url: string) => {
    setImages(prev => [...prev, url]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!venueName.trim() || !sport || !location.trim() || !pricePerHour) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(pricePerHour);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Add images",
        description: "Please upload at least one image of your venue.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await supabase
        .from("venues")
        .insert({
          host_id: user?.id,
          name: venueName,
          description: description || null,
          sport,
          sport_emoji: sportEmojis[sport],
          location,
          price_per_hour: price,
          images,
          amenities: selectedAmenities,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Venue created! 🎉",
        description: "Your venue has been added to SportUp.",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Error creating venue:", error);
      toast({
        title: "Creation failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || userRole !== "host") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
            <ArrowLeft className="mr-2" />
            Back to Dashboard
          </Button>

          <Card className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold italic">Create Venue Listing</h1>
              <p className="text-muted-foreground mt-1">Add a new sports venue to SportUp</p>
            </div>

            <div className="space-y-6">
              {/* Venue Images */}
              <div>
                <Label className="text-base font-bold mb-3 block">Venue Images *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Venue ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <ImageUpload
                  currentImage={null}
                  onUploadComplete={handleImageUpload}
                  bucket="venue-images"
                  folder={user?.id}
                  label="Add Image"
                  maxSizeMB={10}
                />
              </div>

              {/* Venue Name */}
              <div>
                <Label htmlFor="venueName" className="text-base font-bold mb-3 block">
                  Venue Name *
                </Label>
                <Input
                  id="venueName"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g., Green Valley Sports Complex"
                />
              </div>

              {/* Sport Type */}
              <div>
                <Label className="text-base font-bold mb-3 block">Sport Type *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {sports.map(s => (
                    <Button
                      key={s}
                      type="button"
                      variant={sport === s ? "default" : "outline"}
                      onClick={() => setSport(s)}
                      className="justify-start"
                    >
                      {sportEmojis[s]} {s}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-base font-bold mb-3 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your venue, facilities, and what makes it special..."
                  rows={4}
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-base font-bold mb-3 block">
                  Location *
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., 123 Downtown Street, City Center"
                />
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price" className="text-base font-bold mb-3 block">
                  Price per Hour ($) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  placeholder="50"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Amenities */}
              <div>
                <Label className="text-base font-bold mb-3 block">Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonAmenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <label
                        htmlFor={amenity}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="hero"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Venue
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateVenue;
