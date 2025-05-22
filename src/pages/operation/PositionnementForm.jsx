import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PositionnementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_operation: "",
    lieux_position: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/operations/positionnements/${id}/`, {
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
      ? `http://localhost:8000/api/activities/operations/positionnements/${id}/`
      : `http://localhost:8000/api/activities/operations/positionnements/`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/operation/positionnement"));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">
        {id ? "Modifier" : "Ajouter"} Positionnement
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
        Nombre de lieux de position
        <input
          type="number"
          name="lieux_position"
          className="block w-full border rounded px-3 py-2"
          value={form.lieux_position}
          onChange={handleChange}
          min="0"
          required
        />
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
          onClick={() => navigate("/operation/positionnement")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
