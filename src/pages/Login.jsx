import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess, setUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Authentification
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/token/`,
        { username, password }
      );
      dispatch(loginSuccess({ token: data.access }));
      localStorage.setItem("token", data.access);

      // Profil utilisateur
      const profileRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/user/`,
        { headers: { Authorization: `Bearer ${data.access}` } }
      );
      const user = profileRes.data;
      dispatch(setUser(user));
      localStorage.setItem("user", JSON.stringify(user));

      // Redirection selon le rôle
      if (user.role === "admin") {
        navigate('/dashboard');
      } else if (user.role === "direction") {
        navigate('/stats/globales');
      } else if (user.role === "unite") {
        navigate('/stats/unite');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form className="bg-white p-8 shadow rounded w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="mb-6 text-xl font-bold text-center">Connexion e-DPVN</h2>
        <input
          className="mb-2 p-2 border w-full rounded"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
          disabled={loading}
        />
        <input
          className="mb-4 p-2 border w-full rounded"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
        <button
          className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
