import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";


// Corrige le bug d'icône sur Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Filtre : à adapter si tu veux plus de périodes ou de types
const periodOptions = [
  { value: "", label: "Toutes périodes" },
  { value: "day", label: "Aujourd'hui" },
  { value: "week", label: "Cette semaine" },
  { value: "month", label: "Ce mois" },
  { value: "year", label: "Cette année" },
];
const typeOptions = [
  { value: "", label: "Tous types" },
  { value: "Vol", label: "Vol" },
  { value: "Agression", label: "Agression" },
  // ... complète avec tes types d’infractions
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function InfractionsMapPro() {
  const [quartiers, setQuartiers] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtres
  const [period, setPeriod] = useState("");
  const [type, setType] = useState("");
  const [unite, setUnite] = useState("");
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showClusters, setShowClusters] = useState(true);

  // Impression
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Carte des infractions - e-DPVN",
  });

  // Quartiers (GeoJSON)
  useEffect(() => {
    axios.get(`${API_BASE}/geodata/quartiers/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setQuartiers(res.data.results || res.data))
      .catch(() => setError("Impossible de charger les quartiers"));
  }, []);

  // Infractions groupées
  useEffect(() => {
  setLoading(true);
  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (type) params.append("type", type);
  if (unite) params.append("unite", unite);

  const url = `${API_BASE}/activities/judiciaire/infractions/group_by_quartier/${
    params.toString() ? "?" + params.toString() : ""
  }`;

  axios.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
    .then(res => setGroupedData(res.data))
    .catch(() => setError("Impossible de charger les infractions"))
    .finally(() => setLoading(false));
}, [period, type, unite]);

  // Données pour heatmap
  const allPoints = groupedData.flatMap(gr =>
    gr.infractions
      .filter(inf => inf.latitude && inf.longitude)
      .map(inf => [inf.latitude, inf.longitude, 1])
  );

  // Données pour clustering
  const allMarkers = groupedData.flatMap(gr =>
    gr.infractions
      .filter(inf => inf.latitude && inf.longitude)
      .map(inf => ({
        ...inf,
        quartier_nom: gr.quartier_nom,
        quartier_id: gr.quartier_id
      }))
  );

  // Couleur polygones (heatmap/choropleth)
  function getColor(val, max) {
    if (val === 0) return "#e0e7ef";
    const pct = val / (max || 1);
    if (pct > 0.7) return "#e4001c";
    if (pct > 0.5) return "#ff9800";
    if (pct > 0.25) return "#ffe071";
    return "#6ee7b7";
  }
  const maxInf = Math.max(...groupedData.map(q => q.nb_infractions || 0), 1);

  // Export Excel
  function exportExcel() {
    const data = groupedData.map(q => ({
      Quartier: q.quartier_nom,
      "Nombre d'infractions": q.nb_infractions,
      Infractions: q.infractions.map(i => `${i.type} (${i.date_infraction})`).join(", ")
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Infractions par quartier");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "infractions_par_quartier.xlsx");
  }

  // Légende
  function Legend() {
    return (
      <div className="bg-white rounded-xl shadow p-4 text-xs border border-slate-200">
        <div className="font-bold mb-2 text-slate-700">Légende :</div>
        <div className="flex items-center mb-1">
          <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ background: "#e4001c" }} /> Densité très élevée
        </div>
        <div className="flex items-center mb-1">
          <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ background: "#ff9800" }} /> Densité élevée
        </div>
        <div className="flex items-center mb-1">
          <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ background: "#ffe071" }} /> Moyenne
        </div>
        <div className="flex items-center mb-1">
          <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ background: "#6ee7b7" }} /> Faible
        </div>
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ background: "#e0e7ef" }} /> Aucun signalé
        </div>
      </div>
    );
  }

  // Centre carte : Niamey (modifie si tu veux)
  const center = [13.5126, 2.1125];

  return (
    <div className="max-w-7xl mx-auto py-6 px-2" ref={printRef}>
      {/* Header + actions */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <img src="/logo_e-dpvn.png" alt="Logo" className="h-10" />
          <h2 className="text-2xl font-extrabold text-slate-800 flex-1">Carte des infractions – Analyse avancée</h2>
        </div>
        <button className="bg-blue-700 text-white rounded px-3 py-1 shadow" onClick={handlePrint}>
          🖨️ Imprimer / PDF
        </button>
        <button className="bg-green-600 text-white rounded px-3 py-1 shadow" onClick={exportExcel}>
          ⬇️ Export Excel
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-4">
        <label>Période
          <select className="ml-2 border rounded p-1" value={period} onChange={e => setPeriod(e.target.value)}>
            {periodOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>
        <label>Type
          <select className="ml-2 border rounded p-1" value={type} onChange={e => setType(e.target.value)}>
            {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>
        <label>Afficher heatmap
          <input type="checkbox" className="ml-2" checked={showHeatmap} onChange={e => setShowHeatmap(e.target.checked)} />
        </label>
        <label>Afficher clusters
          <input type="checkbox" className="ml-2" checked={showClusters} onChange={e => setShowClusters(e.target.checked)} />
        </label>
      </div>

      {loading && <div>Chargement…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div className="flex gap-6 flex-col md:flex-row">
        <div className="w-full md:w-3/4 h-[75vh] rounded-xl overflow-hidden shadow-xl border border-blue-100 bg-white">
          <MapContainer center={center} zoom={12} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Carte Standard">
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            {/* Heatmap */}
            {showHeatmap && (
              <HeatmapLayer
                fitBoundsOnLoad
                fitBoundsOnUpdate
                points={allPoints}
                longitudeExtractor={m => m[1]}
                latitudeExtractor={m => m[0]}
                intensityExtractor={m => m[2]}
                radius={25}
                blur={18}
                max={1}
              />
            )}
            {/* Polygones colorés */}
            {quartiers.map(q => {
              const data = groupedData.find(gr => gr.quartier_id === q.id);
              const count = data ? data.nb_infractions : 0;
              return (
                <GeoJSON
                  key={q.id}
                  data={q.geom}
                  style={{
                    color: "#444",
                    fillColor: getColor(count, maxInf),
                    fillOpacity: 0.6,
                    weight: 1.2,
                  }}
                >
                  {/* Popup sur polygone */}
                  <Popup>
                    <div className="font-bold mb-2">{q.nom}</div>
                    <div className="text-blue-800 font-semibold mb-1">
                      Nombre d’infractions : {count}
                    </div>
                    {data && data.infractions.length > 0 && (
                      <ul className="text-xs text-gray-700 list-disc pl-4">
                        {data.infractions.slice(0, 8).map((inf, i) => (
                          <li key={inf.id || i}>
                            <b>{inf.type || "Infraction"}</b> – {inf.date_infraction}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Popup>
                </GeoJSON>
              );
            })}
            {/* Clustering */}
            {showClusters && (
              <MarkerClusterGroup>
                {allMarkers.map((inf, idx) => (
                  <Marker
                    key={inf.id || idx}
                    position={[Number(inf.latitude), Number(inf.longitude)]}
                  >
                    <Popup>
                      <div className="font-bold mb-1">{inf.type || "Infraction"}</div>
                      <div className="text-xs text-gray-700">{inf.description || inf.resume || ""}</div>
                      <div className="text-xs text-blue-800 mt-1">
                        Date : {inf.date_infraction || inf.date || ""}
                      </div>
                      <div className="text-xs mt-1">
                        Quartier : {inf.quartier_nom}
                      </div>
                      <div className="text-xs mt-1">
                        <a
                          href={`/judiciaire/infraction/${inf.id}`}
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ➔ Voir fiche
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            )}
          </MapContainer>
        </div>
        <div className="md:w-1/4 w-full flex flex-col gap-4">
          <Legend />
          <div className="bg-white rounded-xl shadow p-4 text-xs border border-slate-200">
            <div className="font-bold mb-2 text-slate-700">Totaux</div>
            <div>Total quartiers : {quartiers.length}</div>
            <div>Total infractions : {groupedData.reduce((acc, q) => acc + (q.nb_infractions || 0), 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
