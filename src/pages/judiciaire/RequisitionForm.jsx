import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ADRESSE_A = [
  "Airtel", "Zamani", "Moov", "NigerTelecom", "Médecin"
];
const STATUS = [
  "Encours", "Reçu"
];

export default function RequisitionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_mise: "",
    adresse_a: "",
    status: "Encours",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/judiciaire/requisitions/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data));
    }
  }, [id, token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const method = id ? "put" : "post";
    const url = id
      ? `http://localhost:8000/api/activities/judiciaire/requisitions/${id}/`
      : `http://localhost:8000/api/activities/judiciaire/requisitions/`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/judiciaire/requisition"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? "Modifier" : "Ajouter"} une réquisition</h2>
      <label className="block mb-2 font-semibold">
        Date de mise
        <input
          type="date"
          name="date_mise"
          className="block w-full border rounded px-3 py-2"
          value={form.date_mise}
          onChange={handleChange}
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Adresse à
        <select
          name="adresse_a"
          className="block w-full border rounded px-3 py-2"
          value={form.adresse_a || ""}
          onChange={handleChange}
        >
          <option value="">—</option>
          {ADRESSE_A.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
      <label className="block mb-2 font-semibold">
        Statut
        <select
          name="status"
          className="block w-full border rounded px-3 py-2"
          value={form.status || ""}
          onChange={handleChange}
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => navigate("/judiciaire/requisition")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
