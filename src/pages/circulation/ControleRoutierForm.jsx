import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// Motifs officiels — à compléter selon besoin
const MOTIFS = [
  "Défaut de casque",
  "Motos en défaut de plaque",
  "Véhicules en défaut de plaque",
  "Véhicules avec vitres teintées",
  "Véhicules immobilisés pour autres infractions",
  "Défaut de ceinture",
  "Téléphone",
  "Arrêt abusif",
  "Surcharge de cabine",
  "Feux rouges",
  "Arrêt à double files",
  "Sens interdit suivi",
  "Défaut de visite technique",
  "Défaut de la CNSS",
  "Plaque non conforme (ancienne plaque)",
  "Avoir abordé un carrefour sans précaution suffisante",
  "Défaut d’assurance",
  "Défaut de vignette",
  "Défaut d’un phare",
  "Défaut de feux de position",
  "Chevauchement de la chaussée",
  "Refus d’obtempérer",
  "Vitres teintées",
  "Circulation en sens inverse",
  "Défaut de patente",
  "Défaut de permis de taxi",
  "Circulation à double files",
  "Défaut de catégorie",
  "Défaut de feux de stop",
  "Défaut de clignotant",
  "Défaut de rétroviseur",
  "Surcharge des passagers",
  "Non-respect au panneau de stop",
  "Défaut de feux de gabarit",
  "Usure pneumatique",
  "Défaut de triangle de panne",
  "Arrêt dans un virage",
  "Refus de priorité",
  "Engagement imprudent",
  "Conducteur non maître de son volant",
  "Ouvrage non contourné par la droite",
  "Plaque non conforme",
  "Non-respect de l’heure de pointe",
];

export default function ControleRoutierForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // récupère l'id d'édition si on est sur /:id/edit
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    date_controle: "",
    motif: "",
    nbre_motos: 0,
    nbre_autos: 0,
    nbre_tricycles: 0,
    observation: "",
  });

  // Si édition, charge la donnée existante
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/activities/circulation/controles-routiers/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data))
        .catch(() => alert("Impossible de charger la donnée pour édition"));
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = id
      ? `http://localhost:8000/api/activities/circulation/controles-routiers/${id}/`
      : "http://localhost:8000/api/activities/circulation/controles-routiers/";
    const method = id ? "put" : "post";

    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => navigate("/circulation/controle-routier"))
      .catch(() => alert("Erreur lors de l'enregistrement"));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">
        {id ? "Modifier" : "Ajouter"} Contrôle Routier
      </h2>
      <div className="mb-4">
        <label>Date contrôle</label>
        <input
          type="date"
          name="date_controle"
          value={form.date_controle}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Motif</label>
        <select
          name="motif"
          value={form.motif}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Sélectionner un motif</option>
          {MOTIFS.map((m) => (
            <option value={m} key={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label>Motos</label>
        <input
          type="number"
          name="nbre_motos"
          value={form.nbre_motos}
          onChange={handleChange}
          min="0"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Autos</label>
        <input
          type="number"
          name="nbre_autos"
          value={form.nbre_autos}
          onChange={handleChange}
          min="0"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Tricycles</label>
        <input
          type="number"
          name="nbre_tricycles"
          value={form.nbre_tricycles}
          onChange={handleChange}
          min="0"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label>Observation</label>
        <textarea
          name="observation"
          value={form.observation}
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
