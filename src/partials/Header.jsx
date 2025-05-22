import logo from "../images/logo_e-dpvn.png";
import { useSelector } from "react-redux";

export default function Header() {
  const user = useSelector(state => state.auth.user);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white shadow px-8 py-3 border-b">
      <div className="flex items-center gap-3">

      </div>
      <div className="flex items-center gap-8">
        <span className="text-gray-500">
          Bonjour <b>{user?.username || ""}</b>
        </span>
        <span className="text-gray-400 text-sm">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
          })}
        </span>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm shadow"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
