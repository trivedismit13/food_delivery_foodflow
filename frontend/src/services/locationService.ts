export interface Coordinates {
  latitude: number;
  longitude: number;
}

export class LocationServiceError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = 'LocationServiceError';
  }
}

export const locationService = {
  async getCurrentPosition(): Promise<Coordinates> {
    if (!navigator.geolocation) {
      throw new LocationServiceError(0, 'Geolocation is not supported by your browser');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(`[LocationService] Got coordinates: ${position.coords.latitude}, ${position.coords.longitude}`);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('[LocationService] Error getting location:', error);
          reject(new LocationServiceError(error.code, error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000, // 5 minutes
        }
      );
    });
  }
};
