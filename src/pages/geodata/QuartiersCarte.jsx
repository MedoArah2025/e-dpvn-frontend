import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// Couleurs pour différencier les quartiers
function getRandomColor(i) {
  // Palette lisible, ou tu peux faire + sophistiqué
  const COLORS = [
    "#1d4ed8", "#047857", "#ca8a04", "#dc2626", "#9333ea", "#f59e42",
    "#22d3ee", "#84cc16", "#f43f5e", "#6366f1", "#0ea5e9"
  ];
  return COLORS[i % COLORS.length];
}

export default function QuartiersCarte() {
  const [quartiers, setQuartiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Centrage sur Niamey
  const center = [13.5126, 2.1125];

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/geodata/quartiers/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setQuartiers(res.data.results || res.data); // pagination ou pas
      })
      .catch(() => setError("Impossible de charger les quartiers"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">Carte des Quartiers de Niamey</h2>
      {loading && <div>Chargement…</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow-lg border border-blue-100">
        <MapContainer center={center} zoom={12} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {quartiers.map((q, i) => (
            q.geom && q.geom.coordinates ? (
              <Polygon
                key={q.id}
                positions={
                  // Support Polygon ou MultiPolygon
                  q.geom.type === "Polygon"
                    ? q.geom.coordinates.map(ring =>
                        ring.map(([lng, lat]) => [lat, lng])
                      )
                    : q.geom.type === "MultiPolygon"
                    ? q.geom.coordinates.flat().map(ring =>
                        ring.map(([lng, lat]) => [lat, lng])
                      )
                    : []
                }
                pathOptions={{
                  fillColor: getRandomColor(i),
                  color: "#222",
                  weight: 2,
                  fillOpacity: 0.25,
                }}
              >
                <Popup>
                  <div className="font-bold">{q.nom}</div>
                  <div className="text-xs text-gray-600">ID : {q.id}</div>
                </Popup>
              </Polygon>
            ) : null
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
