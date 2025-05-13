/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

export default function LocationPicker({ onSelect }: { onSelect: (coords: { lat: number; lon: number }) => void }) {
    const [marker, setMarker] = useState<{ lat: number; lon: number } | null>(null);

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setMarker({ lat, lon: lng });
                onSelect({ lat, lon: lng });
            }
        });
        return null;
    };

    return (
        <MapContainer center={[41.0082, 28.9784]} zoom={6} style={{ height: 400, width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <MapClickHandler />
            {marker && <Marker position={[marker.lat, marker.lon]} />}
        </MapContainer>
    );
}
