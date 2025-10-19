import { VenueFormData } from "@/pages/ListGround";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  formData: VenueFormData;
  updateFormData: (updates: Partial<VenueFormData>) => void;
}

const SPORTS = [
  { name: "Football", emoji: "⚽" },
  { name: "Cricket", emoji: "🏏" },
  { name: "Tennis", emoji: "🎾" },
  { name: "Basketball", emoji: "🏀" },
  { name: "Badminton", emoji: "🏸" },
  { name: "Volleyball", emoji: "🏐" },
  { name: "Hockey", emoji: "🏑" },
  { name: "Baseball", emoji: "⚾" },
];

const ACCESSIBILITY_OPTIONS = [
  "Wheelchair Access",
  "Ramps",
  "Accessible Parking",
  "Accessible Washrooms",
  "Lockers",
  "Elevators",
];

const BasicInfoStep = ({ formData, updateFormData }: Props) => {
  const toggleAccessibility = (feature: string) => {
    const current = formData.accessibility_features || [];
    if (current.includes(feature)) {
      updateFormData({
        accessibility_features: current.filter((f) => f !== feature),
      });
    } else {
      updateFormData({
        accessibility_features: [...current, feature],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold italic mb-4">Basic Information</h2>
        <p className="text-muted-foreground">
          Tell us about your sports ground and what makes it special.
        </p>
      </div>

      {/* Ground Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="required">
          Ground Name *
        </Label>
        <Input
          id="name"
          placeholder="e.g., Sunrise Football Turf"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          className="text-base"
        />
      </div>

      {/* Sport Type */}
      <div className="space-y-2">
        <Label htmlFor="sport" className="required">
          Sport Type *
        </Label>
        <Select
          value={formData.sport}
          onValueChange={(value) => {
            const sport = SPORTS.find((s) => s.name === value);
            updateFormData({
              sport: value,
              sport_emoji: sport?.emoji || "",
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a sport" />
          </SelectTrigger>
          <SelectContent>
            {SPORTS.map((sport) => (
              <SelectItem key={sport.name} value={sport.name}>
                {sport.emoji} {sport.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Short Description
        </Label>
        <Textarea
          id="description"
          placeholder="Brief description of your venue (max 250 characters)"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          maxLength={250}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {formData.description.length}/250 characters
        </p>
      </div>

      {/* Venue Type & Surface Type */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="venue_type">Venue Type</Label>
          <Select
            value={formData.venue_type}
            onValueChange={(value) => updateFormData({ venue_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outdoor">Outdoor</SelectItem>
              <SelectItem value="indoor">Indoor</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="surface_type">Surface Type</Label>
          <Select
            value={formData.surface_type}
            onValueChange={(value) => updateFormData({ surface_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select surface" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grass">Grass</SelectItem>
              <SelectItem value="turf">Turf / Artificial</SelectItem>
              <SelectItem value="clay">Clay</SelectItem>
              <SelectItem value="synthetic">Synthetic</SelectItem>
              <SelectItem value="wooden">Wooden</SelectItem>
              <SelectItem value="concrete">Concrete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Capacity */}
      <div className="space-y-2">
        <Label htmlFor="capacity">Venue Capacity</Label>
        <Input
          id="capacity"
          type="number"
          placeholder="e.g., 10 players per side"
          value={formData.capacity || ""}
          onChange={(e) =>
            updateFormData({ capacity: parseInt(e.target.value) || null })
          }
        />
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="font-medium">Lighting Available</Label>
            <p className="text-sm text-muted-foreground">
              Floodlights for evening play
            </p>
          </div>
          <Switch
            checked={formData.lighting_available}
            onCheckedChange={(checked) =>
              updateFormData({ lighting_available: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="font-medium">Parking Available</Label>
            <p className="text-sm text-muted-foreground">
              On-site parking for visitors
            </p>
          </div>
          <Switch
            checked={formData.parking_available}
            onCheckedChange={(checked) =>
              updateFormData({ parking_available: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="font-medium">Changing Rooms / Washroom</Label>
            <p className="text-sm text-muted-foreground">
              Facilities for players
            </p>
          </div>
          <Switch
            checked={formData.changing_rooms}
            onCheckedChange={(checked) =>
              updateFormData({ changing_rooms: checked })
            }
          />
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="space-y-3">
        <Label>Accessibility Features</Label>
        <div className="flex flex-wrap gap-2">
          {ACCESSIBILITY_OPTIONS.map((feature) => {
            const isSelected = formData.accessibility_features?.includes(feature);
            return (
              <Badge
                key={feature}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer px-3 py-2"
                onClick={() => toggleAccessibility(feature)}
              >
                {feature}
                {isSelected && <X className="w-3 h-3 ml-1" />}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
