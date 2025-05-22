import React, { useEffect, useState } from "react";
import axios from "axios";

// ---- CONSTANTES
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const CATEGORIES = [
  { value: "all", label: "Tous groupes" },
  { value: "administratif", label: "Administratif" },
  { value: "circulation", label: "Circulation" },
  { value: "constat", label: "Constat" },
  { value: "disposition", label: "Disposition" },
  { value: "judiciaire", label: "Judiciaire" },
  { value: "operation", label: "Opérations" },
  { value: "rh", label: "RH" },
  { value: "spja", label: "SPJA" },
];
const GROUPS_LABELS = {
  autres_declarations: "Autres Déclarations",
  procurations: "Procurations",
  declarations_perte: "Déclarations Perte",
  certificats_residence: "Certificats Résidence",
  cin: "CIN",
  amendes_forfaitaires: "Amendes Forfaitaires",
  engins_immobilises: "Engins Immobilisés",
  pieces_retirees: "Pièces Retirées",
  vitres_teintees: "Vitres Teintées",
  controles_routiers: "Contrôles Routiers",
  accidents_circulation: "Accidents Circulation",
  slct_cto: "SLCT CTO",
  dpj: "DPJ",
  ocr_im: "OCR IM",
  douane: "Douane",
  dst: "DST",
  dpmf: "DPMF",
  pavillon_e: "Pavillon E",
  soniloga: "Soniloga",
  positionnements: "Positionnements",
  services_ordre: "Services d’Ordre",
  patrouilles: "Patrouilles",
  coups_poing: "Coups de Poing",
  raffles: "Raffles",
  descentes: "Descentes",
  interpellations: "Interpellations",
  gav: "GAV",
  deferements: "Déféréments",
  plaintes: "Plaintes",
  declaration_vols: "Déclaration Vols",
  infractions: "Infractions",
  saisies_drogue: "Saisies Drogue",
  autres_saisies: "Autres Saisies",
  requisitions: "Réquisitions",
  incendies: "Incendies",
  noyades: "Noyades",
  decouvertes_cadavre: "Découvertes Cadavre",
  personnes_enlevees: "Personnes Enlevées",
  vehicules_enleves: "Véhicules Enlevés",
  effectif_rh: "Effectif RH",
  mises_a_disposition_spja: "Mises à Disposition SPJA",
};
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function formatLabel(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

// ---- FONCTION PRINCIPALE
export default function StatsUnit() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdminOrDir = user.is_staff || user.role === "admin" || user.role === "direction";
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(user.unit?.id ? String(user.unit.id) : "");
  const [category, setCategory] = useState("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- UI state pour pagination et recherche
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Charger la liste des unités
  useEffect(() => {
    if (isAdminOrDir) {
      axios.get(`${API_BASE}/units/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const data = Array.isArray(res.data)
          ? res.data.map(u => ({ ...u, id: String(u.id) }))
          : [];
        setUnits(data);
        if ((!selectedUnit || selectedUnit === "") && data.length > 0) {
          setSelectedUnit(data[0].id);
        }
      });
    }
    // eslint-disable-next-line
  }, [token, isAdminOrDir]);

  // Forcer l’unité pour agent
  useEffect(() => {
    if (!isAdminOrDir && user.unit?.id && selectedUnit !== String(user.unit.id)) {
      setSelectedUnit(String(user.unit.id));
    }
    // eslint-disable-next-line
  }, [user.unit, isAdminOrDir, selectedUnit]);

  // Charger les stats (ne rien faire si selectedUnit vide)
  useEffect(() => {
    if (!selectedUnit) return;
    setLoading(true);
    setError(null);
    let url = `${API_BASE}/statistics/units/${selectedUnit}/?`;
    if (start) url += `start=${start}&`;
    if (end) url += `end=${end}&`;
    if (category && category !== "all") url += `groups=${category}`;
    axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStats(res.data.stats || {}))
      .catch(err => setError(err.response?.data?.detail || "Impossible de charger les stats"))
      .finally(() => setLoading(false));
  }, [selectedUnit, category, start, end, token]);

  // --- Filtrer stats
  let filteredStats = category === "all"
    ? stats
    : Object.fromEntries(Object.entries(stats).filter(([key, val]) => val.group === category));
  // --- Recherche instantanée sur toutes les colonnes
  filteredStats = Object.fromEntries(
    Object.entries(filteredStats).filter(([key, val]) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      // Recherche sur label, groupe, count ou totaux
      const label = (GROUPS_LABELS[key] || formatLabel(key)).toLowerCase();
      const group = val.group?.toLowerCase() || "";
      const count = String(val.count || "").toLowerCase();
      const totals = Object.entries(val.totals || {}).map(([k, v]) => (k + " " + v)).join(" ").toLowerCase();
      return [label, group, count, totals].some(field => field.includes(q));
    })
  );
  const statsArr = Object.entries(filteredStats);

  // --- Pagination
  const totalPages = Math.ceil(statsArr.length / pageSize);
  const pagedStats = statsArr.slice((page - 1) * pageSize, page * pageSize);

  // --- Synthèse
  const totals = Object.fromEntries(
    statsArr.map(([key, val]) => [key, val.count || 0])
  );

  function renderTotals(totalsObj) {
    if (!totalsObj) return null;
    const items = Object.entries(totalsObj)
      .filter(([k, v]) => v > 0 && !["id", "unite_id"].includes(k));
    if (items.length === 0) {
      return <span className="italic text-gray-300">—</span>;
    }
    return (
      <div className="flex flex-wrap gap-1">
        {items.map(([k, v]) => (
          <span
            key={k}
            className="inline-flex items-center bg-gray-50 border border-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full text-xs shadow"
          >
            {formatLabel(k)}&nbsp;
            <span className="ml-1 font-bold">{Number.isFinite(v) ? v.toLocaleString("fr-FR") : v}</span>
          </span>
        ))}
      </div>
    );
  }

  // --- Export CSV/Excel
  function exportToCsv() {
    const rows = [
      ["Activité", "Groupe", "Nombre", "Totaux"]
    ];
    statsArr.forEach(([key, val]) => {
      const totalsFlat = Object.entries(val.totals)
        .filter(([k]) => !["id", "unite_id"].includes(k))
        .map(([k, v]) => `${formatLabel(k)}: ${v}`)
        .join(" | ");
      rows.push([
        GROUPS_LABELS[key] || formatLabel(key),
        capitalize(val.group),
        val.count,
        totalsFlat,
      ]);
    });
    const csv = rows.map(r => r.map(val =>
      '"' + String(val).replace(/"/g, '""') + '"'
    ).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stats_unite.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // --- UI
  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <h2 className="mb-6 text-2xl font-bold text-[#26354d]">Statistiques par Unité</h2>
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        {isAdminOrDir ? (
          <label className="text-base font-semibold">
            Unité&nbsp;
            <select
              value={selectedUnit}
              onChange={e => { setSelectedUnit(e.target.value); setPage(1); }}
              className="border rounded p-1 bg-blue-50"
            >
              <option value="">Sélectionnez une unité</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.nom}</option>
              ))}
            </select>
          </label>
        ) : (
          <span className="font-semibold">Unité : {user.unit?.nom || "Non défini"}</span>
        )}
        <label className="text-base font-semibold">
          Groupe&nbsp;
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="border rounded p-1 bg-blue-50"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </label>
        <label>
          Du&nbsp;
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="border rounded p-1"/>
        </label>
        <label>
          Au&nbsp;
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="border rounded p-1"/>
        </label>
        <button
          className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => { setStart(""); setEnd(""); }}
        >
          Réinitialiser
        </button>
        <input
          type="text"
          placeholder="Recherche rapide…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="ml-2 border rounded p-1 bg-white min-w-[160px]"
        />
        <button
          className="ml-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          onClick={exportToCsv}
        >
          Export CSV
        </button>
      </div>
      {loading && <div>Chargement…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Cards synthétiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(totals).map(([key, total]) => (
          <div
            key={key}
            className="rounded-2xl shadow bg-gradient-to-br from-[#224066] to-[#356bf6]/10 border border-blue-100 p-4 flex flex-col items-center"
            style={{
              boxShadow: "0 4px 18px 0 rgba(59, 130, 246, 0.09)",
              minHeight: 110
            }}
          >
            <div className="text-xs text-blue-800 font-semibold tracking-widest mb-1">
              {GROUPS_LABELS[key] || formatLabel(key)}
            </div>
            <div className="mt-1 text-3xl font-extrabold text-blue-700">
              {total}
            </div>
          </div>
        ))}
      </div>
      {/* Tableau détaillé */}
      {!loading && !error && (
        <>
          {pagedStats.length === 0 && (
            <div className="text-center text-gray-500">Aucune donnée à afficher.</div>
          )}
          <div className="bg-white shadow-2xl rounded-2xl p-2 md:p-6 border border-blue-100 mb-8 overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl">
              <thead>
                <tr>
                  <th className="px-6 py-4 bg-blue-50 text-left text-xs md:text-sm font-bold text-blue-900 uppercase sticky top-0 z-10">Activité</th>
                  <th className="px-6 py-4 bg-blue-50 text-left text-xs md:text-sm font-bold text-blue-900 uppercase sticky top-0 z-10">Groupe</th>
                  <th className="px-6 py-4 bg-blue-50 text-center text-xs md:text-sm font-bold text-blue-900 uppercase sticky top-0 z-10">Nombre</th>
                  <th className="px-6 py-4 bg-blue-50 text-left text-xs md:text-sm font-bold text-blue-900 uppercase sticky top-0 z-10">Totaux</th>
                </tr>
              </thead>
              <tbody>
                {pagedStats.map(([key, val]) => (
                  <tr
                    key={key}
                    className="hover:bg-blue-50/60 transition border-b last:border-b-0"
                  >
                    <td className="px-6 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {GROUPS_LABELS[key] || formatLabel(key)}
                    </td>
                    <td className="px-6 py-3 capitalize text-gray-700">
                      {capitalize(val.group)}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-block min-w-[36px] text-center px-2 py-1 rounded-full font-bold text-blue-700 bg-blue-100 shadow-sm">
                        {val.count}
                      </span>
                    </td>
                    <td className="px-6 py-3">{renderTotals(val.totals)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end items-center mt-4 gap-2">
                <button
                  className="px-3 py-1 rounded bg-blue-100 text-blue-800 font-bold disabled:opacity-40"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  &lt;
                </button>
                {[...Array(totalPages).keys()].map(n => (
                  <button
                    key={n}
                    className={`px-3 py-1 rounded font-bold ${page === n + 1 ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800"}`}
                    onClick={() => setPage(n + 1)}
                  >
                    {n + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 rounded bg-blue-100 text-blue-800 font-bold disabled:opacity-40"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
