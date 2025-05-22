import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function NoyadeList() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  // Contrôle admin
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = Array.isArray(user.roles) && user.roles.includes("admin");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/activities/judiciaire/noyades/", {
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
        "http://localhost:8000/api/activities/judiciaire/noyades/export/",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "noyades.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Erreur lors de l'export : " + (error.response?.statusText || "Erreur inconnue"));
    }
  };

  // Suppression sécurisée
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet enregistrement ?")) return;
    try {
      await axios.delete(
        `http://localhost:8000/api/activities/judiciaire/noyades/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) => prev.filter((obj) => obj.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression : " + (error.response?.statusText || "Erreur inconnue"));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Noyades</h2>
      <div className="mb-4 flex gap-2">
        <Link
          to="/judiciaire/noyade/add"
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
                Date de la noyade
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Hommes
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Femmes
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Mineurs
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Faits
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
                  <td className="px-4 py-2">{obj.date_noyade}</td>
                  <td className="px-4 py-2 text-center">{obj.hommes}</td>
                  <td className="px-4 py-2 text-center">{obj.femmes}</td>
                  <td className="px-4 py-2 text-center">{obj.mineurs}</td>
                  <td className="px-4 py-2">{obj.faits || <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <Link
                      to={`/judiciaire/noyade/${obj.id}/edit`}
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
                <td colSpan={6} className="text-gray-400 text-center py-6">
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
