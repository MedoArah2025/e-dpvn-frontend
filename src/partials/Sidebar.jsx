import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome, FiFileText, FiUsers, FiBarChart2, FiChevronRight, FiActivity,
  FiClipboard, FiUserCheck, FiAlertCircle, FiMenu, FiX,
} from "react-icons/fi";
import logo from "../images/logo_e-dpvn.png";
import { FiMapPin } from "react-icons/fi";

const GROUPS = [
  {
    categorie: "administratif",
    label: "Administratif",
    icon: <FiFileText />,
    color: "from-blue-400 to-blue-600",
    badge: null,
    activities: [
      { label: "Amendes forfaitaires", path: "/administratif/amende-forfaitaire" },
      { label: "Autres déclarations", path: "/administratif/autres-declarations" },
      { label: "CIN", path: "/administratif/cin" },
      { label: "Déclaration perte", path: "/administratif/declaration-perte" },
      { label: "Procuration", path: "/administratif/procuration" },
      { label: "Résidence", path: "/administratif/residence" },
    ],
  },
  {
  categorie: "circulation",
  label: "Circulation",
  icon: <FiBarChart2 />,
  color: "from-sky-400 to-blue-600",
  badge: null,
  activities: [
    { label: "Engins immobilisés", path: "/circulation/engin-immobilise" },
    { label: "Pièces retirées", path: "/circulation/piece-retire" },
    { label: "Vitres teintées", path: "/circulation/vitre-teintee" },
    { label: "Contrôles routiers", path: "/circulation/controle-routier" },  // <-- AJOUT ICI
  ],
},

  {
    categorie: "constat",
    label: "Constats",
    icon: <FiAlertCircle />,
    color: "from-orange-400 to-orange-600",
    badge: "Nouveau",
    activities: [
      {
        label: "Accidents de circulation",
        path: "/circulation/constat/accident-circulation"
      },
    ],
  },
  {
    categorie: "disposition",
    label: "Disposition",
    icon: <FiClipboard />,
    color: "from-pink-400 to-pink-600",
    badge: null,
    activities: [
      { label: "Douane", path: "/dispositions/douane" },
      { label: "Ocritis", path: "/dispositions/ocrit-im" },
      { label: "DPJ", path: "/dispositions/dpj" },
      { label: "DPMF", path: "/dispositions/dpmf" },
      { label: "DST", path: "/dispositions/dst" },
      { label: "Pavillon E", path: "/dispositions/pavillon-e" },
      { label: "SLCT CTO", path: "/dispositions/slct-cto" },
      { label: "Soniloga", path: "/dispositions/soniloga" },
    ],
  },
  {
    categorie: "judiciaire",
    label: "Judiciaire",
    icon: <FiActivity />,
    color: "from-violet-500 to-purple-700",
    badge: null,
    activities: [
      { label: "Autres Saisies", path: "/judiciaire/autre-saisie" },
      { label: "Déclarations de vol", path: "/judiciaire/declaration-vol" },
      { label: "Découverte de cadavre", path: "/judiciaire/decouverte-cadavre" },
      { label: "Déferrements", path: "/judiciaire/deferement" },
      { label: "Garde à vue", path: "/judiciaire/gav" },
      { label: "Incendies", path: "/judiciaire/incendie" },
      { label: "Infractions", path: "/judiciaire/infraction" },
      { label: "Noyades", path: "/judiciaire/noyade" },
      { label: "Personnes enlevées", path: "/judiciaire/personnes-enleve" },
      { label: "Personnes interpellées", path: "/judiciaire/personnes-interpelle" },
      { label: "Plaintes", path: "/judiciaire/plainte" },
      { label: "Réquisitions", path: "/judiciaire/requisition" },
      { label: "Saisie de drogue", path: "/judiciaire/saisie-drogue" },
      { label: "Véhicules enlevés", path: "/judiciaire/vehicule-enleve" },
    ],
  },
  {
    categorie: "operation",
    label: "Operations",
    icon: <FiActivity />,
    color: "from-cyan-500 to-blue-800",
    badge: null,
    activities: [
      { label: "Coups de poing", path: "/operation/coup-poing" },
      { label: "Descentes", path: "/operation/descente" },
      { label: "Patrouilles", path: "/operation/patrouille" },
      { label: "Positionnements", path: "/operation/positionnement" },
      { label: "Raffles", path: "/operation/raffle" },
      { label: "Services d’ordre", path: "/operation/service-ordre" },
    ],
  },
  {
    categorie: "rh",
    label: "Ressources Humaines",
    icon: <FiUserCheck />,
    color: "from-green-400 to-green-700",
    badge: null,
    activities: [
      { label: "Effectifs RH", path: "/rh/effectifs" },
    ],
  },
    {
  categorie: "spja",
  label: "Mises à Disposition SPJA",
  icon: <FiClipboard />,
  color: "from-yellow-400 to-orange-600",
  badge: null,
  activities: [
    { label: "Mises à disposition SPJA", path: "/spja/mises-a-disposition" },
  ],
},
];

export default function Sidebar() {
  const user = useSelector(state => state.auth.user);
  const groups = user?.activity_groups || [];
  const location = useLocation();
  const [open, setOpen] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mobile: ferme le menu après navigation
  const handleNavClick = () => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  useEffect(() => {
    GROUPS.forEach(gr => {
      if (location.pathname.startsWith("/" + gr.categorie)) {
        setOpen(o => ({ ...o, [gr.categorie]: true }));
      }
    });
    handleNavClick();
    // eslint-disable-next-line
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const overlay = (
    <div
      className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 lg:hidden ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      onClick={() => setSidebarOpen(false)}
    />
  );

  return (
    <>
      {/* BOUTON BURGER */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-violet-600 shadow-lg text-white lg:hidden hover:scale-110 hover:bg-violet-800 transition"
        onClick={() => setSidebarOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <FiMenu size={26} />
      </button>

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl border-r border-slate-800 transition-all duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0
      `}>
        {/* Close cross (mobile) */}
        <button
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-slate-700/80 text-white hover:bg-violet-700 transition lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fermer le menu"
        >
          <FiX size={24} />
        </button>
        {/* LOGO */}
        <div className="flex items-center px-7 py-6 border-b border-slate-700 bg-gradient-to-r from-violet-900/70 to-slate-900/80 sticky top-0 z-30">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl shadow-lg mr-3 shrink-0" />
          <span className="text-2xl font-extrabold tracking-tight select-none">
            <span className="text-violet-400">e-</span>DPVN
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-5 custom-scrollbar">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-7 py-2.5 rounded-xl font-semibold transition-all duration-150 group
                  hover:bg-violet-700/25 hover:text-violet-200 hover:scale-[1.04] active:scale-95
                  ${isActive ? "bg-violet-700/30 text-violet-200 shadow-lg ring-2 ring-violet-500/20" : "text-white/90"}`
                }
                end
                onClick={handleNavClick}
              >
                <FiHome className="text-lg" />
                <span>Tableau de bord</span>
              </NavLink>
            </li>
            {/* ACTIVITES */}
            <li>
              <div className="uppercase text-xs text-slate-400 px-7 pt-4 pb-1 font-bold tracking-widest sticky top-0 bg-gradient-to-b from-slate-900/95 via-slate-900/70 to-transparent z-20">Activités</div>
            </li>
            {GROUPS.filter(cat => groups.find(gr => gr.categorie === cat.categorie)).map(cat => (
              <li key={cat.categorie} className="relative">
                <button
                  type="button"
                  className={`flex items-center justify-between w-full px-7 py-2.5 rounded-xl font-semibold transition
                    ${open[cat.categorie] ? "bg-gradient-to-r " + cat.color + " text-white shadow-xl ring-2 ring-violet-500/10 scale-[1.03]" : "text-white/80 hover:bg-slate-800/70 hover:scale-[1.02]"}
                  `}
                  onClick={() => setOpen(o => ({ ...o, [cat.categorie]: !o[cat.categorie] }))}
                >
                  <span className="flex items-center gap-3">
                    {cat.icon}
                    {cat.label}
                    {cat.badge && (
                      <span className="ml-2 bg-gradient-to-tr from-pink-400 to-orange-500 text-white rounded-full text-xs px-2 py-0.5 shadow animate-pulse">
                        {cat.badge}
                      </span>
                    )}
                  </span>
                  <FiChevronRight className={`transition-transform duration-200 ${open[cat.categorie] ? "rotate-90" : ""}`} />
                </button>
                <ul
                  className={`
                    transition-all duration-300 origin-top bg-slate-900/95 shadow-2xl
                    ${open[cat.categorie] ? "max-h-[440px] py-2 opacity-100 overflow-y-auto custom-scrollbar" : "max-h-0 py-0 opacity-0 overflow-hidden"}
                    rounded-2xl mt-1 ring-1 ring-black/10
                  `}
                  style={{
                    transitionProperty: "max-height, opacity, padding",
                    willChange: "max-height, opacity, padding"
                  }}
                >
                  {/* Sticky titre sous-menu */}
                  <li className="sticky top-0 z-10 bg-slate-900/95 pb-1 shadow-sm">
                    <span className="px-10 py-1 text-xs uppercase text-violet-300 tracking-wider font-bold">{cat.label}</span>
                  </li>
                  {cat.activities.map((act, idx) => (
                    <li key={act.path + idx}>
                      <NavLink
                        to={act.path}
                        className={({ isActive }) =>
                          `block px-10 py-2 rounded-lg transition-all duration-150 text-sm font-medium group
                          hover:bg-gradient-to-l hover:from-violet-700/40 hover:to-violet-500/40 hover:text-violet-100 hover:scale-[1.03]
                          active:scale-95
                          ${isActive
                            ? `bg-gradient-to-r ${cat.color} text-violet-100 shadow-lg font-bold ring-2 ring-violet-500/10 scale-[1.03]`
                            : "text-slate-200"}`
                        }
                        end
                        onClick={handleNavClick}
                      >
                        {act.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            {/* STATISTIQUES */}
            <li>
              <div className="uppercase text-xs text-slate-400 px-7 pt-4 pb-1 font-bold tracking-widest sticky top-0 bg-gradient-to-b from-slate-900/95 via-slate-900/70 to-transparent z-20">
                Statistiques
              </div>
            </li>
            {/* 1. Stats par Unité (TOUS peuvent voir) */}
            <li>
              <NavLink
                to="/stats/unite"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-7 py-2.5 rounded-xl font-semibold transition-all duration-150 group
                  hover:bg-cyan-700/30 hover:text-cyan-200 hover:scale-[1.04] active:scale-95
                  ${isActive ? "bg-cyan-700/30 text-cyan-200 shadow-lg ring-2 ring-cyan-400/15" : "text-white/90"}`
                }
                end
                onClick={handleNavClick}
              >
                <FiBarChart2 />
                <span>Stats par Unité</span>
              </NavLink>
            </li>
            {/* 2. Statistiques Générales (seulement admin/direction) */}
            {(user?.is_superuser ||
              user?.is_staff ||
              user?.role === "admin" ||
              user?.role === "direction" ||
              (user?.roles && (user.roles.includes("admin") || user.roles.includes("direction")))
            ) && (
              <li>
                <NavLink
                  to="/stats/globales"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-7 py-2.5 rounded-xl font-semibold transition-all duration-150 group
                    hover:bg-yellow-600/30 hover:text-yellow-200 hover:scale-[1.04] active:scale-95
                    ${isActive ? "bg-yellow-600/30 text-yellow-200 shadow-lg ring-2 ring-yellow-400/15" : "text-white/90"}`
                  }
                  end
                  onClick={handleNavClick}
                >
                  <FiBarChart2 />
                  <span>Statistiques Générales</span>
                  <span className="ml-2 bg-gradient-to-tr from-pink-400 to-yellow-400 text-white rounded-full text-xs px-2 py-0.5 animate-bounce shadow">
                    Nouveau
                  </span>
                </NavLink>
              </li>
            )}

            {/* ===== SECTION SÉPARÉE CARTE INFRACTIONS PRO ===== */}
            {(user?.is_superuser ||
              user?.is_staff ||
              user?.role === "admin" ||
              user?.role === "direction" ||
              (user?.roles && (user.roles.includes("admin") || user.roles.includes("direction")))
            ) && (
              <>
                <li>
                  <div className="uppercase text-xs text-slate-400 px-7 pt-4 pb-1 font-bold tracking-widest sticky top-0 bg-gradient-to-b from-slate-900/95 via-slate-900/70 to-transparent z-20">
                    Cartographie
                  </div>
                </li>
                <li>
                  <NavLink
                    to="/judiciaire/infractions/carte-pro"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-7 py-2.5 rounded-xl font-semibold transition-all duration-150 group
                      hover:bg-pink-700/30 hover:text-pink-100 hover:scale-[1.04] active:scale-95
                      ${isActive ? "bg-pink-700/30 text-pink-100 shadow-lg ring-2 ring-pink-400/15" : "text-white/90"}`
                    }
                    end
                    onClick={handleNavClick}
                  >
                    <FiMapPin />
                    <span>Carte Infractions PRO</span>
                    <span className="ml-2 bg-gradient-to-tr from-pink-400 to-yellow-400 text-white rounded-full text-xs px-2 py-0.5 animate-pulse shadow">
                      Nouveau
                    </span>
                  </NavLink>
                </li>
              </>
            )}
            {/* ===== FIN SECTION CARTE INFRACTIONS PRO ===== */}
          </ul>
        </nav>
        {/* FOOTER */}
        <div className="text-xs text-slate-500 py-5 px-7 mt-auto border-t border-slate-800 bg-gradient-to-tr from-slate-900 to-slate-800">
          © {new Date().getFullYear()} <span className="font-bold text-violet-400">NerPulse</span> — e-DPVN
          <br />
          <span className="text-slate-700">v1.0</span>
        </div>
      </aside>
      {overlay}
    </>
  );
}
