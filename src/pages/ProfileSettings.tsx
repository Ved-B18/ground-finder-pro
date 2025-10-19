import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { profileUpdateSchema } from "@/lib/validations/profile";

const sports = ["Football", "Cricket", "Tennis", "Basketball", "Badminton", "Volleyball"];

const ProfileSettings = () => {
  const { user, profile, userRole, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar_url);
      setSelectedSports(profile.preferred_sports || []);
    }
  }, [profile]);

  const toggleSport = (sport: string) => {
    setSelectedSports(prev =>
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Validate profile data
      const validationResult = profileUpdateSchema.safeParse({
        full_name: fullName,
        avatar_url: avatarUrl,
        preferred_sports: selectedSports,
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const { error } = await updateProfile(validationResult.data);

      if (error) throw error;

      toast({
        title: "Profile updated! ✨",
        description: "Your changes have been saved.",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: "Unable to update profile. Please try again.",
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

  if (!user || !profile) {
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold italic">Profile Settings</h1>
                <p className="text-muted-foreground mt-1">Update your personal information</p>
              </div>
              <Badge variant="secondary">
                {userRole === "host" ? "Venue Host" : "Player"}
              </Badge>
            </div>

            <div className="space-y-6">
              {/* Avatar Upload */}
              <div>
                <Label className="text-base font-bold mb-3 block">Profile Picture</Label>
                <ImageUpload
                  currentImage={avatarUrl}
                  onUploadComplete={(url) => setAvatarUrl(url)}
                  bucket="avatars"
                  shape="circle"
                  label="Upload Avatar"
                  maxSizeMB={5}
                />
              </div>

              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="text-base font-bold mb-3 block">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <Label className="text-base font-bold mb-3 block">Email</Label>
                <Input value={user.email || ""} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Credits (read-only) */}
              <div>
                <Label className="text-base font-bold mb-3 block">Credits Balance</Label>
                <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                  <p className="text-3xl font-bold text-primary">
                    ${profile.credits}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Earned from bookings (5% of each booking)
                  </p>
                </div>
              </div>

              {/* Preferred Sports */}
              {userRole === "player" && (
                <div>
                  <Label className="text-base font-bold mb-3 block">
                    Preferred Sports
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
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
              )}

              {/* Save Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="hero"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
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

export default ProfileSettings;
