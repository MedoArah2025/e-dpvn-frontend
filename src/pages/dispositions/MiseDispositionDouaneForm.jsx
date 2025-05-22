import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MiseDispositionDouaneForm() {
  const [form, setForm] = useState({
    date_mise: "",
    quantite_marchandise: "",
    essence: 0,
    gazoil: 0,
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8000/api/activities/dispositions/douane/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => navigate("/dispositions/douane"))
      .catch((err) => alert("Erreur lors de l'ajout"));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ajouter Mise à disposition Douane</h2>
      <div className="mb-4">
        <label>Date mise</label>
        <input
          type="date"
          name="date_mise"
          value={form.date_mise}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Quantité Marchandise</label>
        <input
          type="text"
          name="quantite_marchandise"
          value={form.quantite_marchandise}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Essence</label>
        <input
          type="number"
          name="essence"
          value={form.essence}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Gazoil</label>
        <input
          type="number"
          name="gazoil"
          value={form.gazoil}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Enregistrer
      </button>
    </form>
  );
}
