import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import logo from "../images/logo_e-dpvn.png";
import { useSelector } from "react-redux";

export default function Layout() {
  const user = useSelector(state => state.auth.user);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between h-16 px-8 border-b bg-white">
        <div className="flex items-center gap-3">
          <img src={logo} alt="e-dpvn" className="w-9 h-9" />
          <span className="text-xl font-bold text-violet-700">e-DPVN</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-600">
            Bonjour <span className="font-bold">{user?.username}</span>
          </span>
          <span className="text-gray-400 text-sm">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Déconnexion
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-8 py-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      {/* Footer */}
      <footer className="py-4 px-8 bg-white border-t text-center text-xs text-gray-500">
        © {new Date().getFullYear()} <a href="#" className="font-semibold text-violet-600">NerPulse</a> — e-DPVN &mdash; Tous droits réservés.
      </footer>
    </div>
  );
}
