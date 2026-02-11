/**
 * Geolocation Service
 * Wrapper for browser Geolocation API with error handling
 * Used for real-time driver location tracking
 */

export interface LocationCoordinates {
    lat: number;
    lng: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
    timestamp: number;
}

export interface GeolocationError {
    code: number;
    message: string;
}

/**
 * Get current position once
 */
export function getCurrentPosition(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({
                code: 0,
                message: 'Geolocation is not supported by this browser',
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    speed: position.coords.speed || undefined,
                    heading: position.coords.heading || undefined,
                    timestamp: position.timestamp,
                });
            },
            (error) => {
                reject({
                    code: error.code,
                    message: getErrorMessage(error.code),
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    });
}

/**
 * Watch position continuously
 * Returns watchId that can be used to clear the watch
 */
export function watchPosition(
    onSuccess: (location: LocationCoordinates) => void,
    onError?: (error: GeolocationError) => void
): number | null {
    if (!navigator.geolocation) {
        if (onError) {
            onError({
                code: 0,
                message: 'Geolocation is not supported by this browser',
            });
        }
        return null;
    }

    const watchId = navigator.geolocation.watchPosition(
        (position) => {
            onSuccess({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                speed: position.coords.speed || undefined,
                heading: position.coords.heading || undefined,
                timestamp: position.timestamp,
            });
        },
        (error) => {
            if (onError) {
                onError({
                    code: error.code,
                    message: getErrorMessage(error.code),
                });
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000, // Accept cached position up to 5 seconds old
        }
    );

    return watchId;
}

/**
 * Clear position watch
 */
export function clearWatch(watchId: number): void {
    if (navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
    }
}

/**
 * Check if geolocation is available
 */
export function isGeolocationAvailable(): boolean {
    return 'geolocation' in navigator;
}

/**
 * Request geolocation permission
 */
export async function requestGeolocationPermission(): Promise<boolean> {
    try {
        const position = await getCurrentPosition();
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get human-readable error message
 */
function getErrorMessage(code: number): string {
    switch (code) {
        case 1:
            return 'Location permission denied. Please enable location access in your browser settings.';
        case 2:
            return 'Location unavailable. Please check your device settings.';
        case 3:
            return 'Location request timed out. Please try again.';
        default:
            return 'An unknown error occurred while getting your location.';
    }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}
