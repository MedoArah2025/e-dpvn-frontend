// src/pages/judiciaire/InfractionsMap.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// Fix icônes Leaflet pour React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function InfractionsMap() {
  const [quartiers, setQuartiers] = useState([]);
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Centrage Niamey
  const center = [13.5126, 2.1125];

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/geodata/quartiers/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setQuartiers(res.data.results || res.data))
    .catch(() => setError("Impossible de charger les quartiers"));
    axios.get(`${API_BASE}/activities/judiciaire/infractions/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setInfractions(res.data.results || res.data))
    .catch(() => setError("Impossible de charger les infractions"))
    .finally(() => setLoading(false));
  }, []);

  // Map quartiers pour accès rapide
  const quartiersMap = Object.fromEntries(quartiers.map(q => [q.nom, q]));

  // Groupement des infractions par nom de quartier
  const infraParQuartier = {};
  infractions.forEach(inf => {
    if (!infraParQuartier[inf.quartier]) infraParQuartier[inf.quartier] = [];
    infraParQuartier[inf.quartier].push(inf);
  });

  // Couleurs (optionnel)
  function getRandomColor(i) {
    const COLORS = ["#1d4ed8", "#047857", "#ca8a04", "#dc2626", "#9333ea", "#f59e42", "#22d3ee", "#84cc16", "#f43f5e", "#6366f1", "#0ea5e9"];
    return COLORS[i % COLORS.length];
  }

  return (
    <div className="max-w-5xl mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">Carte des Infractions par Quartier – Niamey</h2>
      {loading && <div>Chargement…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
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
                  fillOpacity: 0.18,
                }}
              >
                <Popup>
                  <div className="font-bold">{q.nom}</div>
                  <div className="text-blue-800 font-semibold mb-1">
                    Nombre d’infractions : {(infraParQuartier[q.nom] || []).length}
                  </div>
                  <ul className="text-xs text-gray-700 list-disc pl-4">
                    {(infraParQuartier[q.nom] || []).slice(0, 6).map((inf, i) => (
                      <li key={inf.id || i}>
                        {inf.type || "Infraction"} – {inf.date_infraction || inf.date}
                      </li>
                    ))}
                  </ul>
                  {(infraParQuartier[q.nom] || []).length > 6 && (
                    <div className="text-xs mt-1 text-gray-400">
                      ...et {(infraParQuartier[q.nom] || []).length - 6} autres.
                    </div>
                  )}
                </Popup>
              </Polygon>
            ) : null
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
