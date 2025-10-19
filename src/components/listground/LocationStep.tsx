import { VenueFormData } from "@/pages/ListGround";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Navigation } from "lucide-react";
import { APIProvider, Map, AdvancedMarker, MapMouseEvent } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

interface Props {
  formData: VenueFormData;
  updateFormData: (updates: Partial<VenueFormData>) => void;
}

const LocationStep = ({ formData, updateFormData }: Props) => {
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 51.5074, lng: -0.1278 });
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    formData.latitude && formData.longitude
      ? { lat: formData.latitude, lng: formData.longitude }
      : null
  );

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!autocompleteInputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInputRef.current,
      { types: ["address"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // Extract address components
      let streetAddress = "";
      let city = "";
      let postalCode = "";

      place.address_components?.forEach((component) => {
        const types = component.types;
        if (types.includes("street_number") || types.includes("route")) {
          streetAddress += component.long_name + " ";
        }
        if (types.includes("locality") || types.includes("postal_town")) {
          city = component.long_name;
        }
        if (types.includes("postal_code")) {
          postalCode = component.long_name;
        }
      });

      updateFormData({
        address: place.formatted_address || streetAddress.trim(),
        city: city,
        postal_code: postalCode,
        location: place.formatted_address || streetAddress.trim(),
        latitude: lat,
        longitude: lng,
      });

      setMapCenter({ lat, lng });
      setMarkerPosition({ lat, lng });
    });
  }, []);

  const handleMapClick = (e: MapMouseEvent) => {
    if (!e.detail.latLng) return;
    
    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;
    
    setMarkerPosition({ lat, lng });
    updateFormData({
      latitude: lat,
      longitude: lng,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold italic mb-4">Location Details</h2>
        <p className="text-muted-foreground">
          Help visitors find your venue easily.
        </p>
      </div>

      {/* Address with Google Autocomplete */}
      <div className="space-y-2">
        <Label htmlFor="address" className="required">
          Full Address * <span className="text-xs text-muted-foreground">(Start typing for suggestions)</span>
        </Label>
        <Input
          id="address"
          ref={autocompleteInputRef}
          placeholder="Start typing your address..."
          defaultValue={formData.address}
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

      {/* Interactive Map */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Navigation className="w-4 h-4" />
          Pin Your Location
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Click on the map or drag the marker to set exact location
        </p>
        <div className="h-96 rounded-lg overflow-hidden border-2 border-border">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
            <Map
              mapId="venue-location-map"
              defaultCenter={mapCenter}
              center={mapCenter}
              defaultZoom={15}
              gestureHandling="greedy"
              disableDefaultUI={false}
              onClick={handleMapClick}
              style={{ width: "100%", height: "100%" }}
            >
              {markerPosition && (
                <AdvancedMarker position={markerPosition} />
              )}
            </Map>
          </APIProvider>
        </div>
        {formData.latitude && formData.longitude && (
          <p className="text-xs text-muted-foreground text-center">
            📍 {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
          </p>
        )}
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
