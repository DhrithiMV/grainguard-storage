// Haversine formula to calculate distance between two points
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

// Get user's current location
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  });
};

// Watch user's location for real-time updates
export const watchLocation = (
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: GeolocationPositionError) => void
): number | undefined => {
  if (!navigator.geolocation) {
    onError({
      code: 2,
      message: 'Geolocation is not supported',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    });
    return undefined;
  }

  return navigator.geolocation.watchPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  });
};

export const clearLocationWatch = (watchId: number): void => {
  navigator.geolocation.clearWatch(watchId);
};

// Sort facilities by distance from user
export const sortByDistance = <T extends { lat: number; lng: number }>(
  facilities: T[],
  userLat: number,
  userLng: number
): (T & { calculatedDistance: number })[] => {
  return facilities
    .map((facility) => ({
      ...facility,
      calculatedDistance: calculateDistance(userLat, userLng, facility.lat, facility.lng),
    }))
    .sort((a, b) => a.calculatedDistance - b.calculatedDistance);
};

// Get directions URL
export const getDirectionsUrl = (
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  provider: 'google' | 'apple' = 'google'
): string => {
  if (provider === 'apple') {
    return `maps://maps.apple.com/?saddr=${originLat},${originLng}&daddr=${destLat},${destLng}&dirflg=d`;
  }
  return `https://www.google.com/maps/dir/${originLat},${originLng}/${destLat},${destLng}`;
};

// Reverse geocode coordinates to address (using Mapbox)
export const reverseGeocode = async (
  lat: number,
  lng: number,
  mapboxToken: string
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=address,place`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
    return 'Unknown location';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Unknown location';
  }
};

// Forward geocode address to coordinates (using Mapbox)
export const forwardGeocode = async (
  query: string,
  mapboxToken: string,
  proximity?: [number, number]
): Promise<{ lat: number; lng: number; name: string }[]> => {
  try {
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&country=in`;
    
    if (proximity) {
      url += `&proximity=${proximity[0]},${proximity[1]}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    
    return data.features.map((feature: any) => ({
      lat: feature.center[1],
      lng: feature.center[0],
      name: feature.place_name,
    }));
  } catch (error) {
    console.error('Forward geocoding error:', error);
    return [];
  }
};
