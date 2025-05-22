import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MiseDispositionOcritForm() {
  const [form, setForm] = useState({
    date_mise: "",
    hommes: 0,
    femmes: 0,
    mineurs: 0,
    cannabis: 0,
    amphetamines: 0,
    tramadol: 0,
    diazepam: 0,
    exol: 0,
    crack: 0,
    cocaine: 0,
    heroine: 0,
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
        "http://localhost:8000/api/activities/dispositions/ocr-im/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => navigate("/dispositions/ocrit-im"))
      .catch((err) => alert("Erreur lors de l'ajout"));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ajouter Mise à disposition OCRITIS</h2>
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
        <label>Hommes</label>
        <input
          type="number"
          name="hommes"
          value={form.hommes}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Femmes</label>
        <input
          type="number"
          name="femmes"
          value={form.femmes}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Mineurs</label>
        <input
          type="number"
          name="mineurs"
          value={form.mineurs}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      {/* Les champs pour les produits */}
      <div className="mb-4">
        <label>Cannabis</label>
        <input
          type="number"
          name="cannabis"
          value={form.cannabis}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Amphetamines</label>
        <input
          type="number"
          name="amphetamines"
          value={form.amphetamines}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Tramadol</label>
        <input
          type="number"
          name="tramadol"
          value={form.tramadol}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Diazepam</label>
        <input
          type="number"
          name="diazepam"
          value={form.diazepam}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Exol</label>
        <input
          type="number"
          name="exol"
          value={form.exol}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Crack</label>
        <input
          type="number"
          name="crack"
          value={form.crack}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Cocaine</label>
        <input
          type="number"
          name="cocaine"
          value={form.cocaine}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Heroine</label>
        <input
          type="number"
          name="heroine"
          value={form.heroine}
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
