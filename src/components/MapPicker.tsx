import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng, Icon, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

// Fix for default marker icons in react-leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
}

function LocationMarker({ 
  position, 
  setPosition 
}: { 
  position: LatLng | null; 
  setPosition: (pos: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={defaultIcon} />
  );
}

export function MapPicker({ 
  onLocationSelect, 
  initialLat = 19.8762, 
  initialLng = 75.3433,
  height = '400px' 
}: MapPickerProps) {
  const [position, setPosition] = useState<LatLng | null>(
    initialLat && initialLng ? new LatLng(initialLat, initialLng) : null
  );
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<any>(null);

  const handlePositionChange = (newPosition: LatLng) => {
    setPosition(newPosition);
    // Reverse geocode to get address
    reverseGeocode(newPosition.lat, newPosition.lng);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      const address = data.display_name || '';
      onLocationSelect(lat, lng, address);
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      onLocationSelect(lat, lng);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = new LatLng(pos.coords.latitude, pos.coords.longitude);
          setPosition(newPos);
          reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          
          // Center map on new position
          if (mapRef.current) {
            mapRef.current.setView(newPos, 15);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation not supported');
      setLoading(false);
    }
  };

  useEffect(() => {
    // If initial coordinates are provided, reverse geocode them
    if (initialLat && initialLng) {
      reverseGeocode(initialLat, initialLng);
    }
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <MapPin className="inline h-4 w-4 mr-1" />
          Click on the map to select pickup location
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={loading}
        >
          <Navigation className="h-4 w-4 mr-2" />
          {loading ? 'Getting Location...' : 'Use My Location'}
        </Button>
      </div>
      
      <div className="rounded-lg overflow-hidden border shadow-sm" style={{ height }}>
        <MapContainer
          center={position || new LatLng(initialLat, initialLng)}
          zoom={position ? 15 : 5}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={handlePositionChange} />
        </MapContainer>
      </div>
      
      {position && (
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          Selected coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}
