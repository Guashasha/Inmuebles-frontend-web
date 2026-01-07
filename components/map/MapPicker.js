"use client";
import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function DraggableMarker({ position, onPositionChange }) {
  const [markerPos, setMarkerPos] = useState(position);

  useEffect(() => {
    setMarkerPos(position);
  }, [position]);

  const eventHandlers = useMemo(
    () => ({
      dragend(e) {
        const marker = e.target;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setMarkerPos(newPos);
          onPositionChange(newPos);
        }
      },
    }),
    [onPositionChange]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={markerPos}
      autoPan={true}
    />
  );
}

function MapUpdater({ center }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16);
    }
  }, [center, map]);
  return null;
}

export default function MapPicker({ lat, lng, onChange }) {
  const defaultCenter = [19.543775, -96.927639];

  const position = lat && lng ? [lat, lng] : defaultCenter;

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "8px", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker
        position={position}
        onPositionChange={(newPos) => onChange(newPos.lat, newPos.lng)}
      />
      <MapUpdater center={position} />
    </MapContainer>
  );
}
