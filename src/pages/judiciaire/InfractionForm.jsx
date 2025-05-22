import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Remplir avec tes quartiers (en prod, récupère dynamiquement depuis l’API)
const [quartiers, setQuartiers] = []; // sera chargé dynamiquement

const INFRACTION_CHOICES = [
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

export default function InfractionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_infraction: "",
    categorie_infraction: "",
    quartier: "",
    victime_homme: 0,
    victime_femme: 0,
    victime_mineur: 0,
    mise_cause: 0,
    nationaux: 0,
    etrangers: 0,
    refugies: 0,
    immigres: 0,
  });
  const [quartiers, setQuartiers] = useState([]);
  const token = localStorage.getItem("token");

  // Charger la liste des quartiers au chargement du form
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/units/quartiers/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setQuartiers(res.data.results || res.data))
      .catch(() => setQuartiers([]));
  }, [token]);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/judiciaire/infractions/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data));
    }
  }, [id, token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name.includes("victime") ||
        name === "mise_cause" ||
        name === "nationaux" ||
        name === "etrangers" ||
        name === "refugies" ||
        name === "immigres"
        ? parseInt(value, 10)
        : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const method = id ? "put" : "post";
    const url = id
      ? `http://localhost:8000/api/activities/judiciaire/infractions/${id}/`
      : `http://localhost:8000/api/activities/judiciaire/infractions/`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/judiciaire/infraction"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Modifier" : "Ajouter"} une infraction
      </h2>
      <label className="block mb-2 font-semibold">
        Date d’infraction
        <input
          type="date"
          name="date_infraction"
          className="block w-full border rounded px-3 py-2"
          value={form.date_infraction}
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
        Quartier
        <select
          name="quartier"
          className="block w-full border rounded px-3 py-2"
          value={form.quartier || ""}
          onChange={handleChange}
        >
          <option value="">Aucun</option>
          {quartiers.map((q) => (
            <option key={q.id} value={q.id}>{q.nom}</option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block mb-2 font-semibold">
          Victimes Hommes
          <input
            type="number"
            name="victime_homme"
            className="block w-full border rounded px-3 py-2"
            value={form.victime_homme}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
        <label className="block mb-2 font-semibold">
          Victimes Femmes
          <input
            type="number"
            name="victime_femme"
            className="block w-full border rounded px-3 py-2"
            value={form.victime_femme}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
        <label className="block mb-2 font-semibold">
          Victimes Mineurs
          <input
            type="number"
            name="victime_mineur"
            className="block w-full border rounded px-3 py-2"
            value={form.victime_mineur}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
        <label className="block mb-2 font-semibold">
          Mise en cause
          <input
            type="number"
            name="mise_cause"
            className="block w-full border rounded px-3 py-2"
            value={form.mise_cause}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
        <label className="block mb-2 font-semibold">
          Nationaux
          <input
            type="number"
            name="nationaux"
            className="block w-full border rounded px-3 py-2"
            value={form.nationaux}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
        <label className="block mb-2 font-semibold">
          Étrangers
          <input
            type="number"
            name="etrangers"
            className="block w-full border rounded px-3 py-2"
            value={form.etrangers}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
        <label className="block mb-2 font-semibold">
          Réfugiés
          <input
            type="number"
            name="refugies"
            className="block w-full border rounded px-3 py-2"
            value={form.refugies}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
        <label className="block mb-2 font-semibold">
          Immigrés
          <input
            type="number"
            name="immigres"
            className="block w-full border rounded px-3 py-2"
            value={form.immigres}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => navigate("/judiciaire/infraction")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
