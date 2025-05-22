import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function EffectifRHList() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/activities/rh/effectifs/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : res.data.results || []);
      })
      .catch(() => setData([]));
  }, [token]);

  // Fonction d'export Excel
  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/activities/rh/effectifs/export/",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "effectif_rh.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Erreur lors de l'export : " + (error.response?.statusText || "Erreur inconnue"));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Effectif RH</h2>
      <div className="mb-4 flex gap-2">
        <Link to="/rh/effectifs/add" className="bg-blue-600 text-white rounded px-4 py-2">
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
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th>Date rapport</th>
              <th>CP Hommes</th>
              <th>CP Femmes</th>
              <th>OP Hommes</th>
              <th>OP Femmes</th>
              <th>IP Hommes</th>
              <th>IP Femmes</th>
              <th>GPX Hommes</th>
              <th>GPX Femmes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((obj) => (
                <tr key={obj.id}>
                  <td>{obj.date_rapport}</td>
                  <td>{obj.cp_hommes}</td>
                  <td>{obj.cp_femmes}</td>
                  <td>{obj.op_hommes}</td>
                  <td>{obj.op_femmes}</td>
                  <td>{obj.ip_hommes}</td>
                  <td>{obj.ip_femmes}</td>
                  <td>{obj.gpx_hommes}</td>
                  <td>{obj.gpx_femmes}</td>
                  <td>
                    <Link
                      to={`/rh/effectifs/${obj.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-gray-400 text-center py-4">
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
