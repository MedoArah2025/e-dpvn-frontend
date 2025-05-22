import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CAUSES = [
  "Incendie volontaire",
  "Incendie involontaire"
];

export default function IncendieForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_signalement: "",
    cause_incendie: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/judiciaire/incendies/${id}/`, {
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
      ? `http://localhost:8000/api/activities/judiciaire/incendies/${id}/`
      : `http://localhost:8000/api/activities/judiciaire/incendies/`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/judiciaire/incendie"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? "Modifier" : "Ajouter"} un incendie</h2>
      <label className="block mb-2 font-semibold">
        Date du signalement
        <input
          type="date"
          name="date_signalement"
          className="block w-full border rounded px-3 py-2"
          value={form.date_signalement}
          onChange={handleChange}
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Cause de l’incendie
        <select
          name="cause_incendie"
          className="block w-full border rounded px-3 py-2"
          value={form.cause_incendie || ""}
          onChange={handleChange}
        >
          <option value="">—</option>
          {CAUSES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => navigate("/judiciaire/incendie")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
