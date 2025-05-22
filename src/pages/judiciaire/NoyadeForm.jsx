import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NoyadeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_noyade: "",
    hommes: 0,
    femmes: 0,
    mineurs: 0,
    faits: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/judiciaire/noyades/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data));
    }
  }, [id, token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name === "hommes" || name === "femmes" || name === "mineurs"
          ? parseInt(value, 10)
          : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const method = id ? "put" : "post";
    const url = id
      ? `http://localhost:8000/api/activities/judiciaire/noyades/${id}/`
      : `http://localhost:8000/api/activities/judiciaire/noyades/`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/judiciaire/noyade"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? "Modifier" : "Ajouter"} une noyade</h2>
      <label className="block mb-2 font-semibold">
        Date de la noyade
        <input
          type="date"
          name="date_noyade"
          className="block w-full border rounded px-3 py-2"
          value={form.date_noyade}
          onChange={handleChange}
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Nombre d'hommes
        <input
          type="number"
          name="hommes"
          className="block w-full border rounded px-3 py-2"
          value={form.hommes}
          onChange={handleChange}
          min="0"
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Nombre de femmes
        <input
          type="number"
          name="femmes"
          className="block w-full border rounded px-3 py-2"
          value={form.femmes}
          onChange={handleChange}
          min="0"
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Nombre de mineurs
        <input
          type="number"
          name="mineurs"
          className="block w-full border rounded px-3 py-2"
          value={form.mineurs}
          onChange={handleChange}
          min="0"
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Faits
        <textarea
          name="faits"
          className="block w-full border rounded px-3 py-2"
          value={form.faits}
          onChange={handleChange}
          rows={3}
        />
      </label>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => navigate("/judiciaire/noyade")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
