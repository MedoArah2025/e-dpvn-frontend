import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const typeOptions = [
  "Enfant égaré",
  "Adulte égaré",
  "Véhicule",
  "Motos",
  "Cellulaire",
  "Tricycle",
];

const statutOptions = ["Retrouvé", "En cours"];

export default function AutresDeclarationsForm() {
  const [form, setForm] = useState({
    type_declaration: "",
    date_declaration: "",
    statut: "En cours",
    quartier: "",
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
        "http://localhost:8000/api/activities/administratif/autres-declarations/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => navigate("/administratif/autres-declarations"))
      .catch(() => alert("Erreur lors de l'ajout"));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ajouter autre déclaration</h2>
      <div className="mb-4">
        <label>Type de déclaration</label>
        <select
          name="type_declaration"
          value={form.type_declaration}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Sélectionner</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label>Date de déclaration</label>
        <input
          type="date"
          name="date_declaration"
          value={form.date_declaration}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Statut</label>
        <select
          name="statut"
          value={form.statut}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        >
          {statutOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label>Quartier</label>
        <input
          type="text"
          name="quartier"
          value={form.quartier}
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
