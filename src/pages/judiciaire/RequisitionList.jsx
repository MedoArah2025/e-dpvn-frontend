import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RequisitionList() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  // Récupération des rôles pour gérer le bouton supprimer
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = Array.isArray(user.roles) && user.roles.includes("admin");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/activities/judiciaire/requisitions/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : res.data.results || []);
      })
      .catch(() => setData([]));
  }, [token]);

  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/activities/judiciaire/requisitions/export/",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "requisitions.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Erreur lors de l'export : " + (error.response?.statusText || "Erreur inconnue"));
    }
  };

  // Suppression sécurisée pour admin uniquement
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette réquisition ?")) return;
    try {
      await axios.delete(
        `http://localhost:8000/api/activities/judiciaire/requisitions/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) => prev.filter((obj) => obj.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression : " + (error.response?.statusText || "Erreur inconnue"));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Réquisitions</h2>
      <div className="mb-4 flex gap-2">
        <Link
          to="/judiciaire/requisition/add"
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Date de mise
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Adresse à
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Statut
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((obj) => (
                <tr key={obj.id} className="hover:bg-gray-100 transition rounded-xl">
                  <td className="px-4 py-2">{obj.date_mise}</td>
                  <td className="px-4 py-2">{obj.adresse_a || <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-2">{obj.status || <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <Link
                      to={`/judiciaire/requisition/${obj.id}/edit`}
                      className="text-blue-600 hover:underline font-semibold"
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
                <td colSpan={4} className="text-gray-400 text-center py-6">
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
