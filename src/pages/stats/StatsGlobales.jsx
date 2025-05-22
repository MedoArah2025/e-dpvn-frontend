import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// Catégories, périodes, labels, groupes
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
const PERIODS = [
  { value: "daily", label: "Quotidienne" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuelle" },
  { value: "quarterly", label: "Trimestrielle" },
  { value: "yearly", label: "Annuelle" }
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
const GROUPS_CATEGORIES = {
  autres_declarations: "administratif",
  procurations: "administratif",
  declarations_perte: "administratif",
  certificats_residence: "administratif",
  cin: "administratif",
  amendes_forfaitaires: "administratif",
  engins_immobilises: "circulation",
  pieces_retirees: "circulation",
  vitres_teintees: "circulation",
  controles_routiers: "circulation",
  accidents_circulation: "constat",
  slct_cto: "disposition",
  dpj: "disposition",
  ocr_im: "disposition",
  douane: "disposition",
  dst: "disposition",
  dpmf: "disposition",
  pavillon_e: "disposition",
  soniloga: "disposition",
  positionnements: "operation",
  services_ordre: "operation",
  patrouilles: "operation",
  coups_poing: "operation",
  raffles: "operation",
  descentes: "operation",
  interpellations: "judiciaire",
  gav: "judiciaire",
  deferements: "judiciaire",
  plaintes: "judiciaire",
  declaration_vols: "judiciaire",
  infractions: "judiciaire",
  saisies_drogue: "judiciaire",
  autres_saisies: "judiciaire",
  requisitions: "judiciaire",
  incendies: "judiciaire",
  noyades: "judiciaire",
  decouvertes_cadavre: "judiciaire",
  personnes_enlevees: "judiciaire",
  vehicules_enleves: "judiciaire",
  effectif_rh: "rh",
};
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function formatLabel(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}
function escapeCsv(val) {
  if (typeof val === "string" && (val.includes(";") || val.includes('"') || val.includes("\n"))) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}
function downloadCSV(data, filename = "stats.csv") {
  const csv = [Object.keys(data[0]).join(";")].concat(
    data.map(row =>
      Object.values(row)
        .map(escapeCsv)
        .join(";")
    )
  ).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export default function StatsGlobales() {
  const token = localStorage.getItem("token");
  const [period, setPeriod] = useState("monthly");
  const [category, setCategory] = useState("all");
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Pagination & Search ---
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10); // Modifie si tu veux plus ou moins de lignes
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPage(1);
  }, [category, period, search]);

  // Fetch stats globales (API flat, somme de toutes les unités)
  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = `${API_BASE}/statistics/global/flat/?period=${period}`;
    axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStats(res.data.stats || {}))
      .catch(err => setError(err.response?.data?.detail || "Impossible de charger les stats globales"))
      .finally(() => setLoading(false));
  }, [period, token]);

  // Filtrage par catégorie
  const filteredStats = category === "all"
    ? stats
    : Object.fromEntries(
        Object.entries(stats).filter(([key, val]) =>
          (GROUPS_CATEGORIES[key] === category)
        )
      );

  // Recherche instantanée
  const searchLC = search.trim().toLowerCase();
  const visibleStats = !searchLC
    ? filteredStats
    : Object.fromEntries(
        Object.entries(filteredStats).filter(([key, val]) => {
          const label = GROUPS_LABELS[key] || formatLabel(key);
          return label.toLowerCase().includes(searchLC);
        })
      );

  // Pagination
  const dataArr = Object.entries(visibleStats);
  const pagedArr = dataArr.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(dataArr.length / rowsPerPage);

  // Export CSV (page courante filtrée)
  function handleExport() {
    if (!pagedArr.length) return;
    const csvData = pagedArr.map(([key, val]) => ({
      Activité: GROUPS_LABELS[key] || formatLabel(key),
      Groupe: capitalize(GROUPS_CATEGORIES[key] || ""),
      Nombre: val.count,
      Totaux: Object.entries(val.totals)
        .filter(([k]) => !["id", "unite_id"].includes(k))
        .map(([k, v]) => `${formatLabel(k)}: ${v}`)
        .join(", ")
    }));
    downloadCSV(csvData, "stats-globales.csv");
  }

  // Affichage synthétique des totaux numériques façon "chips"
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

  // Synthèse : juste le total par activité (cards)
  const totals = Object.fromEntries(
    Object.entries(visibleStats).map(([key, val]) => [
      key,
      val.count || 0
    ])
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <h2 className="mb-6 text-2xl font-bold text-[#223144]">Statistiques Générales (Toutes Unités)</h2>
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <label className="text-base font-semibold">
          Période&nbsp;
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="border rounded p-1 bg-blue-50"
          >
            {PERIODS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </label>
        <label className="text-base font-semibold">
          Groupe&nbsp;
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border rounded p-1 bg-blue-50"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </label>
        <input
          className="ml-auto border px-2 py-1 rounded bg-white shadow-sm"
          placeholder="Recherche rapide…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ minWidth: 180 }}
        />
        <button
          className="ml-2 bg-green-600 text-white px-3 py-1 rounded font-semibold shadow-sm"
          onClick={handleExport}
        >
          Export CSV
        </button>
      </div>

      {loading && <div>Chargement…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Cartes synthétiques */}
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
            <div className="mt-2 text-xs px-3 py-0.5 bg-blue-100 text-blue-700 rounded-xl capitalize shadow-sm tracking-wide">
              {capitalize(GROUPS_CATEGORIES[key] || "")}
            </div>
          </div>
        ))}
      </div>

      {/* Tableau détaillé MUI-like */}
      {!loading && !error && (
        <>
          {pagedArr.length === 0 && (
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
                {pagedArr.map(([key, val]) => (
                  <tr
                    key={key}
                    className="hover:bg-blue-50/60 transition border-b last:border-b-0"
                  >
                    <td className="px-6 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {GROUPS_LABELS[key] || formatLabel(key)}
                    </td>
                    <td className="px-6 py-3 capitalize text-gray-700">
                      {capitalize(GROUPS_CATEGORIES[key] || "")}
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
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-8">
              <button
                disabled={page === 1}
                className="px-2 py-1 rounded border bg-blue-50 disabled:opacity-50"
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >&lt;</button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded border ${page === i + 1 ? "bg-blue-600 text-white font-bold" : "bg-blue-50"}`}
                >{i + 1}</button>
              ))}
              <button
                disabled={page === totalPages}
                className="px-2 py-1 rounded border bg-blue-50 disabled:opacity-50"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >&gt;</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
