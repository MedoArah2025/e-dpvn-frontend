import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AmendeForfaitaireForm() {
  const [form, setForm] = useState({
    date: "",
    montant: 0,
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
        "http://localhost:8000/api/activities/administratif/amendes-forfaitaires/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => navigate("/administratif/amende-forfaitaire"))
      .catch(() => alert("Erreur lors de l'ajout"));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ajouter une amende forfaitaire</h2>
      <div className="mb-4">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Montant (FCFA)</label>
        <input
          type="number"
          name="montant"
          value={form.montant}
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
