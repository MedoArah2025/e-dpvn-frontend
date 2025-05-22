import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <button
      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      onClick={handleLogout}
    >
      Déconnexion
    </button>
  );
}
