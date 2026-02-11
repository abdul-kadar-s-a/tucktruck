import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";

export default function BookingMapView() {
    const [position, setPosition] = useState<[number, number]>([10.7905, 78.7047]); // Trichy default

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude]);
        });
    }, []);

    return (
        <div style={{ height: "500px", width: "100%" }}>
            <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>Admin Current Location</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
