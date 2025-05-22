import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function MiseADispositionSpjaForm() {
  const [form, setForm] = useState({
    date_mise: "",
    objet: "",
    nbre_personnes: 0,
    observation: "",
  });
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/spja/mises-a-disposition/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data))
        .catch(() => {});
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = id
      ? `http://localhost:8000/api/activities/spja/mises-a-disposition/${id}/`
      : `http://localhost:8000/api/activities/spja/mises-a-disposition/`;
    const method = id ? "put" : "post";
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => navigate("/spja/mises-a-disposition"))
      .catch(() => alert("Erreur lors de l'enregistrement"));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? "Modifier" : "Ajouter"} Mise à Disposition SPJA</h2>
      <div className="mb-4">
        <label>Date mise à disposition</label>
        <input
          type="date"
          name="date_mise"
          value={form.date_mise || ""}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Objet</label>
        <input
          type="text"
          name="objet"
          value={form.objet}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Nombre de personnes</label>
        <input
          type="number"
          name="nbre_personnes"
          value={form.nbre_personnes}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
          min="0"
        />
      </div>
      <div className="mb-4">
        <label>Observation</label>
        <textarea
          name="observation"
          value={form.observation}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <button type="submit" className="bg-fuchsia-600 text-white px-4 py-2 rounded">
        Enregistrer
      </button>
    </form>
  );
}
