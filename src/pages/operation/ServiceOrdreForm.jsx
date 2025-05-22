import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ServiceOrdreForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_operation: "",
    lieux_service: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/operations/services-ordre/${id}/`, {
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
      ? `http://localhost:8000/api/activities/operations/services-ordre/${id}/`
      : `http://localhost:8000/api/activities/operations/services-ordre/`;
    axios[method](
      url,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => navigate("/operation/service-ordre"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? "Modifier" : "Ajouter"} Service d’Ordre</h2>
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
        Nombre de lieux de service
        <input
          type="number"
          name="lieux_service"
          className="block w-full border rounded px-3 py-2"
          value={form.lieux_service}
          onChange={handleChange}
          required
        />
      </label>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => navigate("/operation/service-ordre")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
