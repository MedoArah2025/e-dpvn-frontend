import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function AccidentCirculationForm() {
  const [form, setForm] = useState({
    date: "",
    homicide_involontaire: 0,
    blesses_graves: 0,
    blesses_legers: 0,
    degats_materiels: 0,
    victime_hommes: 0,
    victime_femmes: 0,
    victime_mineurs: 0,
    cause_accident: "",
    profil_route: "",
    vehicule_engins: "",
    types_routes: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/constats/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data))
        .catch(() => {});
    }
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = id
      ? `http://localhost:8000/api/activities/constats/${id}/`
      : "http://localhost:8000/api/activities/constats/";
    const method = id ? "put" : "post";
    axios[method](url, form, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => navigate("/circulation/constat/accident-circulation"))
      .catch(() => alert("Erreur lors de l'enregistrement"));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Modifier" : "Ajouter"} un constat d'accident de circulation
      </h2>
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
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>Homicide involontaire</label>
          <input
            type="number"
            name="homicide_involontaire"
            value={form.homicide_involontaire}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>Blessés graves</label>
          <input
            type="number"
            name="blesses_graves"
            value={form.blesses_graves}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>Blessés légers</label>
          <input
            type="number"
            name="blesses_legers"
            value={form.blesses_legers}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>Dégâts matériels</label>
          <input
            type="number"
            name="degats_materiels"
            value={form.degats_materiels}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label>Victimes hommes</label>
          <input
            type="number"
            name="victime_hommes"
            value={form.victime_hommes}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>Victimes femmes</label>
          <input
            type="number"
            name="victime_femmes"
            value={form.victime_femmes}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>Victimes mineurs</label>
          <input
            type="number"
            name="victime_mineurs"
            value={form.victime_mineurs}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <div className="mb-4">
        <label>Cause de l'accident</label>
        <textarea
          name="cause_accident"
          value={form.cause_accident}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label>Profil route</label>
          <input
            type="text"
            name="profil_route"
            value={form.profil_route}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>Véhicule/Engins</label>
          <input
            type="text"
            name="vehicule_engins"
            value={form.vehicule_engins}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>Types routes</label>
          <input
            type="text"
            name="types_routes"
            value={form.types_routes}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
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
