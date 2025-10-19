import { VenueFormData } from "@/pages/ListGround";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  MapPin,
  Clock,
  Users,
  DollarSign,
  Image,
  FileText,
  CheckCircle2,
} from "lucide-react";

interface Props {
  formData: VenueFormData;
  updateFormData: (updates: Partial<VenueFormData>) => void;
}

const ReviewStep = ({ formData }: Props) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const sections = [
    {
      icon: FileText,
      title: "Basic Info",
      items: [
        { label: "Ground Name", value: formData.name || "Not set" },
        { label: "Sport", value: `${formData.sport_emoji} ${formData.sport}` || "Not set" },
        { label: "Venue Type", value: formData.venue_type || "Not set" },
        { label: "Surface", value: formData.surface_type || "Not set" },
        { label: "Capacity", value: formData.capacity ? `${formData.capacity} players` : "Not set" },
      ],
    },
    {
      icon: MapPin,
      title: "Location",
      items: [
        { label: "Address", value: formData.address || "Not set" },
        { label: "City", value: formData.city || "Not set" },
        { label: "Postal Code", value: formData.postal_code || "Not set" },
      ],
    },
    {
      icon: Users,
      title: "Facilities",
      items: [
        {
          label: "Equipment",
          value: formData.equipment_provided?.length
            ? `${formData.equipment_provided.length} items`
            : "None",
        },
        {
          label: "Services",
          value: formData.extra_services?.length
            ? `${formData.extra_services.length} services`
            : "None",
        },
        {
          label: "Amenities",
          value: formData.amenities?.length
            ? `${formData.amenities.length} amenities`
            : "None",
        },
      ],
    },
    {
      icon: DollarSign,
      title: "Pricing",
      items: [
        {
          label: "Hourly Rate",
          value: formData.hourly_rate ? `£${formData.hourly_rate}/hr` : "Not set",
        },
        {
          label: "Weekend Rate",
          value: formData.weekend_rate
            ? `£${formData.weekend_rate}/hr`
            : "Same as weekday",
        },
        {
          label: "Cancellation",
          value: formData.cancellation_policy || "flexible",
        },
        {
          label: "Operating Hours",
          value: `${formData.operating_hours_start} - ${formData.operating_hours_end}`,
        },
      ],
    },
    {
      icon: Image,
      title: "Media",
      items: [
        {
          label: "Cover Photo",
          value: formData.cover_photo ? "✓ Uploaded" : "Not uploaded",
        },
        {
          label: "Gallery Photos",
          value: formData.images?.length
            ? `${formData.images.length} photo(s)`
            : "None",
        },
        {
          label: "Video",
          value: formData.video_url ? "✓ Added" : "Not added",
        },
      ],
    },
    {
      icon: Clock,
      title: "Policies",
      items: [
        {
          label: "Age Restriction",
          value: formData.age_restriction?.replace("_", " ") || "all ages",
        },
        {
          label: "Weather Policy",
          value: formData.weather_policy || "Not set",
        },
        {
          label: "House Rules",
          value: formData.house_rules ? "✓ Set" : "Not set",
        },
      ],
    },
  ];

  const requiredFieldsFilled =
    formData.name &&
    formData.sport &&
    formData.hourly_rate &&
    formData.address &&
    formData.city;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold italic mb-4">Review & Publish</h2>
        <p className="text-muted-foreground">
          Review your listing details before publishing.
        </p>
      </div>

      {/* Completeness Indicator */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">Listing Completeness</p>
            <p className="text-sm text-muted-foreground">
              {requiredFieldsFilled
                ? "All required fields completed ✓"
                : "Some required fields missing"}
            </p>
          </div>
          {requiredFieldsFilled ? (
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          ) : (
            <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          )}
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="font-bold">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Features Summary */}
      {(formData.lighting_available ||
        formData.parking_available ||
        formData.changing_rooms) && (
        <Card className="p-4">
          <Label className="font-bold mb-3 block">Key Features</Label>
          <div className="flex flex-wrap gap-2">
            {formData.lighting_available && (
              <Badge variant="secondary">💡 Lighting</Badge>
            )}
            {formData.parking_available && (
              <Badge variant="secondary">🚗 Parking</Badge>
            )}
            {formData.changing_rooms && (
              <Badge variant="secondary">🚿 Changing Rooms</Badge>
            )}
          </div>
        </Card>
      )}

      {/* Terms & Conditions */}
      <Card className="p-4 border-2 border-primary/20">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-1"
          />
          <div>
            <Label
              htmlFor="terms"
              className="text-sm font-medium cursor-pointer"
            >
              I agree to the platform terms and conditions *
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              By publishing, you agree to our hosting terms, payment terms, and
              cancellation policies. You will receive bookings via email and the
              platform dashboard.
            </p>
          </div>
        </div>
      </Card>

      {/* Warning if not agreed */}
      {!agreedToTerms && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300">
          ⚠️ You must agree to the terms and conditions before publishing
        </div>
      )}

      {/* Warning if missing required fields */}
      {!requiredFieldsFilled && (
        <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          ❌ Please complete all required fields:
          <ul className="list-disc list-inside mt-2">
            {!formData.name && <li>Ground Name</li>}
            {!formData.sport && <li>Sport Type</li>}
            {!formData.hourly_rate && <li>Hourly Rate</li>}
            {!formData.address && <li>Address</li>}
            {!formData.city && <li>City</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
