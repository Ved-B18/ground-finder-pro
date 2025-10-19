import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Card } from "./ui/card";

interface Venue {
  id: number;
  name: string;
  location: string;
  lat: number;
  lng: number;
  sport: string;
  sportEmoji: string;
}

interface GoogleMapProps {
  venues?: Venue[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

const GoogleMap = ({ 
  venues = [], 
  center = { lat: 40.7128, lng: -74.0060 }, // Default to New York
  zoom = 12,
  height = "384px"
}: GoogleMapProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location access denied or unavailable:", error);
        }
      );
    }
  }, []);

  if (!apiKey) {
    return (
      <Card className="h-96 bg-muted/30 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-muted-foreground">Google Maps API key not configured</p>
        </div>
      </Card>
    );
  }

  const mapCenter = userLocation || center;

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height, width: "100%", borderRadius: "var(--radius)" }} className="overflow-hidden">
        <Map
          mapId="sportup-map"
          center={mapCenter}
          zoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          styles={[
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ]}
        >
          {/* User location marker */}
          {userLocation && (
            <AdvancedMarker position={userLocation}>
              <Pin
                background="#3b82f6"
                borderColor="#1e40af"
                glyphColor="#fff"
                scale={1.2}
              />
            </AdvancedMarker>
          )}

          {/* Venue markers */}
          {venues.map((venue) => (
            <AdvancedMarker
              key={venue.id}
              position={{ lat: venue.lat, lng: venue.lng }}
              title={venue.name}
            >
              <div className="bg-background border-2 border-primary rounded-full p-2 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <span className="text-2xl">{venue.sportEmoji}</span>
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMap;
