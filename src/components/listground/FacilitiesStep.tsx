import { VenueFormData } from "@/pages/ListGround";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  formData: VenueFormData;
  updateFormData: (updates: Partial<VenueFormData>) => void;
}

const EQUIPMENT_OPTIONS = [
  "Balls",
  "Nets",
  "Cones",
  "Scoreboard",
  "Goal Posts",
  "Bibs / Jerseys",
  "First Aid Kit",
  "Water Cooler",
];

const EXTRA_SERVICES = [
  "Coaching Available",
  "Referee Service",
  "Event Hosting",
  "Tournament Organization",
  "Equipment Rental",
  "Refreshments / Cafe",
  "Sports Massage",
  "Physiotherapy",
];

const SAFETY_MEASURES = [
  "CCTV Surveillance",
  "First Aid Kit",
  "Emergency Contact",
  "Fire Extinguisher",
  "Security Guard",
  "Emergency Exit Signs",
  "Ambulance Access",
  "AED Available",
];

const AMENITIES = [
  "Parking",
  "Lockers",
  "Showers",
  "Changing Rooms",
  "Seating Area",
  "Spectator Stand",
  "Lounge Area",
  "Drinking Water",
  "Restrooms",
  "Wi-Fi",
  "Air Conditioning",
  "Canteen",
];

const FacilitiesStep = ({ formData, updateFormData }: Props) => {
  const toggleOption = (
    field: keyof VenueFormData,
    option: string
  ) => {
    const current = (formData[field] as string[]) || [];
    if (current.includes(option)) {
      updateFormData({
        [field]: current.filter((item) => item !== option),
      });
    } else {
      updateFormData({
        [field]: [...current, option],
      });
    }
  };

  const renderSection = (
    title: string,
    description: string,
    field: keyof VenueFormData,
    options: string[]
  ) => {
    const selected = (formData[field] as string[]) || [];
    
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-lg font-bold">{title}</Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <Badge
                key={option}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer px-3 py-2 text-sm"
                onClick={() => toggleOption(field, option)}
              >
                {option}
                {isSelected && <X className="w-3 h-3 ml-1" />}
              </Badge>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold italic mb-4">Facilities & Amenities</h2>
        <p className="text-muted-foreground">
          Highlight what makes your venue stand out. Select all that apply.
        </p>
      </div>

      {renderSection(
        "Equipment Provided",
        "Sports equipment available for use",
        "equipment_provided",
        EQUIPMENT_OPTIONS
      )}

      {renderSection(
        "Extra Services",
        "Additional services you offer",
        "extra_services",
        EXTRA_SERVICES
      )}

      {renderSection(
        "Safety Measures",
        "Security and safety features",
        "safety_measures",
        SAFETY_MEASURES
      )}

      {renderSection(
        "Amenities",
        "General facilities and conveniences",
        "amenities",
        AMENITIES
      )}

      {/* Summary */}
      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-sm font-medium mb-2">✨ Selected Features Summary:</p>
        <p className="text-sm text-muted-foreground">
          {[
            ...(formData.equipment_provided || []),
            ...(formData.extra_services || []),
            ...(formData.safety_measures || []),
            ...(formData.amenities || []),
          ].length || 0}{" "}
          features selected
        </p>
      </div>
    </div>
  );
};

export default FacilitiesStep;
