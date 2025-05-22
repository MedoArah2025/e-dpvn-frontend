import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PatrouilleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_operation: "",
    personne_interpellees: 0,
    mendiants_interpelles: 0,
    charettes_pouspous: 0,
    objet_saisie: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/operations/patrouilles/${id}/`, {
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
      ? `http://localhost:8000/api/activities/operations/patrouilles/${id}/`
      : `http://localhost:8000/api/activities/operations/patrouilles/`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/operation/patrouille"));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">
        {id ? "Modifier" : "Ajouter"} Patrouille
      </h2>
      <label className="block mb-2 font-semibold">
        Date d’opération
        <input
          type="date"
          name="date_operation"
          className="block w-full border rounded px-3 py-2"
          value={form.date_operation}
          onChange={handleChange}
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Personnes interpellées
        <input
          type="number"
          name="personne_interpellees"
          className="block w-full border rounded px-3 py-2"
          value={form.personne_interpellees}
          onChange={handleChange}
          min="0"
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Mendiants interpellés
        <input
          type="number"
          name="mendiants_interpelles"
          className="block w-full border rounded px-3 py-2"
          value={form.mendiants_interpelles}
          onChange={handleChange}
          min="0"
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Charrettes/Pouspous
        <input
          type="number"
          name="charettes_pouspous"
          className="block w-full border rounded px-3 py-2"
          value={form.charettes_pouspous}
          onChange={handleChange}
          min="0"
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Objet saisi
        <select
          name="objet_saisie"
          className="block w-full border rounded px-3 py-2"
          value={form.objet_saisie || ""}
          onChange={handleChange}
        >
          <option value="">Aucun</option>
          <option value="Drogue">Drogue</option>
          <option value="Arme Blanche">Arme Blanche</option>
          <option value="Autres">Autres</option>
        </select>
      </label>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => navigate("/operation/patrouille")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
