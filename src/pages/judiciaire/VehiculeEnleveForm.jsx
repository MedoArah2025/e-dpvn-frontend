import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VehiculeEnleveForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_mise: "",
    nbr_enleves: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/judiciaire/vehicules-enleves/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data));
    }
  }, [id, token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "nbr_enleves" ? parseInt(value, 10) : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const method = id ? "put" : "post";
    const url = id
      ? `http://localhost:8000/api/activities/judiciaire/vehicules-enleves/${id}/`
      : `http://localhost:8000/api/activities/judiciaire/vehicules-enleves/`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/judiciaire/vehicule-enleve"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? "Modifier" : "Ajouter"} un véhicule enlevé</h2>
      <label className="block mb-2 font-semibold">
        Date de l’enlèvement
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
        Nombre de véhicules enlevés
        <input
          type="number"
          name="nbr_enleves"
          className="block w-full border rounded px-3 py-2"
          value={form.nbr_enleves}
          onChange={handleChange}
          min="0"
          required
        />
      </label>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => navigate("/judiciaire/vehicule-enleve")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
