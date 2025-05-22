import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const INFRACTION_CHOICES = [
  // Liste simple à adapter (reprends celle de ton backend si tu veux la full)
  "Vols (tous genre)", "Vol aggravé", "Vol de compteur", "Vol de moto", "Vol à l'arraché",
  "Vol de véhicules", "Vol de bétail", "Vol de cellulaires", "Complicité de vol", "Recel",
  "Abus de confiance", "Abus de confiance par salarié", "Escroquerie", "Escroquerie par un moyen de communication",
  "Dommage aux animaux", "Destruction et dégradation des biens", "Incendie volontaire", "Larcins et filouterie",
  "Jeux de hasard", "Saisie illégale", "Détournement des deniers publics",
  "Assassinat", "Meurtre", "Homicide involontaire", "Infanticide", "Avortement", "Viol", "Tentative de viol",
  "Enlèvement et séquestration", "Agression", "Mise en danger de la vie d'autrui", "Rixes et bagarres",
  "Injures publiques", "Injure et voie de fait", "Injure menace et voie de fait", "Chantage", "Violence conjugale",
  "Diffamation", "Dénonciation calomnieuse", "Proxénétisme", "Harcèlement sexuel", "Outrage à un agent",
  "Faux et usage de faux", "Usurpation de titre", "Atteintes à la sûreté de l'État", "Rébellion",
  "Association de malfaiteurs", "Refus d'obtempérer", "Découverte de cadavre",
];

export default function PersonnesInterpelleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_interpellation: "",
    categorie_infraction: "",
    nombre_pers_interp: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/judiciaire/interpellations/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data));
    }
  }, [id, token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name.includes("nombre")
        ? parseInt(value, 10)
        : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const method = id ? "put" : "post";
    const url = id
      ? `http://localhost:8000/api/activities/judiciaire/interpellations/${id}/`
      : `http://localhost:8000/api/activities/judiciaire/interpellations/`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/judiciaire/personnes-interpelle"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? "Modifier" : "Ajouter"} une interpellation</h2>
      <label className="block mb-2 font-semibold">
        Date d’interpellation
        <input
          type="date"
          name="date_interpellation"
          className="block w-full border rounded px-3 py-2"
          value={form.date_interpellation}
          onChange={handleChange}
          required
        />
      </label>
      <label className="block mb-2 font-semibold">
        Catégorie d’infraction
        <select
          name="categorie_infraction"
          className="block w-full border rounded px-3 py-2"
          value={form.categorie_infraction}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionner</option>
          {INFRACTION_CHOICES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="block mb-2 font-semibold">
        Nombre de personnes interpellées
        <input
          type="number"
          name="nombre_pers_interp"
          className="block w-full border rounded px-3 py-2"
          value={form.nombre_pers_interp}
          onChange={handleChange}
          min="0"
          required
        />
      </label>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => navigate("/judiciaire/personnes-interpelle")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
