import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ServiceOrdreList() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = Array.isArray(user.roles) && user.roles.includes("admin");

  // Classes réutilisables
  const cellClass = "px-4 py-2 text-sm";
  const thClass = "px-4 py-2 text-left text-gray-700 font-semibold";
  const btnClass = "rounded px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-300";
  const addBtn = `${btnClass} bg-blue-600 hover:bg-blue-700 text-white`;
  const exportBtn = `${btnClass} bg-green-600 hover:bg-green-700 text-white`;
  const deleteBtn = "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded ml-2";

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/activities/operations/services-ordre/", {
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
        "http://localhost:8000/api/activities/operations/services-ordre/export/",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "services_ordre.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Erreur lors de l'export : " + (error.response?.statusText || "Erreur inconnue"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression de ce service d’ordre ?")) return;
    try {
      await axios.delete(
        `http://localhost:8000/api/activities/operations/services-ordre/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) => prev.filter((obj) => obj.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression : " + (error.response?.statusText || "Erreur inconnue"));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Services d’Ordre</h2>
      <div className="mb-4 flex gap-2">
        <Link to="/operation/service-ordre/add" className={addBtn}>
          + Ajouter
        </Link>
        <button className={exportBtn} onClick={handleExport}>
          Exporter Excel
        </button>
      </div>
      <div className="bg-white shadow rounded p-4 overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className={thClass}>Date d’opération</th>
              <th className={thClass}>Nombre de lieux de service</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((obj) => (
                <tr key={obj.id} className="hover:bg-gray-100 transition">
                  <td className={cellClass}>{obj.date_operation}</td>
                  <td className={cellClass}>{obj.lieux_service}</td>
                  <td className={cellClass + " flex items-center"}>
                    <Link
                      to={`/operation/service-ordre/${obj.id}/edit`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Modifier
                    </Link>
                    {isAdmin && (
                      <button
                        className={deleteBtn}
                        onClick={() => handleDelete(obj.id)}
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-gray-400 text-center py-4">
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
