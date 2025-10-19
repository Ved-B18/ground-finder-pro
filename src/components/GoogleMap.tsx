import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

interface Venue {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface GoogleMapProps {
  venues: Venue[];
  center: { lat: number; lng: number };
  zoom: number;
  height?: string;
}

const GoogleMap = ({ venues, center, zoom, height = "400px" }: GoogleMapProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div 
        className="w-full rounded-lg border-2 border-border bg-muted/20 flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-muted-foreground">Map API key not configured</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border-2 border-border" style={{ height }}>
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="venues-map"
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: "100%", height: "100%" }}
        >
          {venues.map((venue) => (
            <AdvancedMarker
              key={venue.id}
              position={{ lat: venue.lat, lng: venue.lng }}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

export default GoogleMap;
