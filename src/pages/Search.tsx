import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search as SearchIcon, MapPin, List, Map, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMapbox } from '@/contexts/MapboxContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance, formatDistance } from '@/lib/geolocation';
import BottomNav from '@/components/BottomNav';
import StorageCard from '@/components/StorageCard';
import MapView from '@/components/MapView';
import MapboxTokenInput from '@/components/MapboxTokenInput';
import { cn } from '@/lib/utils';

const baseStorages = [
  { id: '1', name: 'Bengaluru Cold Storage', rating: 4.8, capacity: 5000, price: 12, grains: ['Wheat', 'Rice'], lat: 12.9816, lng: 77.5946 },
  { id: '2', name: 'AgriCool Warehouse', rating: 4.5, capacity: 8000, price: 10, grains: ['Maize', 'Pulses'], lat: 12.9352, lng: 77.6245 },
  { id: '3', name: 'FarmStore Hub', rating: 4.7, capacity: 3500, price: 15, grains: ['Wheat', 'Barley'], lat: 12.9998, lng: 77.5510 },
  { id: '4', name: 'KrishiCold Center', rating: 4.6, capacity: 6000, price: 11, grains: ['Rice', 'Millet'], lat: 12.9150, lng: 77.6400 },
  { id: '5', name: 'GreenGrain Storage', rating: 4.4, capacity: 4500, price: 13, grains: ['Wheat', 'Maize'], lat: 13.0200, lng: 77.5700 },
];

const Search = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { mapboxToken, isTokenValid } = useMapbox();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const { latitude, longitude, isLoading: isLocating, getLocation, error: locationError } = useGeolocation();

  // Calculate distances based on user location
  const storagesWithDistance = useMemo(() => {
    const userLat = latitude || 12.9716; // Default to Bengaluru center
    const userLng = longitude || 77.5946;

    return baseStorages
      .map((storage) => {
        const distanceKm = calculateDistance(userLat, userLng, storage.lat, storage.lng);
        return {
          ...storage,
          distance: formatDistance(distanceKm),
          distanceKm,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [latitude, longitude]);

  const filteredStorages = storagesWithDistance.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFacilitySelect = (facility: typeof storagesWithDistance[0]) => {
    navigate(`/storage/${facility.id}`);
  };

  const handleGetLocation = () => {
    getLocation();
  };

  return (
    <div className="page-container bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{t('coldStorageNearMe')}</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={t('searchLocation')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setViewMode('list')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            viewMode === 'list'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground border border-border'
          )}
        >
          <List className="w-4 h-4" />
          List
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            viewMode === 'map'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground border border-border'
          )}
        >
          <Map className="w-4 h-4" />
          Map
        </button>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <>
          {/* Use Location Button */}
          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="w-full p-3 mb-4 bg-accent/10 text-accent rounded-xl flex items-center justify-center gap-2 font-medium disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            {isLocating ? 'Getting location...' : latitude ? 'Location found • Tap to refresh' : t('chooseLocation')}
          </button>

          {locationError && (
            <p className="text-sm text-destructive mb-4 text-center">{locationError}</p>
          )}

          {latitude && (
            <p className="text-xs text-muted-foreground mb-4 text-center">
              Showing {filteredStorages.length} facilities sorted by distance
            </p>
          )}

          <div className="space-y-3 animate-fade-up">
            {filteredStorages.map((storage) => (
              <StorageCard key={storage.id} {...storage} />
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4 animate-fade-up">
          {/* Mapbox Token Input */}
          {!isTokenValid && <MapboxTokenInput />}

          {/* Map View */}
          <MapView
            facilities={filteredStorages}
            onFacilitySelect={handleFacilitySelect}
            mapboxToken={mapboxToken}
          />

          {/* Facility List below map */}
          <div className="space-y-3 mt-4">
            <h3 className="font-semibold text-foreground">{t('nearbyStorage')}</h3>
            {filteredStorages.slice(0, 3).map((storage) => (
              <StorageCard key={storage.id} {...storage} />
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Search;
