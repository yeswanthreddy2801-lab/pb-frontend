import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2, Navigation } from "lucide-react";
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

// Global reference for manual location fetching
let triggerLocateMe: (() => void) | null = null;

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
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [position]);

  const positionRef = useRef(position);
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const locateUser = useCallback((silent = false) => {
    if (navigator.geolocation) {
      if (!silent) setIsGeocoding(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!silent) setIsGeocoding(false);
          const latlng = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
          setPosition(latlng);
          map.flyTo(latlng, 13);
          if (!isPointInPolygon(latlng, SERVICE_AREA) && !silent) {
            toast.error("Your current location is outside our delivery area. Please select a location inside the highlighted area.");
          }
        },
        (err) => {
          if (!silent) setIsGeocoding(false);
          console.warn("Could not get location", err);
          if (!silent) {
            if (err.code === 1) {
              toast.error("Location access denied. Please allow location permissions in your browser.");
            } else if (err.code === 2) {
              toast.error("Your device's location is turned off. Please turn on your GPS/Location.");
            } else {
              toast.error("Could not fetch your location. Please select it manually.");
            }
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else if (!silent) {
      toast.error("Geolocation is not supported by your browser or is blocked.");
    }
  }, [map, setPosition, setIsGeocoding]);

  useEffect(() => {
    triggerLocateMe = () => locateUser(false);
    return () => { triggerLocateMe = null; };
  }, [locateUser]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      locateUser(false); // First attempt with error messages
    }

    // Set up a background polling interval to detect when they turn location on
    const intervalId = setInterval(() => {
      // If we don't have a position yet, keep checking silently
      if (!positionRef.current) {
        locateUser(true); // silent attempt
      } else {
        // If we have a position, stop polling!
        clearInterval(intervalId);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [locateUser]);

  return position === null ? null : (
    <Marker 
      position={position}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  );
}

// Custom control button
function LocateControl() {
  return (
    <div className="leaflet-top leaflet-right z-[1000] mt-[10px] mr-[10px] absolute">
      <div className="leaflet-control leaflet-bar">
        <button
          className="flex h-8 w-8 items-center justify-center bg-white text-brand-green hover:bg-gray-100 outline-none"
          onClick={(e) => {
            e.preventDefault();
            if (triggerLocateMe) triggerLocateMe();
          }}
          title="Locate Me"
        >
          <Navigation className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Map center updater
function MapCenterUpdater({ position }: { position: L.LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14);
    }
  }, [position, map]);
  return null;
}

export function MapPicker({ address, onChangeAddress }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const isTypingRef = useRef(false);

  // Debounced search for Autocomplete
  useEffect(() => {
    const searchArea = async (query: string) => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        // Automatically append Visakhapatnam to restrict search to Vizag
        const searchQuery = query.toLowerCase().includes('visakhapatnam') || query.toLowerCase().includes('vizag') 
          ? query 
          : `${query} Visakhapatnam`;
          
        // Use Photon API (Komoot) which uses Elasticsearch for fuzzy matching/spelling mistakes
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=17.72&lon=83.25&limit=5`);
        const data = await res.json();
        
        // Map Photon's GeoJSON format to our suggestions format
        const mappedSuggestions = data.features.map((f: any) => {
          const p = f.properties;
          const addressParts = [p.name, p.street, p.locality, p.district, p.city, p.state].filter(Boolean);
          // Remove duplicates (e.g., if locality and city are the same)
          const uniqueParts = Array.from(new Set(addressParts));
          
          return {
            lat: f.geometry.coordinates[1].toString(),
            lon: f.geometry.coordinates[0].toString(),
            display_name: uniqueParts.join(", ")
          };
        });
        
        setSuggestions(mappedSuggestions);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    if (isTypingRef.current) {
      const timeoutId = setTimeout(() => {
        searchArea(address);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [address]);

  const handleSuggestionClick = (s: any) => {
    isTypingRef.current = false;
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    const latlng = new L.LatLng(lat, lon);
    
    if (!isPointInPolygon(latlng, SERVICE_AREA)) {
      toast.error("This location is outside our delivery area.");
      return;
    }
    
    setPosition(latlng);
    onChangeAddress(s.display_name);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-[300px] w-full overflow-hidden rounded-xl border border-bordersoft z-0">
        <MapContainer
          center={[17.72, 83.25]}
          zoom={12}
          className="h-full w-full relative"
          zoomControl={false}
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
            setAddress={(addr: string) => {
              isTypingRef.current = false;
              onChangeAddress(addr);
              setSuggestions([]); // clear suggestions when dragging pin
            }}
            isGeocoding={isGeocoding}
            setIsGeocoding={setIsGeocoding}
          />
          <LocateControl />
          <MapCenterUpdater position={position} />
        </MapContainer>
        {isGeocoding && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1 relative">
        <label className="text-xs font-semibold text-textsecond">Selected Address</label>
        <textarea
          rows={3}
          value={address}
          onChange={(e) => {
            isTypingRef.current = true;
            onChangeAddress(e.target.value);
            if (e.target.value.length < 5) setSuggestions([]);
          }}
          className="w-full rounded-md border border-bordersoft p-2 text-sm bg-white"
          placeholder="Click the map or type to search for an address..."
        />
        
        {/* Autocomplete Dropdown */}
        {(suggestions.length > 0 || isSearching) && (
          <div className="absolute top-[100%] left-0 right-0 z-[2000] mt-1 bg-white border border-bordersoft rounded-lg shadow-lg overflow-hidden">
            {isSearching ? (
              <div className="p-3 text-xs text-center text-textsecond flex items-center justify-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" /> Searching...
              </div>
            ) : (
              suggestions.map((s, i) => (
                <div 
                  key={i} 
                  className="p-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-bordersoft last:border-b-0"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s.display_name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
