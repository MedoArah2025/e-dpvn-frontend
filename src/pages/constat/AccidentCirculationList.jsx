import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AccidentCirculationList() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  // Récupération user & rôle admin
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = Array.isArray(user.roles) && user.roles.includes("admin");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/activities/constats/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(Array.isArray(res.data) ? res.data : res.data.results || []))
      .catch(() => setData([]));
  }, [token]);

  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/activities/constats/export/",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "accidents_circulation.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Erreur lors de l'export : " + (error.response?.statusText || "Erreur inconnue"));
    }
  };

  // Suppression sécurisée (seulement admin)
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet enregistrement ?")) return;
    try {
      await axios.delete(
        `http://localhost:8000/api/activities/constats/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) => prev.filter((obj) => obj.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression : " + (error.response?.statusText || "Erreur inconnue"));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Constats d'accidents de circulation</h2>
      <div className="mb-4 flex gap-2">
        <Link
          to="/circulation/constat/accident-circulation/add"
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          + Ajouter
        </Link>
        <button
          className="bg-green-600 text-white rounded px-4 py-2"
          onClick={handleExport}
        >
          Exporter Excel
        </button>
      </div>
      <div className="bg-white shadow rounded p-4 overflow-auto">
        <table className="min-w-full table-auto border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Homicide involontaire</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Blessés graves</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Blessés légers</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Dégâts matériels</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Victimes hommes</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Victimes femmes</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Victimes mineurs</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Cause de l'accident</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Profil route</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Véhicule/Engins</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Types routes</th>
              <th className="px-4 py-2 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((obj) => (
                <tr key={obj.id} className="hover:bg-gray-100 transition rounded-xl">
                  <td className="px-4 py-2">{obj.date}</td>
                  <td className="px-4 py-2">{obj.homicide_involontaire}</td>
                  <td className="px-4 py-2">{obj.blesses_graves}</td>
                  <td className="px-4 py-2">{obj.blesses_legers}</td>
                  <td className="px-4 py-2">{obj.degats_materiels}</td>
                  <td className="px-4 py-2">{obj.victime_hommes}</td>
                  <td className="px-4 py-2">{obj.victime_femmes}</td>
                  <td className="px-4 py-2">{obj.victime_mineurs}</td>
                  <td className="px-4 py-2">{obj.cause_accident || <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-2">{obj.profil_route || <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-2">{obj.vehicule_engins || <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-2">{obj.types_routes || <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <Link
                      to={`/circulation/constat/accident-circulation/${obj.id}/edit`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Modifier
                    </Link>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(obj.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={13} className="text-gray-400 text-center py-6">
                  Aucune donnée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
