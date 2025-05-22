import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function DeferementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_interpellation: "",
    categorie_infraction: "",
    nombre_deferement: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/judiciaire/deferement/${id}/`, {
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
    e.preventDefault();
    const method = id ? "put" : "post";
    const url = id
      ? `http://localhost:8000/api/judiciaire/deferement/${id}/`
      : `http://localhost:8000/api/judiciaire/deferement/`;
    axios[method](
      url,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => navigate("/judiciaire/deferement"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? "Modifier" : "Ajouter"} Déférement</h2>
      <label className="block mb-2 font-semibold">
        Date d’interpellation
        <input type="date" name="date_interpellation" className="block w-full border rounded px-3 py-2" value={form.date_interpellation} onChange={handleChange} required />
      </label>
      <label className="block mb-2 font-semibold">
        Catégorie d’infraction
        <input type="text" name="categorie_infraction" className="block w-full border rounded px-3 py-2" value={form.categorie_infraction} onChange={handleChange} required />
      </label>
      <label className="block mb-2 font-semibold">
        Nombre Déférement
        <input type="number" name="nombre_deferement" className="block w-full border rounded px-3 py-2" value={form.nombre_deferement} onChange={handleChange} required />
      </label>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
        <button type="button" onClick={() => navigate("/judiciaire/deferement")} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>
      </div>
    </form>
  );
}
