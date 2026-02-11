// Tamil Nadu City Coordinates (Approximate Centers)
export const TAMIL_NADU_CITIES: Record<string, [number, number]> = {
    'chennai': [13.0827, 80.2707],
    'coimbatore': [11.0168, 76.9558],
    'madurai': [9.9252, 78.1198],
    'tiruchirappalli': [10.7905, 78.7047],
    'salem': [11.6643, 78.1460],
    'tirunelveli': [8.7139, 77.7567],
    'erode': [11.3410, 77.7172],
    'vellore': [12.9165, 79.1325],
    'thoothukudi': [8.7642, 78.1348],
    'dindigul': [10.3673, 77.9803],
    'thanjavur': [10.7870, 79.1378],
    'hosur': [12.7409, 77.8253],
    'nagercoil': [8.1833, 77.4119],
    'kanchipuram': [12.8185, 79.7036],
    'kumarapalayam': [11.4428, 77.7246],
    'karaikudi': [10.0735, 78.7732],
    'neyveli': [11.5385, 79.4893],
    'cuddalore': [11.7480, 79.7714],
    'kumbakonam': [10.9602, 79.3845],
    'tiruvannamalai': [12.2253, 79.0747],
};

const TAMIL_NADU_CENTER: [number, number] = [11.1271, 78.6569];

// Simple Haversine Distance Calculation (in km)
export const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(point2[0] - point1[0]);
    const dLon = deg2rad(point2[1] - point1[1]);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(point1[0])) * Math.cos(deg2rad(point2[0])) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Number(d.toFixed(2));
};

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};

// Mock Geocoding - Uses predefined city list or random offset from center if not found
// In production, use Nominatim or Google Geocoding API
export const geocodeAddress = async (address: string): Promise<[number, number]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const lowerAddress = address.toLowerCase();

    // Check if known city name is in the address string
    for (const [city, coords] of Object.entries(TAMIL_NADU_CITIES)) {
        if (lowerAddress.includes(city)) {
            // Add small random offset to simulate specific street locations within the city
            const latOffset = (Math.random() - 0.5) * 0.05;
            const lngOffset = (Math.random() - 0.5) * 0.05;
            return [coords[0] + latOffset, coords[1] + lngOffset];
        }
    }

    // If no city found, return a random location within Tamil Nadu bounds (approx)
    // Latitude: 8.0 to 13.5, Longitude: 76.2 to 80.3
    // This is just a fallback for the demo
    const lat = 9 + Math.random() * 3;
    const lng = 77 + Math.random() * 2;
    return [lat, lng];
};

export const calculateETA = (distanceKm: number, speedKmph: number = 40): string => {
    const hours = distanceKm / speedKmph;
    const minutes = Math.round(hours * 60);

    if (minutes < 60) {
        return `${minutes} mins`;
    }

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h} hr ${m} min`;
};

// Simulate driver movement between two points
export const interpolatePosition = (
    start: [number, number],
    end: [number, number],
    fraction: number
): [number, number] => {
    const lat = start[0] + (end[0] - start[0]) * fraction;
    const lng = start[1] + (end[1] - start[1]) * fraction;
    return [lat, lng];
};
