// GPS and Map Service
// Using browser Geolocation API + Mapbox for maps

interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

interface GPSService {
  getCurrentPosition(): Promise<Location | null>;
  watchPosition(callback: (location: Location) => void): () => void;
  calculateDistance(from: Location, to: Location): number;
  isNearby(location1: Location, location2: Location, radiusMeters: number): boolean;
}

class BrowserGPSService implements GPSService {
  async getCurrentPosition(): Promise<Location | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error('Geolocation not supported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Return default Cheung Chau location for demo
          resolve({
            lat: 22.2086,
            lng: 114.0299,
            accuracy: 100,
            timestamp: Date.now()
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  watchPosition(callback: (location: Location) => void): () => void {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      // Return default location periodically
      const interval = setInterval(() => {
        callback({
          lat: 22.2086,
          lng: 114.0299,
          accuracy: 100,
          timestamp: Date.now()
        });
      }, 5000);
      return () => clearInterval(interval);
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        });
      },
      (error) => {
        console.error('GPS watch error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }

  calculateDistance(from: Location, to: Location): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = from.lat * Math.PI / 180;
    const φ2 = to.lat * Math.PI / 180;
    const Δφ = (to.lat - from.lat) * Math.PI / 180;
    const Δλ = (to.lng - from.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  isNearby(location1: Location, location2: Location, radiusMeters: number): boolean {
    const distance = this.calculateDistance(location1, location2);
    return distance <= radiusMeters;
  }
}

// Export singleton instance
export const gpsService = new BrowserGPSService();

// Helper function to format location as string
export function formatLocation(location: Location): string {
  return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
}

// Helper function to open in external map app
export function openInMaps(location: Location, _label: string = 'Location'): void {
  // Universal map link format
  const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  window.open(url, '_blank');
}
