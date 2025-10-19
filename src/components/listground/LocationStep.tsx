import { VenueFormData } from "@/pages/ListGround";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

interface Props {
  formData: VenueFormData;
  updateFormData: (updates: Partial<VenueFormData>) => void;
}

const LocationStep = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold italic mb-4">Location Details</h2>
        <p className="text-muted-foreground">
          Help visitors find your venue easily.
        </p>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address" className="required">
          Full Address *
        </Label>
        <Input
          id="address"
          placeholder="Street address, building name, etc."
          value={formData.address}
          onChange={(e) => {
            updateFormData({ 
              address: e.target.value,
              location: e.target.value // Also update location field
            });
          }}
          className="text-base"
        />
      </div>

      {/* City & Postal Code */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="required">
            City / Region *
          </Label>
          <Input
            id="city"
            placeholder="e.g., London"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            id="postal_code"
            placeholder="e.g., SW1A 1AA"
            value={formData.postal_code}
            onChange={(e) => updateFormData({ postal_code: e.target.value })}
          />
        </div>
      </div>

      {/* Coordinates (Optional) */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude (Optional)</Label>
          <Input
            id="latitude"
            type="number"
            step="0.000001"
            placeholder="e.g., 51.5074"
            value={formData.latitude || ""}
            onChange={(e) =>
              updateFormData({
                latitude: parseFloat(e.target.value) || null,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude (Optional)</Label>
          <Input
            id="longitude"
            type="number"
            step="0.000001"
            placeholder="e.g., -0.1278"
            value={formData.longitude || ""}
            onChange={(e) =>
              updateFormData({
                longitude: parseFloat(e.target.value) || null,
              })
            }
          />
        </div>
      </div>

      {/* Map Preview Placeholder */}
      <div className="p-8 border-2 border-dashed rounded-lg bg-muted/20 text-center">
        <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">
          Map preview will appear here
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {formData.latitude && formData.longitude
            ? `📍 ${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`
            : "Add coordinates to preview location"}
        </p>
      </div>

      {/* Directions Notes */}
      <div className="space-y-2">
        <Label htmlFor="directions">Directions / Landmarks (Optional)</Label>
        <Textarea
          id="directions"
          placeholder="e.g., Near City Park, opposite the shopping mall"
          value={formData.directions_notes}
          onChange={(e) => updateFormData({ directions_notes: e.target.value })}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Help visitors find your venue with local landmarks
        </p>
      </div>
    </div>
  );
};

export default LocationStep;
