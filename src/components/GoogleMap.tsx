import { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
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
          defaultCenter={mapCenter}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
        >
          {/* User location marker - blue dot */}
          {userLocation && (
            <Marker
              position={userLocation}
              title="Your Location"
            />
          )}

          {/* Venue markers with sport emojis */}
          {venues.map((venue) => (
            <Marker
              key={venue.id}
              position={{ lat: venue.lat, lng: venue.lng }}
              title={venue.name}
              label={{
                text: venue.sportEmoji,
                fontSize: "24px",
              }}
            />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMap;
