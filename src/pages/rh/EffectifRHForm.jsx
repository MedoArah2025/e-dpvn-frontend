import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EffectifRHForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_rapport: "",
    cp_hommes: 0,
    cp_femmes: 0,
    op_hommes: 0,
    op_femmes: 0,
    ip_hommes: 0,
    ip_femmes: 0,
    gpx_hommes: 0,
    gpx_femmes: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/rh/effectifs/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data));
    }
  }, [id, token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault(); // Important !
    const method = id ? "put" : "post";
    const url = id
      ? `http://localhost:8000/api/activities/rh/effectifs/${id}/`
      : `http://localhost:8000/api/activities/rh/effectifs/`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/rh/effectifs"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? "Modifier" : "Ajouter"} Effectif RH</h2>
      <label className="block mb-2 font-semibold">
        Date du rapport
        <input type="date" name="date_rapport" className="block w-full border rounded px-3 py-2" value={form.date_rapport} onChange={handleChange} required />
      </label>
      {[
        ["cp_hommes", "CP Hommes"],
        ["cp_femmes", "CP Femmes"],
        ["op_hommes", "OP Hommes"],
        ["op_femmes", "OP Femmes"],
        ["ip_hommes", "IP Hommes"],
        ["ip_femmes", "IP Femmes"],
        ["gpx_hommes", "GPX Hommes"],
        ["gpx_femmes", "GPX Femmes"]
      ].map(([key, label]) => (
        <label className="block mb-2 font-semibold" key={key}>
          {label}
          <input
            type="number"
            name={key}
            className="block w-full border rounded px-3 py-2"
            value={form[key]}
            onChange={handleChange}
            required
          />
        </label>
      ))}
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
        <button type="button" onClick={() => navigate("/rh/effectifs")} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>
        <button type="button" onClick={() => navigate("/")} className="bg-indigo-400 text-white px-4 py-2 rounded">Retour Tableau de bord</button>
      </div>
    </form>
  );
}
