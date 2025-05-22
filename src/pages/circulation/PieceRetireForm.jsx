import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PieceRetireForm() {
  const [form, setForm] = useState({
    date_retrait: "",
    motos: 0,
    vehicules: 0,
    tricycles: 0,
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
        "http://localhost:8000/api/activities/circulation/pieces-retirees/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => navigate("/circulation/piece-retire"))
      .catch(() => alert("Erreur lors de l'ajout"));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ajouter Pièce Retirée</h2>
      <div className="mb-4">
        <label>Date retrait</label>
        <input
          type="date"
          name="date_retrait"
          value={form.date_retrait}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Motos</label>
        <input
          type="number"
          name="motos"
          value={form.motos}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Véhicules</label>
        <input
          type="number"
          name="vehicules"
          value={form.vehicules}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Tricycles</label>
        <input
          type="number"
          name="tricycles"
          value={form.tricycles}
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
