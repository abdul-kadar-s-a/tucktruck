import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { pickupIcon, dropoffIcon, truckIcon, configureLeaflet } from '../../config/leaflet-config';
import 'leaflet/dist/leaflet.css';

// Initialize Leaflet configuration once
configureLeaflet();

interface TamilNaduMapProps {
    pickup?: [number, number];
    dropoff?: [number, number];
    driverLocation?: [number, number];
    showRoute?: boolean;
    height?: string;
    zoom?: number;
    interactive?: boolean;
    className?: string; // Add className prop for additional styling
}

// Component to update map center and bounds when props change
function MapUpdater({ pickup, dropoff, driverLocation, zoom }: TamilNaduMapProps) {
    const map = useMap();

    useEffect(() => {
        // Collect all valid points to fit bounds
        const points: [number, number][] = [];
        if (pickup) points.push(pickup);
        if (dropoff) points.push(dropoff);
        if (driverLocation) points.push(driverLocation);

        if (points.length > 0) {
            const bounds = points; // Leaflet natively handles array of latlngs for fitBounds
            // @ts-ignore
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        } else {
            // Default to Tamil Nadu center
            map.setView([11.1271, 78.6569], zoom || 7);
        }
    }, [map, pickup, dropoff, driverLocation, zoom]);

    return null;
}

export function TamilNaduMap({
    pickup,
    dropoff,
    driverLocation,
    showRoute = true,
    height = "400px",
    zoom = 7,
    interactive = true,
    className = ""
}: TamilNaduMapProps) {

    const center: [number, number] = [11.1271, 78.6569];

    const routePolyline = pickup && dropoff ? [pickup, dropoff] : [];

    // Route from driver to next destination
    // If driver exists and pickup exists -> Driver is en route to pickup
    // If driver exists and dropoff exists (and pickup exists) -> This logic depends on status, 
    // but for generic map, if we have driver and pickup/dropoff, we might want to show line from driver too.
    // For simplicity here, we stick to pickup->dropoff line primarily.

    return (
        <div className={`w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm ${className}`} style={{ height }}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={interactive}
                dragging={interactive}
                zoomControl={interactive}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater pickup={pickup} dropoff={dropoff} driverLocation={driverLocation} zoom={zoom} />

                {pickup && (
                    <Marker position={pickup} icon={pickupIcon}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold text-green-600">Pickup Location</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {dropoff && (
                    <Marker position={dropoff} icon={dropoffIcon}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold text-red-600">Dropoff Location</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {driverLocation && (
                    <Marker position={driverLocation} icon={truckIcon}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold text-blue-600">Driver Location</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {showRoute && routePolyline.length > 0 && (
                    <Polyline
                        positions={routePolyline}
                        color="#3b82f6" // Blue-500
                        weight={4}
                        opacity={0.7}
                        dashArray="10, 10"
                    />
                )}

                {/* Draw line from driver to pickup/dropoff if applicable could go here */}

            </MapContainer>
        </div>
    );
}
