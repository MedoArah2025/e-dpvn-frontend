import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PersonnesEnleveForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_mise: "",
    nbr_enlevees: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/judiciaire/enlevements/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data));
    }
  }, [id, token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "nbr_enlevees" ? parseInt(value, 10) : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const method = id ? "put" : "post";
    const url = id
      ? `http://localhost:8000/api/activities/judiciaire/enlevements/${id}/`
      : `http://localhost:8000/api/activities/judiciaire/enlevements/`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/judiciaire/personnes-enleve"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? "Modifier" : "Ajouter"} un enlèvement</h2>
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
        Nombre de personnes enlevées
        <input
          type="number"
          name="nbr_enlevees"
          className="block w-full border rounded px-3 py-2"
          value={form.nbr_enlevees}
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
          onClick={() => navigate("/judiciaire/personnes-enleve")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
