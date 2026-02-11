import { useState, useEffect } from 'react';
import { TamilNaduMap } from './TamilNaduMap';
import { calculateDistance, calculateETA } from '../../utils/locationService';

interface LiveTrackingMapProps {
    bookingId: string;
    pickup: [number, number];
    dropoff: [number, number];
    driverId?: string;
    status: string;
    height?: string;
    driverLocation?: [number, number];
}

export function LiveTrackingMap({ bookingId, pickup, dropoff, driverId, status, height = "400px", driverLocation: propDriverLocation }: LiveTrackingMapProps) {
    const [internalDriverLocation, setInternalDriverLocation] = useState<[number, number] | undefined>(undefined);
    const [eta, setEta] = useState<string>('');
    const [distanceRemaining, setDistanceRemaining] = useState<number>(0);

    // Use prop location if provided, otherwise fallback to internal state
    const driverLocation = propDriverLocation || internalDriverLocation;

    // Poll for driver location updates if not provided via props
    useEffect(() => {
        if (propDriverLocation) return; // Skip internal polling if location is provided by parent

        if (!driverId || ['pending', 'cancelled', 'completed'].includes(status)) {
            setInternalDriverLocation(undefined);
            return;
        }

        const fetchDriverLocation = () => {
            try {
                // In a real app, this would be an API call
                // Here we simulate checking localStorage where the driver app writes coordinates
                const locationKey = `driver_location_${bookingId}`;
                const storedLoc = localStorage.getItem(locationKey);

                if (storedLoc) {
                    const data = JSON.parse(storedLoc);
                    // Only update if fresh (within last minute or so) - skipping timestamp check for demo simplicity
                    if (data.location) {
                        setInternalDriverLocation(data.location);

                        // Calculate ETA to next point
                        let targetPoint = pickup;
                        if (['picked-up', 'in-transit', 'arrived-dropoff'].includes(status)) {
                            targetPoint = dropoff;
                        }

                        const dist = calculateDistance(data.location, targetPoint);
                        setDistanceRemaining(dist);
                        setEta(calculateETA(dist));
                    }
                } else {
                    // For demo purposes, if no live location is found but we have a driver,
                    // we can simulate a starting position near pickup (if just accepted)
                    // or midway point.
                    // But let's leave it undefined to indicate "Waiting for GPS"
                }
            } catch (err) {
                console.error("Error fetching driver location", err);
            }
        };

        fetchDriverLocation();
        const interval = setInterval(fetchDriverLocation, 5000); // Poll every 5s

        return () => clearInterval(interval);
    }, [bookingId, driverId, status, pickup, dropoff]);

    return (
        <div className="relative">
            <TamilNaduMap
                pickup={pickup}
                dropoff={dropoff}
                driverLocation={driverLocation}
                height={height}
            />

            {driverLocation && (
                <div className="absolute top-4 left-4 right-4 z-[400] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Est. Arrival</p>
                        <p className="text-lg font-bold text-blue-600">{eta || 'Calculating...'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 font-semibold uppercase">Distance</p>
                        <p className="text-lg font-bold text-gray-800">{distanceRemaining} km</p>
                    </div>
                </div>
            )}
        </div>
    );
}
