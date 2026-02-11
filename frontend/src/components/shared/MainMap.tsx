import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MainMapProps {
    center?: [number, number];
    zoom?: number;
    pickupLocation?: [number, number];
    dropoffLocation?: [number, number];
}

const MainMap: React.FC<MainMapProps> = ({
    center = [13.0827, 80.2707], // Chennai default
    zoom = 13,
    pickupLocation,
    dropoffLocation
}) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{
                height: "100vh",
                width: "100%",
                position: "absolute",
                zIndex: 1
            }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {pickupLocation && (
                <Marker position={pickupLocation}>
                    <Popup>Pickup Location</Popup>
                </Marker>
            )}

            {dropoffLocation && (
                <Marker position={dropoffLocation}>
                    <Popup>Dropoff Location</Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default MainMap;
