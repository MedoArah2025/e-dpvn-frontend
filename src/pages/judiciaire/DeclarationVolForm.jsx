import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VOL_CHOICES = [
  { value: "Vol simple", label: "Vol simple" },
  { value: "Vol aggravé", label: "Vol aggravé" },
  { value: "Vol à l'arraché", label: "Vol à l'arraché" },
  { value: "Agression suivie de vol", label: "Agression suivie de vol" },
];

export default function DeclarationVolForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_plainte: "",
    type_vol: "",
    nombre_vol: 0,
    quartier: "",
  });
  const [quartiers, setQuartiers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Chargement des quartiers si besoin
    axios
      .get("http://localhost:8000/api/units/quartiers/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setQuartiers(res.data))
      .catch(() => setQuartiers([]));

    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/judiciaire/declaration-vols/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data));
    }
  }, [id, token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "nombre_vol" ? parseInt(value, 10) : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const method = id ? "put" : "post";
    const url = id
      ? `http://localhost:8000/api/activities/judiciaire/declaration-vols/${id}/`
      : `http://localhost:8000/api/activities/judiciaire/declaration-vols/`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/judiciaire/declaration-vol"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? "Modifier" : "Ajouter"} une déclaration de vol</h2>
      <label className="block mb-2 font-semibold">
        Date de la plainte
        <input
          type="date"
          name="date_plainte"
          className="block w-full border rounded px-3 py-2"
          value={form.date_plainte}
          onChange={handleChange}
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Type de vol
        <select
          name="type_vol"
          className="block w-full border rounded px-3 py-2"
          value={form.type_vol}
          onChange={handleChange}
          required
        >
          <option value="">—</option>
          {VOL_CHOICES.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
      <label className="block mb-2 font-semibold">
        Nombre de vols
        <input
          type="number"
          name="nombre_vol"
          className="block w-full border rounded px-3 py-2"
          value={form.nombre_vol}
          onChange={handleChange}
          min="0"
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Quartier
        <select
          name="quartier"
          className="block w-full border rounded px-3 py-2"
          value={form.quartier || ""}
          onChange={handleChange}
        >
          <option value="">—</option>
          {quartiers.map((q) => (
            <option key={q.id} value={q.nom}>{q.nom}</option>
          ))}
        </select>
      </label>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => navigate("/judiciaire/declaration-vol")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
