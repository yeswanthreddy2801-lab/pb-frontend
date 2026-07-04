import { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Fix for default Leaflet marker icon issues in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Define your service area polygon here (Example: Visakhapatnam)
const SERVICE_AREA: [number, number][] = [
  [17.85, 83.10], // NW
  [17.85, 83.40], // NE
  [17.60, 83.40], // SE
  [17.60, 83.10], // SW
];

function isPointInPolygon(latlng: L.LatLng, polygon: [number, number][]) {
  const x = latlng.lat, y = latlng.lng;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];

    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

interface MapPickerProps {
  address: string;
  onChangeAddress: (address: string) => void;
}

function LocationMarker({ position, setPosition, setAddress, isGeocoding, setIsGeocoding }: any) {
  const markerRef = useRef<L.Marker>(null);
  const initialized = useRef(false);

  const map = useMapEvents({
    click(e) {
      if (!isPointInPolygon(e.latlng, SERVICE_AREA)) {
        toast.error("Sorry, we do not deliver to this area yet.");
        return;
      }
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          if (!isPointInPolygon(newPos, SERVICE_AREA)) {
            toast.error("Sorry, we do not deliver to this area yet.");
            // Revert back to the previous valid position
            marker.setLatLng(position);
            return;
          }
          setPosition(newPos);
          map.flyTo(newPos, map.getZoom());
        }
      },
    }),
    [position, setPosition, map],
  );

  const fetchAddress = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress("Location selected (Address not found)");
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      setAddress("Error finding address");
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    if (position) {
      const timeoutId = setTimeout(() => {
        fetchAddress(position.lat, position.lng);
      }, 500); // debounce geocoding request

      return () => clearTimeout(timeoutId);
    }
  }, [position]);

  // Try to get user's location once on mount
  useEffect(() => {
    if (!initialized.current && navigator.geolocation) {
      initialized.current = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
          setPosition(latlng);
          map.flyTo(latlng, 13);
          if (!isPointInPolygon(latlng, SERVICE_AREA)) {
            toast.error("Your current location is outside our delivery area. Please select a location inside the highlighted area.");
          }
        },
        () => {
          console.warn("Could not get location");
        }
      );
    }
  }, [map, setPosition]);

  return position === null ? null : (
    <Marker 
      position={position}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  );
}

export function MapPicker({ address, onChangeAddress }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-[300px] w-full overflow-hidden rounded-xl border border-bordersoft z-0">
        <MapContainer
          center={[17.72, 83.25]} // Center of the service area (Visakhapatnam)
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polygon 
            positions={SERVICE_AREA} 
            color="#22c55e" 
            fillColor="#22c55e" 
            fillOpacity={0.15} 
            weight={2} 
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            setAddress={onChangeAddress}
            isGeocoding={isGeocoding}
            setIsGeocoding={setIsGeocoding}
          />
        </MapContainer>
        {isGeocoding && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-textsecond">Selected Address</label>
        <textarea
          rows={3}
          value={address}
          onChange={(e) => onChangeAddress(e.target.value)}
          className="w-full rounded-md border border-bordersoft p-2 text-sm bg-white"
          placeholder="Click inside the highlighted area on the map to select a location..."
        />
      </div>
    </div>
  );
}
