import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, CheckCircle, Loader2 } from "lucide-react";

import BasicInfoStep from "@/components/listground/BasicInfoStep";
import LocationStep from "@/components/listground/LocationStep";
import FacilitiesStep from "@/components/listground/FacilitiesStep";
import PricingStep from "@/components/listground/PricingStep";
import MediaStep from "@/components/listground/MediaStep";
import PoliciesStep from "@/components/listground/PoliciesStep";
import ReviewStep from "@/components/listground/ReviewStep";

const STEPS = [
  { id: 1, title: "Basic Info", component: BasicInfoStep },
  { id: 2, title: "Location", component: LocationStep },
  { id: 3, title: "Facilities", component: FacilitiesStep },
  { id: 4, title: "Pricing", component: PricingStep },
  { id: 5, title: "Photos & Media", component: MediaStep },
  { id: 6, title: "Policies", component: PoliciesStep },
  { id: 7, title: "Review", component: ReviewStep },
];

export interface VenueFormData {
  // Basic Info
  name: string;
  sport: string;
  sport_emoji: string;
  description: string;
  venue_type: string;
  surface_type: string;
  capacity: number | null;
  lighting_available: boolean;
  parking_available: boolean;
  changing_rooms: boolean;
  accessibility_features: string[];
  
  // Location
  address: string;
  city: string;
  postal_code: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  directions_notes: string;
  
  // Facilities
  equipment_provided: string[];
  extra_services: string[];
  safety_measures: string[];
  amenities: string[];
  
  // Pricing
  hourly_rate: number | null;
  weekend_rate: number | null;
  discount_percentage: number;
  deposit_required: boolean;
  deposit_amount: number | null;
  cancellation_policy: string;
  operating_hours_start: string;
  operating_hours_end: string;
  unavailable_dates: string[];
  
  // Media
  images: string[];
  cover_photo: string;
  video_url: string;
  
  // Policies
  house_rules: string;
  age_restriction: string;
  weather_policy: string;
  additional_notes: string;
}

const defaultFormData: VenueFormData = {
  name: "",
  sport: "",
  sport_emoji: "",
  description: "",
  venue_type: "outdoor",
  surface_type: "",
  capacity: null,
  lighting_available: false,
  parking_available: false,
  changing_rooms: false,
  accessibility_features: [],
  address: "",
  city: "",
  postal_code: "",
  location: "",
  latitude: null,
  longitude: null,
  directions_notes: "",
  equipment_provided: [],
  extra_services: [],
  safety_measures: [],
  amenities: [],
  hourly_rate: null,
  weekend_rate: null,
  discount_percentage: 0,
  deposit_required: false,
  deposit_amount: null,
  cancellation_policy: "flexible",
  operating_hours_start: "06:00",
  operating_hours_end: "23:00",
  unavailable_dates: [],
  images: [],
  cover_photo: "",
  video_url: "",
  house_rules: "",
  age_restriction: "all_ages",
  weather_policy: "",
  additional_notes: "",
};

const ListGround = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VenueFormData>(defaultFormData);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Redirect if not a host
  useEffect(() => {
    if (!authLoading && (!user || userRole !== "host")) {
      toast({
        title: "Access Denied",
        description: "Only venue hosts can list grounds.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [user, userRole, authLoading, navigate, toast]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!user) return;
    
    const autoSaveInterval = setInterval(() => {
      handleSaveDraft(true);
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [formData, draftId, user]);

  const handleSaveDraft = async (silent = false) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const venueData = {
        ...formData,
        host_id: user.id,
        status: 'draft',
        price_per_hour: formData.hourly_rate || 0,
      };

      if (draftId) {
        // Update existing draft
        const { error } = await supabase
          .from("venues")
          .update(venueData)
          .eq("id", draftId);

        if (error) throw error;
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from("venues")
          .insert(venueData)
          .select()
          .single();

        if (error) throw error;
        setDraftId(data.id);
      }

      if (!silent) {
        toast({
          title: "Draft Saved",
          description: "Your listing has been saved as a draft.",
        });
      }
    } catch (error: any) {
      console.error("Error saving draft:", error);
      if (!silent) {
        toast({
          title: "Save Failed",
          description: error.message || "Failed to save draft.",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user) return;
    
    setPublishing(true);
    try {
      // Validate required fields
      if (!formData.name || !formData.sport || !formData.hourly_rate) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setPublishing(false);
        return;
      }

      const venueData = {
        ...formData,
        host_id: user.id,
        status: 'published',
        price_per_hour: formData.hourly_rate,
      };

      if (draftId) {
        const { error } = await supabase
          .from("venues")
          .update(venueData)
          .eq("id", draftId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("venues")
          .insert(venueData)
          .select()
          .single();

        if (error) throw error;
      }

      toast({
        title: "Listing Published! 🎉",
        description: "Your ground is now live and bookable.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error publishing:", error);
      toast({
        title: "Publish Failed",
        description: error.message || "Failed to publish listing.",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  const updateFormData = (updates: Partial<VenueFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progress = (currentStep / STEPS.length) * 100;
  const CurrentStepComponent = STEPS[currentStep - 1].component;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold italic mb-3">
              List Your Ground
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Earn by sharing your sports space — add your ground, set your price, and start taking bookings.
            </p>
          </div>

          {/* Progress Bar */}
          <Card className="p-6 mb-6 animate-scale-in">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleSaveDraft()}
                  disabled={saving}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Draft
                    </>
                  )}
                </Button>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {/* Step Indicators */}
            <div className="hidden md:flex justify-between mt-4">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex-1 text-center text-xs ${
                    step.id === currentStep
                      ? "text-primary font-bold"
                      : step.id < currentStep
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep && <CheckCircle className="w-4 h-4 inline mr-1" />}
                  {step.title}
                </div>
              ))}
            </div>
          </Card>

          {/* Form Step */}
          <Card className="p-6 md:p-8 mb-6 animate-fade-in">
            <CurrentStepComponent 
              formData={formData} 
              updateFormData={updateFormData}
            />
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                variant="hero"
                onClick={nextStep}
                className="gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="hero"
                onClick={handlePublish}
                disabled={publishing}
                className="gap-2"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Publish Listing
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListGround;
