import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Navigation, X } from 'lucide-react';

interface StorageFacility {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance: string;
  rating: number;
  capacity: number;
  price: number;
}

interface MapViewProps {
  facilities: StorageFacility[];
  onFacilitySelect: (facility: StorageFacility) => void;
  mapboxToken: string;
}

const MapView = ({ facilities, onFacilitySelect, mapboxToken }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<StorageFacility | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Default center (Bengaluru)
  const defaultCenter: [number, number] = [77.5946, 12.9716];

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: userLocation || defaultCenter,
      zoom: 12,
      pitch: 30,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    map.current.addControl(geolocateControl, 'top-right');

    // Listen for geolocate events
    geolocateControl.on('geolocate', (e: any) => {
      setUserLocation([e.coords.longitude, e.coords.latitude]);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      userMarkerRef.current?.remove();
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Add facility markers
  useEffect(() => {
    if (!map.current || !mapboxToken) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each facility
    facilities.forEach((facility) => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'facility-marker';
      el.innerHTML = `
        <div style="
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, hsl(36, 50%, 32%), hsl(40, 42%, 60%));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(122, 90, 42, 0.3);
          cursor: pointer;
          transition: transform 0.2s;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
      `;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([facility.lng, facility.lat])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedFacility(facility);
        map.current?.flyTo({
          center: [facility.lng, facility.lat],
          zoom: 14,
          duration: 1000,
        });
      });

      markersRef.current.push(marker);
    });
  }, [facilities, mapboxToken]);

  // Fit bounds to show all facilities
  useEffect(() => {
    if (!map.current || facilities.length === 0 || !mapboxToken) return;

    const bounds = new mapboxgl.LngLatBounds();
    facilities.forEach(facility => {
      bounds.extend([facility.lng, facility.lat]);
    });

    if (userLocation) {
      bounds.extend(userLocation);
    }

    map.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 14,
      duration: 1000,
    });
  }, [facilities, userLocation, mapboxToken]);

  const handleGetDirections = (facility: StorageFacility) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation[1]},${userLocation[0]}/${facility.lat},${facility.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${facility.lat},${facility.lng}`;
      window.open(url, '_blank');
    }
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 13,
          duration: 1500,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  if (!mapboxToken) {
    return (
      <div className="h-[50vh] bg-muted rounded-2xl flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium mb-2">Mapbox Token Required</p>
          <p className="text-sm text-muted-foreground">
            Enter your Mapbox public token to enable the map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapContainer} className="h-[50vh] rounded-2xl overflow-hidden shadow-soft" />

      {/* Locate Me Button */}
      <button
        onClick={handleLocateMe}
        disabled={isLocating}
        className="absolute bottom-4 left-4 px-4 py-2.5 bg-card rounded-xl shadow-elevated flex items-center gap-2 font-medium text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
      >
        <Navigation className={`w-4 h-4 text-primary ${isLocating ? 'animate-pulse' : ''}`} />
        {isLocating ? 'Locating...' : 'Locate Me'}
      </button>

      {/* Selected Facility Card */}
      {selectedFacility && (
        <div className="absolute bottom-4 right-4 left-20 bg-card rounded-xl shadow-elevated p-4 animate-scale-in">
          <button
            onClick={() => setSelectedFacility(null)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <h4 className="font-semibold text-foreground pr-6">{selectedFacility.name}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedFacility.distance} • ⭐ {selectedFacility.rating} • {selectedFacility.capacity} kg
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onFacilitySelect(selectedFacility)}
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              {t('viewDetails')}
            </button>
            <button
              onClick={() => handleGetDirections(selectedFacility)}
              className="px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm font-medium flex items-center gap-1"
            >
              <Navigation className="w-4 h-4" />
              {t('directions')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
