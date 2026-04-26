import React, { useState } from "react";
import './Login.css';
import './App.css';
import { useNavigate, Link } from "react-router-dom";
import { saveToken, getUser } from './lib/auth';

const API_URL = "https://api-1-kkrk.onrender.com";

function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.success && result.token) {
        // ✅ Sauvegarder le JWT dans localStorage
        saveToken(result.token);

        // ✅ Décoder et passer l'utilisateur à App.js
        const userData = getUser();
        onLogin(userData);

        navigate("/accueil");
      } else {
        setMessage(result.message || "Erreur de connexion");
      }
    } catch (error) {
      setMessage("Erreur réseau ou serveur");
      console.error("Erreur lors de la requête :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <center>
          <p style={{ marginTop: '1rem' }}>
            Pas encore de compte ? <Link to="/register">S'inscrire</Link>
          </p>
        </center>

        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
}

export default Login;