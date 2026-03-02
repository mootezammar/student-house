import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const houseIcon = new L.DivIcon({
  html: `<div style="background:#2792e2;color:white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);width:38px;height:38px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">
    <span style="transform:rotate(45deg);font-size:18px;">🏠</span>
  </div>`,
  className: "",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const eduColors = {
  Université: "#3b82f6",
  ISET: "#22c55e",
  IPEI: "#a855f7",
  ISI: "#f97316",
  "Faculté de Médecine": "#ef4444",
  "École Privée": "#eab308",
};

const getEduIcon = (type) => {
  const color = eduColors[type] || "#6b7280";
  return new L.DivIcon({
    html: `<div style="background:${color};color:white;border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.25);border:2px solid white;font-size:15px;">🎓</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Composant pour ajuster la vue automatiquement
const FitBounds = ({ property }) => {
  const map = useMap();

  useEffect(() => {
    const points = [
      [property.coordinates.lat, property.coordinates.lng],
      ...(property.nearbyEducation?.map((edu) => [edu.lat, edu.lng]) || []),
    ];
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [property, map]);

  return null;
};

const PropertyMap = ({ property }) => {
  if (!property.coordinates) return null;

  const { lat, lng } = property.coordinates;

  return (
    <div className="mt-8">
      <h4 className="h4 mb-3">📍 Location & Nearby Schools</h4>

      {/* Légende */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs bg-secondary text-white px-3 py-1 rounded-full font-medium">
          🏠 Property
        </span>
        {Object.entries(eduColors).map(([type, color]) => (
          <span
            key={type}
            className="text-xs px-3 py-1 rounded-full font-medium text-white"
            style={{ backgroundColor: color }}
          >
            🎓 {type}
          </span>
        ))}
      </div>

      {/* Carte */}
      <div
        className="rounded-xl overflow-hidden ring-1 ring-slate-900/10"
        style={{ height: "420px" }}
      >
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Auto fit bounds */}
          <FitBounds property={property} />

          {/* Marker maison */}
          <Marker position={[lat, lng]} icon={houseIcon}>
            <Popup>
              <div style={{ fontSize: "13px" }}>
                <p style={{ fontWeight: "bold", color: "#2792e2" }}>
                  {property.title}
                </p>
                <p style={{ color: "#888" }}>{property.address}</p>
                <p style={{ fontWeight: "600", marginTop: "4px" }}>
                  {property.price.rent} DT/mo
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Cercle rayon 1.5km */}
          <Circle
            center={[lat, lng]}
            radius={1500}
            pathOptions={{
              color: "#2792e2",
              fillColor: "#2792e2",
              fillOpacity: 0.05,
              weight: 1.5,
            }}
          />

          {/* Markers écoles */}
          {property.nearbyEducation?.map((edu, index) => (
            <Marker
              key={index}
              position={[edu.lat, edu.lng]}
              icon={getEduIcon(edu.type)}
            >
              <Popup>
                <div style={{ fontSize: "13px" }}>
                  <p style={{ fontWeight: "bold" }}>{edu.name}</p>
                  <p style={{ color: eduColors[edu.type], fontWeight: "500" }}>
                    {edu.type}
                  </p>
                  <p style={{ color: "#888", marginTop: "4px" }}>
                    📍 {edu.distance} from property
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default PropertyMap;
