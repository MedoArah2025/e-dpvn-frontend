import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo_e-dpvn2.png"; // Ton logo doit être en PNG ou SVG sur fond transparent

export default function AccueilVitrine() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-900 to-blue-600">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <img
          src={logo}
          alt="Logo e-DPVN"
          className="h-40 w-auto mb-10 drop-shadow-xl"
          style={{ background: "none" }}
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow mb-6">
          Bienvenue sur la plateforme <span className="text-blue-200">e-DPVN</span>
        </h1>
        <p className="max-w-2xl text-lg text-white/85 text-center mb-10 font-medium">
          <b>e-DPVN</b> est la solution numérique officielle de suivi, gestion et analyse des activités policières à Niamey.<br />
          Statistiques, rapports, géolocalisation, tableaux de bord et bien plus, accessibles en toute sécurité aux unités habilitées.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-800 text-white text-xl px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-700 hover:scale-105 transition-all"
        >
          Se connecter
        </button>
      </main>
      <footer className="text-center py-4 text-white/70 text-sm">
        &copy; {new Date().getFullYear()} — Plateforme e-DPVN • Développée par <b>NerPulse</b>
      </footer>
    </div>
  );
}
